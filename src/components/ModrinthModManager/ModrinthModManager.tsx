import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from "react";
import { getFromLocalStorage } from "../../storage";

interface Mod {
  project_id: string;
  title: string;
  icon_url: string;
  versions: { [key: string]: any }[];
  download_url?: string;
  autoAdded?: boolean;
}

const ai = getFromLocalStorage("SelectedAI") || false;

const version = getFromLocalStorage("selectedVersion") || "1.20.1";
const modLoader = getFromLocalStorage("selectedModLoader") || "fabric";
const modNamesToAddFABRIC = [
  "fabric-api",
  "Mod Menu",
  "Architectury API",
  "Better Anvil",
  "Camera Utils",
  "Chat Heads",
  "CIT Resewn",
  "Concurrent Chunk Management Engine",
  "Continuity",
  "DCCH",
  "e4mc",
  "Ears",
  "Entity Model Features",
  "Entity Texture Features",
  "EntityCulling",
  "fabric-permissions-api",
  "Fabric Sky Boxes",
  "FerriteCore",
  "Horse Stats Vanilla",
  "Immediately Fast",
  "Indium",
  "Iris",
  "Krypton",
  "Lamb Dynamic Lights",
  "Language Reload",
  "Lithium",
  "Main Menu Credits",
  "MaLiLib",
  "Memory Leak Fix",
  "Model Gap Fix",
  "More Culling",
  "No Resource Pack Warnings",
  "No Telemetry",
  "Sodium",
  "Very Many Players",
  "fabric-language-kotlin",
  "Cloth Config",
  "Cicada",
];
const modNamesToAddQUILT = ["quilted-fabric-api", "Emotecraft", "Mod Menu"];
const modNamesToAddFORGE = ["JourneyMap"];

const getModNamesToAdd = (loader: string) => {
  switch (loader) {
    case "fabric":
      return modNamesToAddFABRIC;
    case "quilt":
      return modNamesToAddQUILT;
    case "forge":
      return modNamesToAddFORGE;
    default:
      return [];
  }
};

const fetchModVersions = async (mod: Mod) => {
  const response = await axios.get(
    `https://api.modrinth.com/v2/project/${mod.project_id}/version`,
    { timeout: 10000 },
  );
  const versionData = response.data.find((v: any) =>
    v.game_versions.includes(version),
  );
  if (versionData) {
    return { ...mod, download_url: versionData.files[0].url };
  }
  return mod;
};

const ModrinthModManager: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    window.addEventListener("error", (event) => {
      if (event.error && event.error.status === 502) {
        setHasError(true);
      }
    });

    if (hasError) {
      window.location.href = "/";
    }
  }, [hasError]);

  try {
  } catch (error) {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Mod[]>([]);
  const [selectedMods, setSelectedMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  const fetchMods = useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://api.modrinth.com/v2/search`,
            {
              params: {
                query,
                facets: `[["versions:${version}"],["categories:${modLoader}"]]`,
              },
              timeout: 10000,
            },
          );
          setSearchResults(
            response.data.hits.map((mod: Mod) => ({ ...mod, autoAdded: false })),
          );
        } catch (error) {
          console.error("Error fetching mods:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    fetchMods(searchQuery);
  }, [searchQuery, fetchMods]);

  useEffect(() => {
    const addModLoaderDependency = async () => {
        const modNamesToAdd = getModNamesToAdd(modLoader);
        const modsToAdd = await Promise.all(
            modNamesToAdd.map(async (modName) => {
                if (!selectedMods.find((mod) => mod.title === modName)) {
                    try {
                        const response = await axios.get(
                            `https://api.modrinth.com/v2/search`,
                            {
                                params: {
                                    query: modName,
                                    facets: `[["versions:${version}"],["categories:${modLoader}"]]`,
                                },
                                timeout: 10000,
                            },
                        );
                        const mod = response.data.hits[0];
                        if (mod) {
                            return await fetchModVersions({ ...mod, autoAdded: true });
                        }
                    } catch (error) {
                        console.error(`Error fetching ${modName} mod:`, error);
                    }
                }
                return null;
            }),
        );
        setSelectedMods((prevMods) => {
            const newMods = modsToAdd.filter(
                (mod): mod is Mod => mod !== null && !prevMods.some((m) => m.project_id === mod.project_id),
            );
            return [...prevMods, ...newMods];
        });
    };
    addModLoaderDependency();
}, [modLoader, version]);


  const handleAddMod = async (mod: Mod) => {
    if (!selectedMods.find((m) => m.project_id === mod.project_id)) {
      try {
        setLoading(true);
        const modWithVersion = await fetchModVersions(mod);
        setSelectedMods((prevMods) => [
          ...prevMods,
          { ...modWithVersion, autoAdded: false },
        ]);
      } catch (error) {
        console.error("Error fetching mod version:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveMod = (mod: Mod) => {
    setSelectedMods((prevMods) =>
      prevMods.filter((m) => m.project_id !== mod.project_id),
    );
  };

  const handleRemoveAutoAddedMods = () => {
    setSelectedMods((prevMods) => prevMods.filter((mod) => !mod.autoAdded));
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const minecraftFolder = zip.folder(".minecraft")!;
    const modsFolder = minecraftFolder.folder("mods")!;
  
    zip.folder(".minecraft")!.folder("resourcepacks");
  
    const response = await axios.get("/icon.png", { responseType: "blob" });
    zip.folder(".minecraft")!.file("icon.png", response.data);
  
    await Promise.all(
      selectedMods.map(async (mod) => {
        if (mod.download_url) {
          try {
            const response = await axios.get(mod.download_url, {
              responseType: "blob",
              timeout: 10000,
            });
            modsFolder.file(`${mod.title}.jar`, response.data);
          } catch (error) {
            console.error("Error downloading mod:", error);
          }
        }
      }),
    );
  
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "infpack.zip");
    });
  };
  

  return (
    <div>
      <div
        style={{
          width: "700px",
          height: "600px",
          background: "#333",
          padding: "20px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            fontFamily: "Arial",
            color: "#fff",
          }}
        >
          <div style={{ width: "320px", marginRight: "20px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mods..."
              className="ul-mod"
            />
            {loading ? (
              <div className="loader"></div>
            ) : (
              searchQuery && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    width: "100%",
                    maxHeight: "100%",
                    overflowY: "auto",
                  }}
                >
                  {searchResults.map((mod) => (
                    <li
                      key={mod.project_id}
                      onClick={() => handleAddMod(mod)}
                      className="li-mod"
                      style={{ color: mod.autoAdded ? "blue" : "white" }}
                    >
                      {mod.title}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
          <div style={{ width: "400px" }}>
            <h3>Selected Mods:</h3>
            <ul
              style={{
                listStyle: "none",
                maxHeight: "330px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                background: "#444",
              }}
            >
              {selectedMods.map((mod) => (
                <li
                  key={mod.project_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                >
                  <img
                    src={mod.icon_url}
                    alt={mod.title}
                    width="50"
                    style={{ marginRight: "10px", borderRadius: "5px" }}
                  />
                  <span style={{ color: mod.autoAdded ? "blue" : "white" }}>
                    {mod.title}
                  </span>
                  <button
                    onClick={() => handleRemoveMod(mod)}
                    style={{
                      marginLeft: "auto",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      color: "#fff",
                    }}
                    className="btn-mod"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {selectedMods.length > 0 && (
              <>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    marginTop: "10px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    color: "#fff",
                  }}
                  className="btn-mod"
                >
                  Download Mods
                </button>
                <button
                  onClick={handleRemoveAutoAddedMods}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    marginTop: "10px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    color: "#fff",
                    background: "red",
                  }}
                  className="btn-mod"
                >
                  Remove Auto-Added Mods
                </button>
              </>
            )}
            {ai && (
              <>
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask AI..."
                  className="ul-ai-mod"
                />
                <button
                  id="submitBtn"
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    width: "6rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    color: "#fff",
                  }}
                  className="btn-ai-mod"
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
                .loader {
                    border: 4px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 4px solid #3498db00;
                    width: 30px;
                    height: 30px;
                    animation: spin 2s linear infinite;
                    margin-left: 9rem;
                    margin-top: 9rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
      </style>
      {ai && (
        <>
          <div className="tooltip" id="tooltip">
            AI can very often work incorrectly
          </div>
        </>
      )}
    </div>
  );
};

export default ModrinthModManager;
