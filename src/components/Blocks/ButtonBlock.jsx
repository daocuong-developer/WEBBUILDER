// src/components/Blocks/ButtonBlock.jsx
import React, { useState } from "react";
import getDefaultProps from "@/utils/defaultProps";

const ButtonBlock = ({ block, onSelect, isPreview }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (isPreview && props.href && props.href !== "#") {
      e.preventDefault();
      window.open(props.href, props.target || "_self");
    } else {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  const dynamicInlineStyle = {
    fontFamily: props.fontFamily || "inherit",
    fontSize: props.fontSize || undefined,
    lineHeight: props.lineHeight || "normal",
    letterSpacing: props.letterSpacing || "normal",
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
    borderRadius: props.borderRadius || "0px",
    backgroundColor: props.backgroundColor || undefined,
    color: props.textColor || undefined,
    padding: props.padding || undefined,
    cursor:
      isPreview && props.href && props.href !== "#" ? "pointer" : "default",
  };

  // Construct class names based on props
  const buttonClasses = [
    "btn", // Base class
    `btn-${props.size || "md"}`, // Size class (e.g., btn-md)
    `btn-${props.variant || "primary"}`, // Variant class (e.g., btn-primary)
    props.disabled ? "btn-disabled" : "", // Disabled class
    // Add any other specific utility classes if needed
  ]
    .filter(Boolean)
    .join(" "); // filter(Boolean) removes empty strings

  if (props.hoverEffect) {
    dynamicInlineStyle.transition =
      "background-color 0.3s ease, color 0.3s ease";
    if (isHovered) {
      dynamicInlineStyle.backgroundColor =
        props.hoverBackgroundColor || "#0056b3";
      dynamicInlineStyle.color = props.hoverTextColor || "#ffffff";
    }
  }

  const buttonText = props.text;
  const Tag = isPreview && props.href && props.href !== "#" ? "a" : "button";

  const tagSpecificProps = {};
  if (Tag === "a") {
    tagSpecificProps.href = props.href;
    tagSpecificProps.target = props.target || "_self";
    tagSpecificProps.rel =
      props.target === "_blank" ? "noopener noreferrer" : undefined;
  } else {
    tagSpecificProps.type = "button";
    tagSpecificProps.disabled = props.disabled;
  }

  return (
    <div style={{ textAlign: props.blockAlignment || "left" }}>
      <Tag
        className={buttonClasses}
        style={dynamicInlineStyle}
        onClick={handleClick}
        onMouseEnter={() => props.hoverEffect && setIsHovered(true)}
        onMouseLeave={() => props.hoverEffect && setIsHovered(false)}
        {...tagSpecificProps}
      >
        {props.icon && (
          <img
            src={props.icon}
            alt="icon"
            style={{
              width: props.iconSize || 16,
              height: props.iconSize || 16,
              marginRight: buttonText ? 8 : 0,
              verticalAlign: "middle",
            }}
          />
        )}
        {buttonText}
      </Tag>
    </div>
  );
};

export default ButtonBlock;
