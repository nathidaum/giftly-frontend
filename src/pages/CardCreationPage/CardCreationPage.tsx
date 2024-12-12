import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TemplateSelector from "../../components/TemplateSelector/TemplateSelector";
import templates from "../../data/templates.json";
import "./CardCreationPage.css";
import { createCard } from "../../api";

const CardCreationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id);
  const navigate = useNavigate();

  const handleCreateCard = async () => {
    if (!title || !message) {
      alert("Please fill out both the title and message fields.");
      return;
    }

    const data = {
      title,
      message,
      templateId: selectedTemplate,
    };

    try {
      const createdCard = await createCard(data);
      console.log("Card Created:", createdCard);

      // Navigate to CardDetailsPage
      navigate(`/cards/${createdCard.id}`);
    } catch (error) {
      console.error("Error creating card:", error);
      alert("Failed to create the card. Please try again.");
    }
  };

  return (
    <div>
      <div className="card-creation-container">
        {/* Card Details Form */}
        <form className="card-creation-form">
          <h1 className="card-creation-title">
            Create a card & get others to write something nice! 📝
          </h1>

          <TemplateSelector
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />

          <input
            type="text"
            placeholder="Celebrating Alex!"
            value={title}
            size={500}
            onChange={(e) => setTitle(e.target.value)}
            className="card-creation-input"
          />
          <label>Give your card a nice title.</label>

          <input
            placeholder="Let's all take some time to write some nice words."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="card-creation-input"
          ></input>
          <label>Formulate a message to let the contributors know.</label>

          <button
            type="button"
            onClick={handleCreateCard}
            className={`create-button ${!title || !message ? "disabled" : ""}`}
            disabled={!title || !message}
          >
            Create card & get link to share
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardCreationPage;
