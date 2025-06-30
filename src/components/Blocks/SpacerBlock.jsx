// src/components/Blocks/DividerBlock.jsx
import React from "react";
import getDefaultProps from "@/utils/defaultProps";

const DividerBlock = ({ block, onSelect }) => {
    const props = {
        ...getDefaultProps(block.type),
        ...block.props,
    };

    const dividerStyle = {
        borderTop: `${props.thickness || 1}px ${props.style || "solid"} ${props.color || "#cccccc"}`,
        width: `${props.width || 100}%`,
        margin: props.margin || "20px auto", // Canh giữa và có margin mặc định
        boxSizing: "border-box",
    };

    return (
        <hr style={dividerStyle} onClick={onSelect} />
    );
};

export default DividerBlock;