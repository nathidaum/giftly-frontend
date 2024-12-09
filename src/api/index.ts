import axios from "axios";
import { Card, Message } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

// Create a new card
export const createCard = async (
  data: Pick<Card, "title" | "message" | "templateId">
): Promise<Card> => {
  try {
    const response = await axios.post<Card>(`${API_URL}/cards`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating a card:", error);
    throw new Error("Failed to create a card. Please try again.");
  }
};

// Get all cards
export const getAllCards = async (): Promise<Card[]> => {
  try {
    const response = await axios.get<Card[]>(`${API_URL}/cards`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all cards:", error);
    throw new Error("Failed to fetch all cards. Please try again.");
  }
};

// Get card by ID
export const getCardById = async (id: string): Promise<Card> => {
  try {
    const response = await axios.get<Card>(`${API_URL}/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching the card by ID:", error);
    throw new Error("Failed to fetch the card. Please try again.");
  }
};

// Get card by shareable link
export const getCardByShareableLink = async (
  shareableLink: string
): Promise<Card> => {
  try {
    const response = await axios.get<Card>(
      `${API_URL}/cards/share/${shareableLink}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching the card by shareable link:", error);
    throw new Error(
      "Failed to fetch the card by shareable link. Please try again."
    );
  }
};

// Delete a card
export const deleteCard = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/cards/${id}`);
  } catch (error) {
    console.error("Error deleting a card:", error);
    throw new Error("Failed to delete the card. Please try again.");
  }
};

// Add a message to a card
export const addMessageToCard = async (
  shareableLink: string,
  data: Pick<Message, "author" | "text" | "gifUrl" | "imageUrl">
): Promise<Message> => {
  try {
    const response = await axios.post<Message>(
      `${API_URL}/cards/share/${shareableLink}/messages`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding a message to the card:", error);
    throw new Error("Failed to add a message to the card. Please try again.");
  }
};

// Delete a message from a card
export const deleteMessageFromCard = async (
  cardId: string,
  messageId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/cards/${cardId}/messages/${messageId}`);
  } catch (error) {
    console.error("Error deleting a message from the card:", error);
    throw new Error(
      "Failed to delete the message from the card. Please try again."
    );
  }
};

// Publish a card
export const publishCard = async (id: string): Promise<Card> => {
  try {
    const response = await axios.put<Card>(`${API_URL}/cards/${id}`, {
      isPublished: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error publishing the card:", error);
    throw new Error("Failed to publish the card. Please try again.");
  }
};
