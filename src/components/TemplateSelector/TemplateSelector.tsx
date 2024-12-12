import { useState } from "react";
import templates from "../../data/templates.json";
import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import "./TemplateSelector.css"

interface TemplateSelectorProps {
  selectedTemplate: number | null;
  setSelectedTemplate: (id: number) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const [visibleTemplates, setVisibleTemplates] = useState(
    templates.slice(0, 4)
  ); // Initially show 4 templates
  const [startIndex, setStartIndex] = useState(0);

  const handleNextTemplates = () => {
    const newIndex = startIndex + 4;
    if (newIndex < templates.length) {
      setVisibleTemplates(templates.slice(newIndex, newIndex + 4));
      setStartIndex(newIndex);
    }
  };

  const handlePrevTemplates = () => {
    const newIndex = startIndex - 4;
    if (newIndex >= 0) {
      setVisibleTemplates(templates.slice(newIndex, newIndex + 4));
      setStartIndex(newIndex);
    }
  };

  return (
    <div className="card-preview">
      <div
        className="card-preview-template"
        style={{
          backgroundImage: `url(${
            templates.find((template) => template.id === selectedTemplate)
              ?.image
          })`,
        }}
      ></div>

      {/* Template Selector */}
      <div className="carousel">
        <ActionIcon
          variant="filled"
          color="rgba(82, 82, 82, 1)"
          size="sm"
          radius="xl"
          aria-label="Settings"
          className={startIndex === 0 ? "disabled-action-icon" : ""}
          onClick={handlePrevTemplates}
        >
          <IconChevronLeft />
        </ActionIcon>
        <div className="carousel-templates">
          {visibleTemplates.map((template) => (
            <div
              key={template.id}
              className={`template-option ${
                template.id === selectedTemplate ? "selected" : ""
              }`}
              style={{ backgroundImage: `url(${template.image})` }}
              onClick={() => setSelectedTemplate(template.id)}
            ></div>
          ))}
        </div>
        <ActionIcon
          variant="filled"
          color="rgba(82, 82, 82, 1)"
          size="sm"
          radius="xl"
          aria-label="Settings"
          className={
            startIndex + 4 >= templates.length ? "disabled-action-icon" : ""
          }
          onClick={handleNextTemplates}
        >
          <IconChevronRight />
        </ActionIcon>
      </div>
    </div>
  );
};

export default TemplateSelector;
