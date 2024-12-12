import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-subtitle">oops. nothing here.</p>
      <Button
        color="dark" // Use a Mantine color like "dark" for the button
        radius="xl"
        size="lg"
        onClick={() => navigate("/")} // Redirect to homepage
      >
        Go to homepage
      </Button>
    </div>
  );
};

export default NotFoundPage;
