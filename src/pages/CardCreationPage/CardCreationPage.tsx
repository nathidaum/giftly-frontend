import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import templates from "../../data/templates.json";
import "./CardCreationPage.css";
import { createCard } from "../../api";

const CardCreationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [visibleTemplates, setVisibleTemplates] = useState(
    templates.slice(0, 5)
  ); // Initially show 5 templates
  const [startIndex, setStartIndex] = useState(0);

  const navigate = useNavigate();

  const handleNextTemplates = () => {
    const newIndex = startIndex + 5;
    if (newIndex < templates.length) {
      setVisibleTemplates(templates.slice(newIndex, newIndex + 5));
      setStartIndex(newIndex);
    }
  };

  const handlePrevTemplates = () => {
    const newIndex = startIndex - 5;
    if (newIndex >= 0) {
      setVisibleTemplates(templates.slice(newIndex, newIndex + 5));
      setStartIndex(newIndex);
    }
  };

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
    <div className="card-creation-page">
      <div className="card-creation-container">
        {/* Card Preview */}
        <div className="card-preview">
          <div
            className="card-preview-template"
            style={{
              backgroundImage: `url(${
                templates.find((template) => template.id === selectedTemplate)
                  ?.image
              })`,
            }}
          ></div>

          {/* Template Selector */}
          <div className="carousel">
            <button
              className="carousel-arrow left-arrow"
              onClick={handlePrevTemplates}
              disabled={startIndex === 0}
            >
              ◀
            </button>
            <div className="carousel-templates">
              {visibleTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`template-option ${
                    template.id === selectedTemplate ? "selected" : ""
                  }`}
                  style={{ backgroundImage: `url(${template.image})` }}
                  onClick={() => setSelectedTemplate(template.id)}
                ></div>
              ))}
            </div>
            <button
              className="carousel-arrow right-arrow"
              onClick={handleNextTemplates}
              disabled={startIndex + 5 >= templates.length}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Card Details Form */}
        <form className="card-creation-form">
          <h1 className="card-creation-title">
            let’s make it personal & special! 🎉
          </h1>
          <label>give your card a nice title</label>
          <input
            type="text"
            placeholder="celebrating alex!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="card-creation-input"
          />
          <label>formulate a message to let the contributors know</label>
          <textarea
            placeholder="let's give our best wishes to alex and write something nice."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="card-creation-textarea"
          ></textarea>
          <button
            type="button"
            onClick={handleCreateCard}
            className="card-creation-button"
          >
            create card and get link to share
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardCreationPage;
