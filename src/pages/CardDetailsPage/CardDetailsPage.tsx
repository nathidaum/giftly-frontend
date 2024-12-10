import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCardById, publishCard } from "../../api/index"; // Import from api/index.ts
import templates from "../../data/templates.json";
import "./CardDetailsPage.css";

const CardDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchCard = async () => {
      try {
        const fetchedCard = await getCardById(id);
        // Map the template details
        const template = templates.find((tpl) => tpl.id === fetchedCard.templateId);
        setCard({ ...fetchedCard, template });
      } catch (error) {
        console.error("Error fetching card:", error);
        alert("Failed to load the card. Redirecting to home.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id, navigate]);

  const handleShareCard = () => {
    const contributorLink = `${window.location.origin}/cards/share/${card.shareableLink}`;
    navigator.clipboard.writeText(contributorLink);
    alert("Contributor link copied to clipboard!");
  };

  const handlePublishCard = async () => {
    try {
      const publishedCard = await publishCard(card.id);
      alert("Card successfully published!");
      navigate(`/cards/published/${publishedCard.id}`);
    } catch (error) {
      console.error("Error publishing card:", error);
      alert("Failed to publish the card. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading card details...</div>;
  }

  if (!card) {
    return <div className="error">Card not found!</div>;
  }

  return (
    <div className="card-details-page">
      <h1 className="card-details-title">{card.title}</h1>
      <div className="card-details-container">
        {/* Card Preview */}
        <div className="card-preview">
          <div
            className="card-preview-template"
            style={{
              backgroundImage: `url(${card.template?.image})`,
            }}
          ></div>
          <div className="card-content">
            <h2>{card.title}</h2>
            <p>{card.message}</p>
          </div>
        </div>

        {/* Messages Section */}
        <div className="card-messages">
          {card.messages?.length > 0 ? (
            card.messages.map((msg: any, index: number) => (
              <div key={index} className="card-message">
                {msg.gifUrl && (
                  <img src={msg.gifUrl} alt="GIF" className="message-gif" />
                )}
                <p className="message-text">{msg.text}</p>
                <p className="message-author">- {msg.author}</p>
              </div>
            ))
          ) : (
            <p className="no-messages">No messages yet!</p>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions">
          <button
            onClick={handleShareCard}
            className="card-action-button share-button"
          >
            Share card with others
          </button>
          <button
            onClick={handlePublishCard}
            className="card-action-button publish-button"
          >
            Finish and publish card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
