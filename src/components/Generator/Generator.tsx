import Footer from '../Footer/Footer';
import ModrinthModManager from '../ModrinthModManager/ModrinthModManager';
import './Generator.css';
import Logo from '../../../public/Logo.png';

const Generator: React.FC = () => {
  return (
    <div className="wrapper">
    <a href='/'><img className='logo' src={Logo} /></a>
    <ModrinthModManager />
    <Footer />
  </div>
  );
};

export default Generator
