import { useState } from "react";
import { useNavigate } from "react-router-dom";
import templates from "../../data/templates.json";
import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import "./CardCreationPage.css";
import { createCard } from "../../api";

const CardCreationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [visibleTemplates, setVisibleTemplates] = useState(
    templates.slice(0, 4)
  ); // Initially show 4 templates
  const [startIndex, setStartIndex] = useState(0);

  const navigate = useNavigate();

  const handleNextTemplates = () => {
    const newIndex = startIndex + 4;
    if (newIndex < templates.length) {
      setVisibleTemplates(templates.slice(newIndex, newIndex + 4));
      setStartIndex(newIndex);
    }
  };

  const handlePrevTemplates = () => {
    const newIndex = startIndex - 4;
    if (newIndex >= 0) {
      setVisibleTemplates(templates.slice(newIndex, newIndex + 4));
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
    <div>
      <div className="card-creation-container">
        {/* Card Details Form */}
        <form className="card-creation-form">
          <h1 className="card-creation-title">
            Create a card & get others to write something nice! 🎉
          </h1>

          <input
            type="text"
            placeholder="Celebrating Alex!"
            value={title}
            size={500}
            onChange={(e) => setTitle(e.target.value)}
            className="card-creation-input"
          />
          <label>Give your card a nice title.</label>

          <textarea
            placeholder="Let's all take some time to write some nice words."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="card-creation-textarea"
          ></textarea>
          <label>Formulate a message to let the contributors know.</label>

          <button
            type="button"
            onClick={handleCreateCard}
            className={`create-button ${
              !title || !message ? "disabled" : ""
            }`}
            disabled={!title || !message}
          >
            Create card & get link to share
          </button>
        </form>

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
            <ActionIcon
              variant="filled"
              color="rgba(82, 82, 82, 1)"
              size="sm"
              radius="xl"
              aria-label="Settings"
              className={startIndex === 0 ? "disabled-action-icon" : ""}
            >
              <IconChevronLeft onClick={handlePrevTemplates} />
            </ActionIcon>
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
            <ActionIcon
              variant="filled"
              color="rgba(82, 82, 82, 1)"
              size="sm"
              radius="xl"
              aria-label="Settings"
              className={
                startIndex + 4 >= templates.length ? "disabled-action-icon" : ""
              }
            >
              <IconChevronRight onClick={handleNextTemplates} />
            </ActionIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreationPage;
