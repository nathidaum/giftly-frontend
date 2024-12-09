export type Card = {
  id: string;
  title: string;
  message: string;
  templateId: number;
  shareableLink: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  messages?: Message[]; // Optional, as it might not always be included
}

export type Message = {
  id: string;
  author: string;
  text: string;
  gifUrl?: string; // Optional
  imageUrl?: string; // Optional
  cardId: string;
  createdAt: string;
}