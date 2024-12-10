import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCardById } from "../../api/index"; // Assuming this function exists
import templates from "../../data/templates.json";
import "./PublishedCardPage.css";

const PublishedCardPage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current carousel slide

  useEffect(() => {
    if (!cardId) {
      navigate("/");
      return;
    }

    const fetchCard = async () => {
      try {
        const fetchedCard = await getCardById(cardId);
        if (!fetchedCard.isPublished) {
          alert("This card is not published yet.");
          navigate("/");
          return;
        }
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
  }, [cardId, navigate]);

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
    const recipientLink = `${window.location.origin}/cards/published/${card.id}`;
    navigator.clipboard.writeText(recipientLink);
    alert("Recipient link copied to clipboard!");
  };

  if (isLoading) {
    return <div className="loading">Loading published card...</div>;
  }

  if (!card) {
    return <div className="error">Published card not found!</div>;
  }

  return (
    <div className="published-card-page">
      <h1 className="published-card-title">{card.title}</h1>
      <div className="published-card-container">
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
            Share this card with the recipient
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishedCardPage;
