// // src/components/ImageBlock.jsx (hoặc di chuyển vào src/components/Blocks/ImageBlock.jsx)
// import React from "react";
// import getDefaultProps from "@/utils/defaultProps"; // Chỉ cần nếu ImageBlock cần mặc định props riêng

// const ImageBlock = ({ block, onSelect, onChange, isPreview }) => {
//     const props = {
//         ...getDefaultProps(block.type), // Đảm bảo lấy default props cho image
//         ...block.props,
//     };

//     const imageStyle = {
//         width: props.width || "100%",
//         height: props.height || "auto",
//         objectFit: props.objectFit || "cover",
//         display: "block", // Tránh khoảng trống dưới ảnh
//     };

//     const handleClick = (e) => {
//         // Trong chế độ preview, nếu có link, click vào ảnh sẽ chuyển hướng
//         if (isPreview && props.url) {
//             window.open(props.url, props.target || "_self");
//         } else {
//             onSelect(block.id); // Trong chế độ chỉnh sửa, chọn block
//         }
//     };

//     return (
//         <div className="image-block-wrapper" onClick={handleClick} style={{ cursor: isPreview && props.url ? "pointer" : "default" }}>
//             <img
//                 src={props.src || "https://via.placeholder.com/400x300?text=Placeholder+Image"}
//                 alt={props.alt || "Placeholder Image"}
//                 style={imageStyle}
//             />
//         </div>
//     );
// };

// export default ImageBlock;

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

    const handleClick = (e) => {
        if (isPreview && props.url) {
            window.open(props.url, props.target || "_self");
        } else {
            e.stopPropagation();
            onSelect(block.id);
            // Cho phép click vào ảnh để upload khi không ở chế độ preview
            fileInputRef.current?.click();
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
            onClick={!isPreview ? onSelect : undefined}
            style={{ cursor: isPreview && props.url ? "pointer" : "default" }}
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
                src={props.src || "https://via.placeholder.com/400x300?text=Placeholder+Image"}
                alt={props.alt || "Placeholder Image"}
                style={imageStyle}
                onClick={handleClick}
            />
        </div>
    );
};

export default ImageBlock;
