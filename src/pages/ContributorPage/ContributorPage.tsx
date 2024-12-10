import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCardByShareableLink, addMessageToCard } from "../../api";
import "./ContributorPage.css";

const ContributorPage = () => {
  const { shareableLink } = useParams<{ shareableLink: string }>();
  const navigate = useNavigate();

  const [card, setCard] = useState<any>(null);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [gifUrl, setGifUrl] = useState(""); // Optional
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        if (!shareableLink) {
          navigate("/");
          return;
        }
        const fetchedCard = await getCardByShareableLink(shareableLink);
        setCard(fetchedCard);
      } catch (error) {
        console.error("Error fetching card:", error);
        alert("Failed to load the card. Redirecting to home.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [shareableLink, navigate]);

  const handleAddMessage = async () => {
    if (!author || !text) {
      alert("Please provide your name and a message.");
      return;
    }

    const messageData = { author, text, gifUrl: gifUrl || undefined };

    try {
      await addMessageToCard(shareableLink!, messageData);
      alert("Your message has been added!");
      setAuthor("");
      setText("");
      setGifUrl("");
    } catch (error) {
      console.error("Error adding message:", error);
      alert("Failed to add your message. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading card details...</div>;
  }

  if (!card) {
    return <div className="error">Card not found!</div>;
  }

  return (
    <div className="contributor-page">
      <div className="contributor-container">
        {/* Card Preview */}
        <div className="contributor-card-preview">
          <div
            className="contributor-card-preview-template"
            style={{
              backgroundImage: `url(${card.template?.image || ""})`,
            }}
          >
            <div className="preview-content">
              {gifUrl && (
                <img src={gifUrl} alt="GIF preview" className="preview-gif" />
              )}
              <p className="preview-text">{text || "Write your message..."}</p>
              <p className="preview-author">
                {author || "Your name"}
              </p>
            </div>
          </div>
        </div>

        <div>
        {/* Contribution Form */}
        <form className="contributor-form">
        <h1 className="contributor-title">{card.title}</h1>
          <label>{card.message}</label>
          <textarea
            placeholder="Write your heartfelt message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="contributor-textarea"
          ></textarea>
          <label>sign with your name</label>
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="contributor-input"
          />
          <label>add a GIF for more fun</label>
          <input
            type="text"
            placeholder="Enter GIF URL"
            value={gifUrl}
            onChange={(e) => setGifUrl(e.target.value)}
            className="contributor-input"
          />
          <button
            type="button"
            onClick={handleAddMessage}
            className="contributor-button"
          >
            Add your message
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ContributorPage;
