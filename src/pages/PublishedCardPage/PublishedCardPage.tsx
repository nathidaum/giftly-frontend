import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCardById } from "../../api/index";
import { ActionIcon } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSend,
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
    toast("🔗 Link copied to clipboard!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      draggablePercent: 0,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
    });
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
        className="desktop-navigation-icon"
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
          {/* Navigation for mobile */}
          <div>
            <div className="mobile-navigation">
              <ActionIcon
                variant="filled"
                color="rgba(82, 82, 82, 1)"
                size="lg"
                radius="xl"
                aria-label="Previous Slide"
                onClick={handlePreviousSlide}
              >
                <IconChevronLeft />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color="rgba(82, 82, 82, 1)"
                size="lg"
                radius="xl"
                aria-label="Next Slide"
                onClick={handleNextSlide}
              >
                <IconChevronRight />
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
            <IconSend
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
              onClick={handleShareFinalCard}
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
        className="desktop-navigation-icon"
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
