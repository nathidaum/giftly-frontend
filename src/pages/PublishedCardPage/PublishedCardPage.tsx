import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCardById } from "../../api/index"; // Assuming this function exists
import templates from "../../data/templates.json";
import "./PublishedCardPage.css";
import FinalCard from "../../components/FinalCard";

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
        const template = templates.find(
          (tpl) => tpl.id === fetchedCard.templateId
        );
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
       <FinalCard
          gifUrl={isCoverSlide ? undefined : card.messages[currentSlide - 1]?.gifUrl}
          text={isCoverSlide ? "" : card.messages[currentSlide - 1]?.text}
          author={isCoverSlide ? "" : card.messages[currentSlide - 1]?.author}
          image={card.template?.image}
          isCoverSlide={isCoverSlide}
        />
      <div className="card-actions">
        <button className="card-action-button" onClick={handlePreviousSlide}>◀</button>
        <button className="card-action-button" onClick={handleNextSlide}>▶</button>
      </div>
    </div>
  );
};

export default PublishedCardPage;
