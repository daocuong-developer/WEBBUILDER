import React from "react";
import getDefaultProps from "@/utils/defaultProps";

const HeadingBlock = ({ block, onSelect }) => {
    const props = {
        ...getDefaultProps(block.type),
        ...block.props,
    };

    const HeadingTag = `h${props.level || 1}`;

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
        <HeadingTag style={commonStyle} onClick={onSelect}>
            {props.text}
        </HeadingTag>
    );
};

export default HeadingBlock;
