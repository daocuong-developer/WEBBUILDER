// src/components/PropertyPanel/properties/ButtonOptions.jsx
import React from "react";
import TextOptions from "./textOptions"; // Import TextOptions nếu nút có thể có định dạng văn bản

// Danh sách icon demo (trong thực tế, bạn có thể có một file riêng hoặc load từ API)
const availableIcons = [
    { name: "None", src: "" },
    { name: "Arrow Right", src: "/icons/arrow-right.svg" },
    { name: "Arrow Right", src: "/icons/arrow-left.svg" },
    { name: "Checkmark", src: "/icons/check.svg" },
    { name: "Star", src: "/icons/star.svg" },
    { name: "Heart", src: "/icons/heart.svg" },
    { name: "Plus", src: "/icons/plus.svg" },
    { name: "Minus", src: "/icons/minus.svg" },
    { name: "Download", src: "/icons/download.svg" },
    { name: "Upload", src: "/icons/upload.svg" },
];

const ButtonOptions = ({ block, handleChange }) => {
    // Đảm bảo các props tồn tại để tránh lỗi undefined
    const props = block.props || {};

    const handleNumericChange = (key, value, unit = "") => {
        if (value === "" || !isNaN(parseFloat(value))) {
            handleChange(key, `${value}${unit}`);
        }
    };

    return (
        <div className="space-y-4">
            {" "}
            {/* Dùng div bọc ngoài để quản lý khoảng cách */}
            {/* CONTENT SETTINGS */}
            <section className="space-y-2">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-2">Content</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={props.text || "Click Me"}
                        onChange={(e) => handleChange("text", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (href)</label>
                    <input
                        type="text" // Changed to text as it can be # or a relative path
                        className="w-full border rounded px-2 py-1"
                        value={props.href || ""} // <-- Đã đổi từ url sang href
                        onChange={(e) => handleChange("href", e.target.value)} // <-- Đã đổi từ url sang href
                        placeholder="e.g., #contact or /about-us or https://example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Target</label>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={props.target || "_self"}
                        onChange={(e) => handleChange("target", e.target.value)}
                    >
                        <option value="_self">Same Tab (_self)</option>
                        <option value="_blank">New Tab (_blank)</option>
                    </select>
                </div>
            </section>
            {/* TYPOGRAPHY & COLORS */}
            <section className="space-y-2">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-2">Typography & Colors</h4>

                {/* Căn chỉnh nội dung bên trong nút */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Align (Inside Button)</label>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={props.textAlign || "center"}
                        onChange={(e) => handleChange("textAlign", e.target.value)}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                {/* Căn chỉnh khối button trong phần tử cha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Block Alignment</label>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={props.blockAlignment || "left"}
                        onChange={(e) => handleChange("blockAlignment", e.target.value)}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <input
                        type="color"
                        className="w-full border rounded px-2 py-1 h-8"
                        value={props.backgroundColor || "#007bff"}
                        onChange={(e) => handleChange("backgroundColor", e.target.value)}
                    />
                </div>

                {/* Tái sử dụng TextOptions cho các định dạng văn bản như fontSize, bold, italic, etc. */}
                <TextOptions block={block} handleChange={handleChange} />
            </section>
            {/* LAYOUT & STYLING */}
            <section className="space-y-2">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-2">Layout & Style</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Padding (e.g., "10px 20px")</label>
                    <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={props.padding || "10px 20px"}
                        onChange={(e) => handleChange("padding", e.target.value)}
                        placeholder="e.g., 10px 20px or 1rem"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
                    <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={parseInt(props.borderRadius) || 8} // ParseInt for number input
                        onChange={(e) => handleNumericChange("borderRadius", e.target.value, "px")} // Sử dụng handleNumericChange
                    />
                </div>
            </section>
            {/* HOVER EFFECTS */}
            <section className="space-y-2">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-2">Hover Effects</h4>
                <div className="flex items-center">
                    <input
                        id="hoverEffect"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={props.hoverEffect || false}
                        onChange={(e) => handleChange("hoverEffect", e.target.checked)}
                    />
                    <label htmlFor="hoverEffect" className="ml-2 block text-sm text-gray-900">
                        Enable Hover Effect
                    </label>
                </div>
                {props.hoverEffect && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hover Background Color
                            </label>
                            <input
                                type="color"
                                className="w-full border rounded px-2 py-1 h-8"
                                value={props.hoverBackgroundColor || "#0056b3"}
                                onChange={(e) => handleChange("hoverBackgroundColor", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hover Text Color</label>
                            <input
                                type="color"
                                className="w-full border rounded px-2 py-1 h-8"
                                value={props.hoverTextColor || "#ffffff"}
                                onChange={(e) => handleChange("hoverTextColor", e.target.value)}
                            />
                        </div>
                    </>
                )}
            </section>
            {/* ICON SETTINGS */}
            <section className="space-y-2">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-2">Icon</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Icon</label>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={props.icon || ""}
                        onChange={(e) => handleChange("icon", e.target.value)}
                    >
                        {availableIcons.map((icon, index) => (
                            <option key={index} value={icon.src}>
                                {icon.name}
                            </option>
                        ))}
                    </select>
                </div>
                {props.icon && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Preview</label>
                        <img src={props.icon} alt="Selected Icon" className="w-6 h-6 inline-block align-middle mr-2" />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon Size (px)</label>
                    <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={parseInt(props.iconSize) || 16}
                        onChange={(e) => handleChange("iconSize", parseInt(e.target.value))}
                    />
                </div>
            </section>
            <section className="space-y-2">
                {/* <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-2">Button Type</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Size</label>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={props.size || "md"}
                        onChange={(e) => handleChange("size", e.target.value)}
                    >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                    </select>
                </div> */}
                <div className="flex items-center">
                    <input
                        id="disabled"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={props.disabled || false}
                        onChange={(e) => handleChange("disabled", e.target.checked)}
                    />
                    <label htmlFor="disabled" className="ml-2 block text-sm text-gray-900">
                        Disabled
                    </label>
                </div>
            </section>
        </div>
    );
};

export default ButtonOptions;
