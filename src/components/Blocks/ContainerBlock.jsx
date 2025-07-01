// src/components/Blocks/ContainerBlock.jsx
import React from "react";
import getDefaultProps from "@/utils/defaultProps";
import RenderBlockComponent from "@/components/RenderBlock";

const ContainerBlock = ({ block, blocks, onSelect, onChange, isPreview }) => {
  const props = {
    ...getDefaultProps(block.type),
    ...block.props,
  };

  const layoutType = props.layoutType || "block";

  const baseStyle = {
    width: props.width || "100%",
    minHeight: props.minHeight,
    padding: props.padding,
    margin: props.margin,
    backgroundColor: props.backgroundColor,
    border: props.border,
    boxShadow: props.boxShadow,
    borderRadius: props.borderRadius,
    maxWidth: props.maxWidth,
  };

  let layoutStyle = {};
  if (layoutType === "flex") {
    layoutStyle = {
      display: "flex",
      flexDirection: props.flexDirection || "row",
      justifyContent: props.justifyContent || "flex-start",
      alignItems: props.alignItems || "stretch",
      gap: props.gap,
    };
  } else if (layoutType === "grid") {
    layoutStyle = {
      display: "grid",
      gridTemplateColumns:
        props.gridTemplateColumns || "repeat(auto-fit, minmax(200px, 1fr))", // Mặc định grid
      gridTemplateRows: props.gridTemplateRows || "auto",
      gap: props.gap,
      justifyContent: props.justifyContent || "start",
      alignItems: props.alignItems || "start",
    };
  } else {
    // layoutType === "block"
    layoutStyle = {
      display: "block",
    };
  }

  const children = Array.isArray(block.children)
    ? block.children
    : Array.isArray(block.props?.children)
      ? block.props.children
      : [];

  return (
    <div
      style={{
        ...baseStyle,
        ...layoutStyle,
      }}
      onClick={
        onSelect
          ? (e) => {
              // Chỉ select container khi click trực tiếp vào nó, không phải vào children
              if (e.target === e.currentTarget) {
                e.stopPropagation();
                onSelect(block.id);
              }
            }
          : undefined
      }
      className={onSelect ? "editor-block-outline" : ""}
    >
      {children.length > 0
        ? children.map((childId) => {
            const childBlock = blocks?.find((b) => b.id === childId);
            return childBlock ? (
              <div
                key={childBlock.id}
                style={{
                  // Thêm style cho phần tử con trong container để dễ nhìn trong editor
                  ...(onSelect && {
                    border: "1px dashed #d1d5db",
                    borderRadius: "4px",
                    padding: "4px",
                    boxSizing: "border-box", // Ensure padding doesn't push elements out
                  }),
                  // Margin bottom chỉ áp dụng nếu là block layout và không phải phần tử cuối cùng
                  // Sử dụng marginBottom thay vì margin để tránh conflict
                  ...(layoutType === "block" &&
                    children.indexOf(childId) !== children.length - 1 &&
                    props.gap && { marginBottom: props.gap }),
                  // Override margin cho editor nếu có gap
                  ...(onSelect && {
                    marginTop: "4px",
                    marginLeft: "4px",
                    marginRight: "4px",
                    // marginBottom sẽ được set bởi gap logic ở trên, hoặc default 4px
                    ...(!(
                      layoutType === "block" &&
                      children.indexOf(childId) !== children.length - 1 &&
                      props.gap
                    ) && { marginBottom: "4px" }),
                  }),
                }}
              >
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
        : // Hiển thị placeholder chỉ khi ở chế độ chỉnh sửa và không có con
          !isPreview && (
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
              (Empty container – drop elements here)
            </div>
          )}
    </div>
  );
};

export default ContainerBlock;
