import React from "react";
import getDefaultProps from "@/utils/defaultProps";

const EmbedBlock = ({ block, onSelect }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const containerStyle = {
    padding: props.padding || "10px",
    margin: props.margin || "0",
    width: props.width || "100%",
    height: props.height || "auto",
    boxSizing: "border-box",
  };

  const handleClick = (e) => {
    if (onSelect) {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  return (
    <div style={containerStyle} onClick={handleClick}>
      <div
        dangerouslySetInnerHTML={{
          __html:
            props.code || "<p style='color: gray;'>No embed code provided.</p>",
        }}
      />
    </div>
  );
};

export default EmbedBlock;
