import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Message } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { ActionIcon } from "@mantine/core";
import { Button } from "@mantine/core";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconShare,
  IconTrash
} from "@tabler/icons-react";
import {
  getCardById,
  publishCard,
  deleteMessageFromCard,
} from "../../api/index";
import templates from "../../data/templates.json";
import "./CardDetailsPage.css";

const CardDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false); // Add this line

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchCard = async () => {
      try {
        const fetchedCard = await getCardById(id);
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

  const handlePublishCard = async () => {
    try {
      const publishedCard = await publishCard(card.id);
      toast("👏 Card successfully published!", {
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
      navigate(`/cards/published/${publishedCard.id}`);
    } catch (error) {
      console.error("Error publishing card:", error);
      alert("Failed to publish the card. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!card) return;
    setIsDeleting(true); // Start deleting state
    try {
      await deleteMessageFromCard(card.id, messageId); // Call the API function
      const updatedMessages = card.messages.filter(
        (message: Message) => message.id !== messageId
      );

      // Adjust the current slide index
      const newCurrentSlide =
        currentSlide > updatedMessages.length
          ? Math.max(0, updatedMessages.length - 1)
          : currentSlide;

      setCard({
        ...card,
        messages: updatedMessages, // Update the messages
      });
      setCurrentSlide(newCurrentSlide); // Move to the next slide if needed
      toast("🗑️ Message deleted successfully!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete the message. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setIsDeleting(false); // End deleting state
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
      <div className="details-left">
        <h1 className="title">{card.title}</h1>
        <p className="insructions">
          Time to get others to contribute! Click on the button below to share
          the card with them. <br></br>
          Once you've collected all messages, click on the publish button to see
          and share the final result with the recipient.
        </p>
        <div className="card-actions">
          <Button
            mb="lg"
            radius="xl"
            onClick={handleShareCard}
            color="rgba(255, 255, 255, 0.2)"
            leftSection={<IconShare size={14} />}
          >
            Share with contributors
          </Button>
          <Button
            radius="xl"
            onClick={handlePublishCard}
            color="rgba(255, 255, 255, 0.2)"
            leftSection={<IconArrowRight size={14} />}
          >
            Finish and publish card
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="card-carousel">
        <ActionIcon
          variant="filled"
          color="rgba(82, 82, 82, 1)"
          size="xl"
          radius="xl"
          aria-label="Settings"
          className="desktop-arrow"
        >
          <IconChevronLeft
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
            onClick={handlePreviousSlide}
          />
        </ActionIcon>

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
              <div className="gif-bottom">
                <p className="carousel-text">
                  {card.messages[currentSlide - 1]?.text}
                </p>
                <p className="carousel-author">
                  - {card.messages[currentSlide - 1]?.author}
                </p>
              </div>
              <ActionIcon
                variant="filled"
                color="transparent"
                size="md"
                radius="xl"
                aria-label="Delete Message"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                }}
                onClick={() =>
                  handleDeleteMessage(card.messages[currentSlide - 1]?.id)
                } // Call delete function with message ID
                disabled={isDeleting} // Disable button while deleting
              >
                <IconTrash size={20} />{" "}
              </ActionIcon>
            </div>
          )}
        </div>
        <ActionIcon
          variant="filled"
          color="rgba(82, 82, 82, 1)"
          size="xl"
          radius="xl"
          aria-label="Settings"
          className="desktop-arrow"
        >
          <IconChevronRight
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
            onClick={handleNextSlide}
          />
        </ActionIcon>
      </div>
      <div className="mobile-arrow-section">
        <ActionIcon
          variant="filled"
          color="rgba(82, 82, 82, 1)"
          size="lg"
          radius="xl"
          aria-label="Settings"
          className="mobile-arrow"
        >
          <IconChevronLeft
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
            onClick={handlePreviousSlide}
          />
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="rgba(82, 82, 82, 1)"
          size="lg"
          radius="xl"
          aria-label="Settings"
          className="mobile-arrow"
        >
          <IconChevronRight
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
            onClick={handleNextSlide}
          />
        </ActionIcon>
      </div>
    </div>
  );
};

export default CardDetailsPage;
