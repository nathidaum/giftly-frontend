import { Routes, Route, useNavigate, Link } from "react-router-dom";
import CardCreationPage from "./pages/CardCreationPage/CardCreationPage";
import CardDetailsPage from "./pages/CardDetailsPage/CardDetailsPage";
import ContributorPage from "./pages/ContributorPage/ContributorPage";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PublishedCardPage from "./pages/PublishedCardPage/PublishedCardPage";

function App() {
  return (
    <div>
      <Link to="/" className="logo-link">
        <img
          src="/logo-white-transparent.png"
          alt="Logo"
          className="app-logo"
        />
      </Link>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Card Creation Page */}
        <Route path="/create" element={<CardCreationPage />} />

        {/* Card Details Page */}
        <Route path="/cards/:id" element={<CardDetailsPage />} />

        {/* Contributor Page */}
        <Route
          path="/cards/share/:shareableLink"
          element={<ContributorPage />}
        />

        {/* Published Card Page */}
        <Route
          path="/cards/published/:cardId"
          element={<PublishedCardPage />}
        />

        {/* Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
