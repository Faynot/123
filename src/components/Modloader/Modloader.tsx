import { ChangeEvent, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../../storage";
import "./Modloader.css";

const Modloader = () => {
  const [selectedModLoader, setSelectedModLoader] = useState("Select mod loader");

  useEffect(() => {
    const storedModLoader = getFromLocalStorage("selectedModLoader");
    if (storedModLoader) {
      setSelectedModLoader(storedModLoader);
    }
  }, []);

  const handleModLoaderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedModLoader(selectedValue);
    saveToLocalStorage("selectedModLoader", selectedValue); // Сохраняем выбранный мод-лоадер в localStorage
  };

  return (
    <div className="mod-container">
      <div className="sl-wr">
        <select
          className="version-select"
          value={selectedModLoader}
          onChange={handleModLoaderChange}
        >
          <option value="fabric">Fabric</option>
          <option value="forge">Forge</option>
          <option value="quilt">Quilt</option>
        </select>
      </div>
    </div>
  );
};

export default Modloader;
