import Footer from "../Footer/Footer";
import Logo from '../../../public/Logo.png';

const Info: React.FC = () => {
  return (
    <div className="wrapper">
      <a href="/">
        <img className="logo" src={Logo} />
      </a>
      <h1>Hello! its info of INF PACK!</h1>
      <h2>
        This is an experimental project and may be slow and unreliable, but feel
        free to report bugs to us!
      </h2>
      <h1 className="h1-help-me-pls">
        <a href="mailto:faynotdev@gmail.com">Write to our mail!</a>
      </h1>
      <div className="div-help">
        <h2 className="h2-help" style={{ fontSize: "150%" }}>
          For example, the AI ​​mode may work every few times or not work at all
          for some users, we admit this and will not deny it, since this is an
          experimental site. Also on different versions - you{" "}
        </h2>
        <h2 className="h2-help" style={{ fontSize: "150%" }}>
          may have different mods that are in the default assembly, we warn you
          about this. If the server is too overloaded, you will be automatically
          redirected to the main page
        </h2>
        <h2 className="h2-help" style={{ fontSize: "150%" }}>
        If the API is too overloaded, then you will be automatically redirected to the main page to avoid overload itself and not harm the Modrinth API. This is a necessary measure, since due to technical reasons we cannot make it more convenient for users
        </h2>
      </div>
      <h3>site created by Faynot</h3>
      <Footer />
    </div>
  );
};

export default Info;
