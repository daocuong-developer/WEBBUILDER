import React, { useState } from "react";
import getDefaultProps from "@/utils/defaultProps";

const CtaBlock = ({ block, onSelect, isPreview }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const [isHovered, setIsHovered] = useState(false);

  const ctaStyle = {
    backgroundColor: props.backgroundColor || "#f5f5f5",
    padding: props.padding || "40px",
    textAlign: props.blockAlign || "center",
    borderRadius: props.borderRadius || "8px",
    margin: props.margin || "20px auto",
    boxSizing: "border-box",
    maxWidth: props.maxWidth || "800px",
  };

  const headlineStyle = {
    color: props.headlineColor || "#333",
    fontSize: props.headlineStyle?.fontSize || "2rem",
    fontWeight: props.headlineStyle?.fontWeight || "bold",
    fontStyle: props.headlineStyle?.fontStyle || "normal",
    textAlign: props.headlineAlign || "center",
    marginBottom: "10px",
  };

  const descriptionStyle = {
    color: props.descriptionColor || "#555",
    fontSize: props.descriptionStyle?.fontSize || "1.1rem",
    fontWeight: props.descriptionStyle?.fontWeight || "normal",
    fontStyle: props.descriptionStyle?.fontStyle || "normal",
    textAlign: props.descriptionAlign || "center",
    marginBottom: "20px",
  };

  const buttonStyle = {
    backgroundColor: isHovered
      ? props.buttonHoverBgColor || "#0056b3"
      : props.buttonBgColor || "#007bff",
    color: isHovered
      ? props.buttonHoverTextColor || "#fff"
      : props.buttonTextColor || "#fff",
    padding: props.buttonPadding || "12px 25px",
    border: "none",
    borderRadius: props.buttonBorderRadius || "5px",
    cursor: isPreview ? "pointer" : "default",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.3s ease",
  };

  const handleClick = (e) => {
    if (onSelect) {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  return (
    <div style={ctaStyle} onClick={handleClick}>
      {props.headline && <h2 style={headlineStyle}>{props.headline}</h2>}
      {props.description && <p style={descriptionStyle}>{props.description}</p>}
      {props.buttonText && props.buttonUrl && (
        <a
          href={isPreview ? props.buttonUrl : "#"}
          target={isPreview ? props.buttonTarget || "_self" : undefined}
          rel="noopener noreferrer"
          style={buttonStyle}
          onClick={isPreview ? undefined : (e) => e.preventDefault()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {props.buttonText}
        </a>
      )}
    </div>
  );
};

export default CtaBlock;
