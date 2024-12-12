import { useState } from "react";
import templates from "../../data/templates.json";
import "./TemplateSelector.css";

interface TemplateSelectorProps {
  selectedTemplate: number; // The ID of the currently selected template
  setSelectedTemplate: (id: number) => void; // Function to update the selected template
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the center template

  // Helper function to get the visible templates (left, center, right)
  const getVisibleTemplates = () => {
    const totalTemplates = templates.length;
    const prevIndex = (currentIndex - 1 + totalTemplates) % totalTemplates; // Wrap around for left
    const nextIndex = (currentIndex + 1) % totalTemplates; // Wrap around for right

    return [
      templates[prevIndex],
      templates[currentIndex],
      templates[nextIndex],
    ];
  };

  // Handle template clicks
  const handleTemplateClick = (clickedIndex: number) => {
    if (
      clickedIndex ===
      (currentIndex - 1 + templates.length) % templates.length
    ) {
      // Clicked the left template
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + templates.length) % templates.length
      );
    } else if (clickedIndex === (currentIndex + 1) % templates.length) {
      // Clicked the right template
      setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length);
    }
    // Update the selected template
    setSelectedTemplate(templates[clickedIndex].id);
  };

  return (
    <div className="carousel">
      <div className="carousel-templates">
        {getVisibleTemplates().map((template, index) => {
          const isCenter = index === 1; // Center template
          return (
            <div
              key={template.id}
              className={`template-option ${
                isCenter ? "selected" : ""
              }`}
              style={{ backgroundImage: `url(${template.image})` }}
              onClick={() =>
                handleTemplateClick(
                  templates.findIndex((t) => t.id === template.id)
                )
              }
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
