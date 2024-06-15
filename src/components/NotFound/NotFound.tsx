import Footer from "../Footer/Footer";

const NotFound: React.FC = () => {
  return (
    <div className="wrapper">
      <a href="/">
        <img className="logo" src="/public/Logo.png" alt="Logo" />
      </a>
      <h1>404</h1>
      <h2>Page not found</h2>
      <Footer />
    </div>
  );
};

export default NotFound;
