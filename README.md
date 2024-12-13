# Giftly - Frontend

## Description

This repository contains the **frontend code** for the **Giftly Project**, a web app that allows users to collabratively write a card for someone. Giftly allows users to create and collaborate on personalized cards. Users can select templates, customize content, add GIFs and images, and share the completed card with the recipient.
The frontend is built using **Typescript** and **React**.

The **backend repository** with the API implementation can be found [here](https://github.com/nathidaum/giftly-backend).

---

## Instructions to Run the Frontend

### 1. Requirements
- Ensure you have **Node.js 16.x or later** installed on your computer.

### 2. Clone the repository
```bash
git clone https://github.com/nathidaum/giftly-frontend.git
cd giftly-frontend
```
### 2. Install Dependencies

```bash
npm install
```

### Set up Environment Variables

1. Create a `.env` file in the root directory.
2. Add the following variables:

```bash
VITE_API_URL=<Backend API Base URL>
VITE_GIPHY_API_KEY=<Your Giphy API Key>
```
- VITE_API_URL: URL of the backend API. Example: http://localhost:5005.
- VITE_GIPHY_API_KEY: Provided via Giphy

You will need a [Giphy account](https://developers.giphy.com/dashboard/) to generate the required API key.


### Run the application
To start the development server, run:
```bash
npm run dev
```
Once the server is running, open your browser and navigate to http://localhost:5173.

## Demo

You can see the live frontend application hosted [here](https://giftly-cards.netlify.app/).
