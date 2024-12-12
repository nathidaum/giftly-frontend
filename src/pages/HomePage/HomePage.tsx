import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import templates from "../../data/templates.json";

const HomePage = () => {
  const navigate = useNavigate();

  const handleCreateCardClick = () => {
    navigate("/create");
  };

  return (
    <div className="homepage">
      <div className="homepage-content">
        <h1 className="homepage-title">from many, with love. 🤍</h1>
        <p className="homepage-description">
          the most memorable and simple way to bring any group together to sign
          a group card online. no more passing a card around, and no one gets left out. it's so easy, you'll love it.
        </p>
        <button className="homepage-cta-button" onClick={handleCreateCardClick}>
          let's get started
        </button>
      </div>
      <div className="homepage-floating-cards">
        {templates.slice(0, 3).map((template) => (
          <div
            key={template.id}
            className="card-template"
            style={{
              backgroundImage: `url(${template.image})`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
