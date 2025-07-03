import React from "react";
import { useDroppable } from "@dnd-kit/core";
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
    padding: props.padding || "0",
    margin: props.margin || "0",
    boxSizing: "border-box",
  };

  // Khởi tạo children cho từng cột nếu chưa có
  const children = Array.isArray(block.children) ? block.children : [];

  // Đảm bảo có đủ mảng con cho từng cột
  while (children.length < numColumns) {
    children.push([]);
  }

  // Component cho từng cột với khả năng drop
  const ColumnDropZone = ({ columnIndex, columnChildren, columnKey }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `column-${block.id}-${columnIndex}`,
      data: {
        type: "column",
        parentId: block.id,
        columnIndex: columnIndex,
        accepts: ["block"], // Chấp nhận tất cả các loại block
      },
    });

    // Xử lý HTML5 drag & drop từ sidebar
    const handleDrop = (e) => {
      e.preventDefault();
      const componentData = e.dataTransfer.getData("component");

      if (componentData) {
        try {
          const { type } = JSON.parse(componentData);

          // Dispatch custom event để EditablePage xử lý
          window.dispatchEvent(
            new CustomEvent("addBlockToColumn", {
              detail: {
                type: type,
                parentId: block.id,
                columnIndex: columnIndex,
              },
            }),
          );
        } catch (error) {
          console.error("Error parsing component data:", error);
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault(); // Cho phép drop
    };

    return (
      <div
        ref={setNodeRef}
        key={columnKey}
        className={`min-h-[80px] p-2 rounded transition-colors ${
          isOver
            ? "bg-blue-50 border-2 border-blue-300 border-dashed"
            : !isPreview
              ? "border border-dashed border-gray-200 hover:border-gray-400"
              : ""
        }`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          boxSizing: "border-box",
        }}
        onClick={(e) => {
          // Cho phép click vào cột để chọn cột đó
          if (e.target === e.currentTarget && onSelect) {
            e.stopPropagation();
            // Có thể thêm logic để chọn cột cụ thể nếu cần
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {columnChildren && columnChildren.length > 0
          ? columnChildren.map((childId) => {
              const childBlock = blocks?.find((b) => b.id === childId);
              return childBlock ? (
                <div key={childBlock.id} className="mb-2">
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
              <div className="text-sm text-gray-400 italic text-center p-4 flex-1 flex items-center justify-center">
                Drop elements here
              </div>
            )}
      </div>
    );
  };

  return (
    <div
      style={{
        ...columnsStyle,
        position: "relative",
        minHeight: !isPreview ? "100px" : "auto",
      }}
      onClick={
        onSelect
          ? (e) => {
              // Cho phép click vào bất kỳ đâu trong columns để select
              e.stopPropagation();
              onSelect(block.id);
            }
          : undefined
      }
      className={`${onSelect ? "editor-block-outline" : ""} ${!isPreview ? "hover:bg-gray-50 cursor-pointer transition-colors" : ""}`}
    >
      {/* Header để dễ click chọn columns */}
      {!isPreview && (
        <div
          className="absolute -top-6 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded border"
          style={{ zIndex: 10 }}
        >
          Columns ({numColumns})
        </div>
      )}

      {Array.from({ length: numColumns }).map((_, colIndex) => (
        <ColumnDropZone
          key={`col-${colIndex}`}
          columnIndex={colIndex}
          columnChildren={children[colIndex]}
          columnKey={`col-${colIndex}`}
        />
      ))}
    </div>
  );
};

export default ColumnsBlock;
