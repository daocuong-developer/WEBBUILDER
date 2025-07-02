// src/components/Blocks/ParagraphBlock.jsx
import React from "react";
import getDefaultProps from "@/utils/defaultProps";

const ParagraphBlock = ({ block, onSelect }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const commonStyle = {
    fontFamily: props.fontFamily || "inherit",
    fontSize: props.fontSize || "1rem",
    color: props.color || "#000",
    textAlign: props.textAlign || "left",
    lineHeight: props.lineHeight || "normal",
    letterSpacing: props.letterSpacing || "normal",
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
  };

  return (
    <p style={commonStyle} onClick={() => onSelect && onSelect(block.id)}>
      {props.text}
    </p>
  );
};

export default ParagraphBlock;
