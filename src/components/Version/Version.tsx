import axios from "axios";
import { useEffect, useState } from "react";
import { saveToLocalStorage } from "../../storage";
import "./Version.css";

const Version = () => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await axios.get(
          "https://launchermeta.mojang.com/mc/game/version_manifest.json",
        );
        const versionNames = response.data.versions
          .filter((version: any) => version.type === "release")
          .map((version: any) => version.id);
        setVersions(versionNames);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };

    fetchVersions();
  }, []);

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedVersion(selectedValue);
    saveToLocalStorage("selectedVersion", selectedValue); // Сохраняем выбранную версию в localStorage
  };

  return (
    <div className="version-container">
      <div className="sl-wr">
        <select
          className="version-select"
          value={selectedVersion}
          onChange={handleChange}
        >
          <option className="oh" value="">
            Select a version
          </option>
          {versions.map((version, index) => (
            <option key={index} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Version;
