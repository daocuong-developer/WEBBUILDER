import React, { useRef } from "react";
import getDefaultProps from "@/utils/defaultProps";

const ImageBlock = ({ block, onSelect, onChange, isPreview }) => {
  const fileInputRef = useRef(null);

  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const imageStyle = {
    width: props.width || "100%",
    height: props.height || "auto",
    objectFit: props.objectFit || "cover",
    borderRadius: props.borderRadius || "0",
    boxShadow: props.shadow || "none",
    display: "block",
  };

  const wrapperStyle = {
    textAlign: props.alignment || "left",
    width: "100%",
  };

  const handleClick = (e) => {
    if (isPreview && props.url) {
      window.open(props.url, props.target || "_self");
    } else {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSrc = URL.createObjectURL(file);
      onChange({
        ...block,
        props: {
          ...props,
          src: newSrc,
        },
      });
    }
  };

  return (
    <div
      className="image-block-wrapper"
      onClick={!isPreview ? handleClick : undefined}
      style={{
        cursor: isPreview && props.url ? "pointer" : "default",
        ...wrapperStyle,
      }}
    >
      {!isPreview && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onClick={(e) => e.stopPropagation()}
          onChange={handleFileChange}
        />
      )}

      <img
        src={
          props.src ||
          "https://via.placeholder.com/400x300?text=Placeholder+Image"
        }
        alt={props.alt || "Placeholder Image"}
        style={imageStyle}
        onClick={isPreview && props.url ? handleClick : undefined}
      />
    </div>
  );
};

export default ImageBlock;
