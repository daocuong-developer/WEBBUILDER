import React from "react";
import useGoogleFontLoader from "@/hooks/useGoogleFontLoader";
import GoogleFontsSelector from "@/components/GoogleFontsSelector";

const TextOptions = ({ block, handleChange }) => {
    const fontFamily = block.props.fontFamily || "sans-serif";

    // Load Google Font khi chọn
    useGoogleFontLoader(fontFamily);

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <input
                    type="color"
                    className="w-full border rounded px-2 py-1"
                    value={block.props.color || "#000000"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                <select
                    className="w-full border rounded px-2 py-1"
                    value={block.props.textAlign || "left"}
                    onChange={(e) => handleChange("textAlign", e.target.value)}
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <GoogleFontsSelector value={fontFamily} onChange={(value) => handleChange("fontFamily", value)} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
                <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={block.props.fontSize || 16}
                    onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
                <input
                    type="number"
                    step="0.1"
                    className="w-full border rounded px-2 py-1"
                    value={block.props.lineHeight || "1.5"}
                    onChange={(e) => handleChange("lineHeight", e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing (px)</label>
                <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={block.props.letterSpacing || "0"}
                    onChange={(e) => handleChange("letterSpacing", parseInt(e.target.value))}
                />
            </div>

            <div className="flex space-x-2">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={block.props.bold || false}
                        onChange={(e) => handleChange("bold", e.target.checked)}
                    />
                    <span className="ml-1">Bold</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={block.props.italic || false}
                        onChange={(e) => handleChange("italic", e.target.checked)}
                    />
                    <span className="ml-1">Italic</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={block.props.underline || false}
                        onChange={(e) => handleChange("underline", e.target.checked)}
                    />
                    <span className="ml-1">Underline</span>
                </label>
            </div>
        </>
    );
};

export default TextOptions;
