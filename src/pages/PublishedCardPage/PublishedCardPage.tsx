import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCardById } from "../../api/index";
import { ActionIcon } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSend,
  IconDownload,
} from "@tabler/icons-react";
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
  const handleShareFinalCard = () => {
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
      <ActionIcon
        variant="filled"
        color="rgba(82, 82, 82, 1)"
        size="xl"
        radius="xl"
        aria-label="Settings"
      >
        <IconChevronLeft
          style={{ width: "70%", height: "70%" }}
          stroke={1.5}
          onClick={handlePreviousSlide}
        />
      </ActionIcon>

      <div className="final-card-with-icons">
        <FinalCard
          gifUrl={
            isCoverSlide ? undefined : card.messages[currentSlide - 1]?.gifUrl
          }
          text={isCoverSlide ? "" : card.messages[currentSlide - 1]?.text}
          author={isCoverSlide ? "" : card.messages[currentSlide - 1]?.author}
          image={card.template?.image}
          isCoverSlide={isCoverSlide}
          currentMessageIndex={isCoverSlide ? 0 : currentSlide}
          totalMessages={card.messages.length}
        />
        <div className="actions">
          <ActionIcon
            variant="filled"
            color="rgba(82, 82, 82, 1)"
            size="xl"
            radius="xl"
            aria-label="Settings"
          >
            <IconSend
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
              onClick={handleShareFinalCard}
            />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="rgba(82, 82, 82, 1)"
            size="xl"
            radius="xl"
            aria-label="Settings"
          >
            <IconDownload
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </div>
      </div>
      <ActionIcon
        variant="filled"
        color="rgba(82, 82, 82, 1)"
        size="xl"
        radius="xl"
        aria-label="Settings"
      >
        <IconChevronRight
          style={{ width: "70%", height: "70%" }}
          stroke={1.5}
          onClick={handleNextSlide}
        />
      </ActionIcon>
    </div>
  );
};

export default PublishedCardPage;
