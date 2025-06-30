// src/components/Blocks/SectionBlock.jsx
import React from "react";
import getDefaultProps from "@/utils/defaultProps";
import RenderBlockComponent from "@/components/RenderBlock";

const SectionBlock = ({ block, blocks, onSelect, onChange, isPreview }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const sectionStyle = {
    backgroundColor: props.backgroundColor || "#f0f0f0",
    padding: props.padding || "40px 0",
    minHeight: props.minHeight || "100px",
    margin: props.margin || "0",
    boxSizing: "border-box", // Để padding không làm tràn width
  };

  const children = Array.isArray(block.children) ? block.children : [];

  return (
    <section
      style={sectionStyle}
      onClick={onSelect ? (e) => onSelect(block.id) : undefined}
      className={onSelect ? "editor-block-outline" : ""}
    >
      {children.length > 0
        ? children.map((childId) => {
            const childBlock = blocks?.find((b) => b.id === childId);
            return childBlock ? (
              <div key={childBlock.id}>
                <RenderBlockComponent
                  block={childBlock}
                  blocks={blocks}
                  onSelect={onSelect}
                  onChange={onChange}
                  isPreview={isPreview}
                />
              </div>
            ) : null;
          })
        : !isPreview && (
            <div
              className="text-sm text-gray-400 italic text-center p-4"
              style={{
                border: "1px dashed #d1d5db",
                borderRadius: "6px",
                minHeight: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              (Empty section – drop elements here)
            </div>
          )}
    </section>
  );
};

export default SectionBlock;
