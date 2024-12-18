import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import axios from "axios";
import { getCardByShareableLink, addMessageToCard } from "../../api";
import "./ContributorPage.css";
import GifModal from "../../components/GifModal/GifModal";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (textAreaRef.current && text === "") {
      textAreaRef.current.focus();
    }
  }, [text]);

  const handleGifSearch = async () => {
    if (!gifSearch.trim()) {
      toast("🔑 Please enter a keyword to search for GIFs.", {
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
      return;
    }

    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: GIPHY_API_KEY,
          q: gifSearch,
          limit: 10,
        },
      });
      setGifResults(response.data.data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      alert("Failed to fetch GIFs. Please try again.");
    }
  };

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
      setIsSubmitted(true);
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
      {isSubmitted ? (
        <div className="contributor-info">
          <Confetti
            numberOfPieces={200}
            colors={["#b3e5fc", "#f8bbd0", "#ffffff", "#4169e1"]}
            recycle={false}
            confettiSource={{
              x: window.innerWidth / 2 + 150,
              y: window.innerHeight / 2 - 150,
              w: 200,
              h: 200,
            }}
          />
          <h1>Thank you for your message! 🎉</h1>
        </div>
      ) : (
        <div className="contributor-info">
          <h1>{card.title}</h1>
          <p>{card.message}</p>
          <button
            type="button"
            onClick={handleAddMessage}
            className={`contributor-button ${
              !text || !author ? "disabled" : ""
            }`}
            disabled={!text || !author}
          >
            Send your message
          </button>
        </div>
      )}

      <div className="contributor-container">
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
      <GifModal
        isOpen={isGifModalOpen}
        onClose={() => setIsGifModalOpen(false)}
        onGifSelect={(url) => {
          setGifUrl(url);
          setIsGifModalOpen(false);
        }}
        searchGifs={debouncedGifSearch}
        gifResults={gifResults}
        gifSearch={gifSearch}
        setGifSearch={setGifSearch}
      />
    </div>
  );
};

export default ContributorPage;
