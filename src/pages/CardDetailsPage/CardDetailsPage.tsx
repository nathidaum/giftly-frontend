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
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current carousel slide

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

  // card & message carousel
  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === card.messages.length ? 0 : prevSlide + 1
    );
  };

  const handlePreviousSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? card.messages.length : prevSlide - 1
    );
  };
  const isCoverSlide = currentSlide === 0;

  // button actions
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
      <h1 className="title-center">{card.title}</h1>
      <div className="card-details-container">
        {/* Carousel */}
        <div className="card-carousel">
          <button
            className="carousel-arrow left-arrow"
            onClick={handlePreviousSlide}
          >
            ◀
          </button>
          <div className="carousel-slide">
            {isCoverSlide ? (
              <div
                className="carousel-cover"
                style={{ backgroundImage: `url(${card.template?.image})` }}
              ></div>
            ) : (
              <div className="carousel-message">
                {card.messages[currentSlide - 1]?.gifUrl && (
                  <img
                    src={card.messages[currentSlide - 1].gifUrl}
                    alt="GIF"
                    className="carousel-gif"
                  />
                )}
                <p className="carousel-text">
                  {card.messages[currentSlide - 1]?.text}
                </p>
                <p className="carousel-author">
                  - {card.messages[currentSlide - 1]?.author}
                </p>
              </div>
            )}
          </div>
          <button
            className="carousel-arrow right-arrow"
            onClick={handleNextSlide}
          >
            ▶
          </button>
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
