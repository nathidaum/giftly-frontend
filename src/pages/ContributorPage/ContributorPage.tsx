import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCardByShareableLink, addMessageToCard } from "../../api";
import "./ContributorPage.css";

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

// Debounce utility (for the GIPHY API rate limit)
type Procedure = (...args: any[]) => void;
const debounce = <F extends Procedure>(func: F, delay: number): F => {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as F;
};

const ContributorPage = () => {
  const { shareableLink } = useParams<{ shareableLink: string }>();
  const navigate = useNavigate();

  const [card, setCard] = useState<any>(null);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Create a reference for the textarea

  // Giphy-related state
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);

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

  // Focus the textarea whenever text is empty
  useEffect(() => {
    if (textAreaRef.current && text === "") {
      textAreaRef.current.focus();
    }
  }, [text]);

  const handleGifSearch = async () => {
    if (!gifSearch.trim()) {
      alert("Please enter a keyword to search for GIFs.");
      return;
    }

    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: GIPHY_API_KEY,
          q: gifSearch,
          limit: 10, // Fetch 10 results
        },
      });
      setGifResults(response.data.data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      alert("Failed to fetch GIFs. Please try again.");
    }
  };

  // Debounced search
  const debouncedGifSearch = debounce(() => {
    handleGifSearch();
  }, 500);

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
      <div className="contributor-info">
        <h1> {card.title}</h1>
        <p> {card.message}</p>

        <button
          type="button"
          onClick={handleAddMessage}
          className={`contributor-button ${!text || !author ? "disabled" : ""}`}
          disabled={!text || !author} // Disable button if inputs are empty
        >
          Send your message
        </button>
      </div>
      <div className="contributor-container">
        {/* Card Preview */}
        <div className="contributor-card-preview">
          <div
            className="contributor-card-preview-template"
            style={{
              backgroundImage: `url(${card.template?.image || ""})`,
            }}
          >
            <div
              className="gif-placeholder"
              onClick={() => setIsGifModalOpen(true)}
            >
              {gifUrl ? (
                <img src={gifUrl} alt="Selected GIF" className="preview-gif" />
              ) : (
                <div className="add-gif">
                  <p>Add a GIF 📸 </p>
                </div>
              )}
            </div>
            <div className="preview-content">
              <textarea
                ref={textAreaRef}
                placeholder="Write some nice words here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="contributor-textarea"
                maxLength={500}
              ></textarea>
              <input
                type="text"
                placeholder=" - Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="contributor-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GIF Search Modal */}
      {isGifModalOpen && (
        <div className="gif-modal">
          <div
            className="gif-modal-overlay"
            onClick={() => setIsGifModalOpen(false)}
          ></div>
          <div className="gif-modal-content">
            <button
              className="close-modal-button"
              onClick={() => setIsGifModalOpen(false)}
            >
              ×
            </button>
            <h2 className="gif-modal-title">Search for a GIF</h2>
            <div className="gif-search-section">
              <input
                type="text"
                placeholder="Type to search for GIFs..."
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
                className="gif-search-input"
              />
              <button
                type="button"
                onClick={handleGifSearch}
                className="gif-search-button"
              >
                Search
              </button>
            </div>
            <div className="gif-results">
              {gifResults.length > 0 ? (
                gifResults.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="gif-result"
                    onClick={() => {
                      setGifUrl(gif.images.fixed_height.url);
                      setIsGifModalOpen(false);
                    }}
                  />
                ))
              ) : (
                <p className="gif-no-results">
                  No GIFs found. Try a different keyword!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributorPage;
