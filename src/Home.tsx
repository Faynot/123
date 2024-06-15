import { useEffect, useState } from "react";
import Logo from '../public/Logo.png';
import Footer from "./components/Footer/Footer";
import Modloader from "./components/Modloader/Modloader";
import Version from "./components/Version/Version";
import { getFromLocalStorage, saveToLocalStorage } from "./storage";

const Home = () => {
  const [SelectedAI, setSelectedAI] = useState(false);

  useEffect(() => {
    const storedAI = getFromLocalStorage("SelectedAI");
    if (storedAI !== null) {
      setSelectedAI(storedAI);
    }
  }, []);

  const handleAIChange = (event: any) => {
    const isChecked = event.target.checked;
    setSelectedAI(isChecked);
    saveToLocalStorage("SelectedAI", isChecked); // Сохраняем выбранное значение в localStorage
  };

  console.log(SelectedAI);

  return (
    <div className="wrapper">
      <a href="/">
        <img className="logo" src={Logo} />
      </a>
      <h2>Welcome to INF PACK!</h2>
      <div className="window">
        <h2>Why should you choose us</h2>
        <div className="window-window">
          <h2  className="h52" >
            We have a default pack with optimization and the
            <br />
            most necessary mods, but you can install your own,
            <br />
            or use an <label className="AI">AI</label> mod and they will select
            mods for you to
            <br />
            suit your needs
          </h2>
        </div>
        <h3 className="centered-h3">Choose your version and modloader</h3>
        <div className="select-c">
          <Version />
          <Modloader />
        </div>
        <button
          className="btn-sumbit"
          onClick={() => (window.location.href = "/Generator")}
        >
          Create new pack
        </button>
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={SelectedAI}
            onChange={handleAIChange}
            style={{ display: "none" }} // Скрываем стандартный чекбокс
          />
          <span className="checkmark"></span>
          <p>Use AI mode</p>
        </label>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
