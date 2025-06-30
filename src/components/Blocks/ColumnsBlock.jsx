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
      // Trong trường hợp này, children của ColumnsBlock là ID của các container con (columns)
      // Mỗi container con sẽ chứa các block thực tế
      const columnId = children[colIndex];
      const columnBlock = blocks?.find((b) => b.id === columnId);

      return (
        <div
          key={columnId || `empty-col-${colIndex}`} // Key duy nhất cho mỗi cột
          style={{
            border: onSelect && !columnBlock ? "1px dashed #ccc" : "none", // Đường viền cho cột rỗng
            minHeight: onSelect && !columnBlock ? "80px" : "auto", // Chiều cao tối thiểu cho cột rỗng
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            padding: onSelect && !columnBlock ? "10px" : "0",
            boxSizing: "border-box",
          }}
        >
          {columnBlock ? (
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
      onClick={onSelect ? (e) => onSelect(block.id) : undefined}
      className={onSelect ? "editor-block-outline" : ""}
    >
      {columnChildren}
    </div>
  );
};

export default ColumnsBlock;
