// GifModal.tsx
import React, { useState } from "react";
import "./GifModal.css";

interface GifModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGifSelect: (url: string) => void;
  searchGifs: (searchTerm: string) => void;
  gifResults: Array<{ id: string; images: { fixed_height: { url: string } } }>;
  gifSearch: string;
  setGifSearch: (value: string) => void;
}

const GifModal: React.FC<GifModalProps> = ({
  isOpen,
  onClose,
  onGifSelect,
  searchGifs,
  gifResults,
  gifSearch,
  setGifSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="gif-modal">
      <div className="gif-modal-overlay" onClick={onClose}></div>
      <div className="gif-modal-content">
        <button className="close-modal-button" onClick={onClose}>
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
            onClick={() => searchGifs(gifSearch)}
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
                alt="GIF"
                className="gif-result"
                onClick={() => onGifSelect(gif.images.fixed_height.url)}
              />
            ))
          ) : (
            <p className="gif-no-results">No GIFs found. Try a different keyword!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GifModal;