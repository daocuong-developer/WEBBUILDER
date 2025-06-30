// src/components/Blocks/ContainerBlock.jsx
import React from "react";
import getDefaultProps from "@/utils/defaultProps";
import RenderBlockComponent from "@/components/renderBlock";

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
            gridTemplateColumns: props.gridTemplateColumns || "repeat(auto-fit, minmax(200px, 1fr))", // Mặc định grid
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
            // onClick={
            //     onSelect
            //         ? (e) => {
            //               e.stopPropagation(); // ⚠️ CHẶN click bubble lên container
            //               onSelect(block.id);
            //           }
            //         : undefined
            // }
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    e.stopPropagation();
                    onSelect(block.id);
                }
            }}
            className={onSelect ? "editor-block-outline" : ""}
        >
            {children.length > 0
                ? children.map((childId) => {
                      const childBlock = blocks?.find((b) => b.id === childId);
                      return childBlock ? (
                          <div
                              key={childBlock.id}
                              style={{
                                  // Margin bottom chỉ áp dụng nếu là block layout và không phải phần tử cuối cùng
                                  ...(layoutType === "block" &&
                                      children.indexOf(childId) !== children.length - 1 &&
                                      props.gap && { marginBottom: props.gap }),
                                  // Thêm style cho phần tử con trong container để dễ nhìn trong editor
                                  ...(onSelect && {
                                      border: "1px dashed #d1d5db",
                                      borderRadius: "4px",
                                      padding: "4px",
                                      margin: "4px",
                                      boxSizing: "border-box", // Ensure padding doesn't push elements out
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
