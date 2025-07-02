// src/components/Blocks/ColumnsBlock.jsx
import React from "react";
import getDefaultProps from "@/utils/defaultProps";
import RenderBlockComponent from "@/components/RenderBlock";

const ColumnsBlock = ({ block, blocks, onSelect, onChange, isPreview }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const numColumns = props.numColumns || 2;
  const gap = props.gap || 20; // Default gap in px

  const columnsStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
    gap: `${gap}px`,
    padding: props.padding || "0", // Thêm padding cho columns block
    margin: props.margin || "0", // Thêm margin cho columns block
    boxSizing: "border-box",
  };

  const children = Array.isArray(block.children) ? block.children : [];

  // Tạo mảng các cột rỗng nếu số lượng con ít hơn số cột
  const columnChildren = Array.from({ length: numColumns }).map(
    (_, colIndex) => {
      const columnId = children[colIndex];
      const columnBlock = blocks?.find((b) => b.id === columnId);

      // Nếu là cột rỗng, thêm onClick để chọn ColumnsBlock
      const isEmpty = !columnBlock;
      return (
        <div
          key={columnId || `empty-col-${colIndex}`}
          style={{
            border: onSelect && isEmpty ? "1px dashed #ccc" : "none",
            minHeight: onSelect && isEmpty ? "80px" : "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            padding: onSelect && isEmpty ? "10px" : "0",
            boxSizing: "border-box",
          }}
          onClick={
            isEmpty && onSelect
              ? (e) => {
                e.stopPropagation();
                onSelect(block.id);
              }
              : undefined
          }
        >
          {columnBlock ? (
            // Render column block, column block sẽ tự render các block con thực tế của nó
            <RenderBlockComponent
              block={columnBlock}
              blocks={blocks}
              onSelect={onSelect}
              onChange={onChange}
              isPreview={isPreview}
            />
          ) : (
            !isPreview && (
              <div className="text-sm text-gray-400 italic text-center p-2">
                (Drop elements here)
              </div>
            )
          )}
        </div>
      );
    },
  );

  return (
    <div
      style={columnsStyle}
      onClick={
        onSelect
          ? (e) => {
            // Chỉ select columns khi click trực tiếp vào nó, không phải vào children
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              // console.log("Select ColumnsBlock", block.id);
              onSelect(block.id);
            }
          }
          : undefined
      }
      className={onSelect ? "editor-block-outline" : ""}
    >
      {columnChildren}
    </div>
  );
};

export default ColumnsBlock;
