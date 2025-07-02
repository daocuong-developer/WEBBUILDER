// src/components/PropertyPanel/properties/sectionOptions.jsx
import React from "react";
import DeleteButton from "./DeleteButton";

const SectionOptions = ({ block, handleChange, onDelete }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Background Color
      </label>
      <input
        type="color"
        className="w-full border rounded px-2 py-1"
        value={block.props.backgroundColor || "#f0f0f0"}
        onChange={(e) => handleChange("backgroundColor", e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Padding (CSS value)
      </label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1"
        value={block.props.padding || "40px 0"}
        onChange={(e) => handleChange("padding", e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Min Height (px or auto)
      </label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1"
        value={block.props.minHeight || "auto"}
        onChange={(e) => handleChange("minHeight", e.target.value)}
      />
    </div>

    {/* DELETE COMPONENT */}
    {onDelete && (
      <div className="pt-4 border-t">
        <DeleteButton onDelete={onDelete} />
      </div>
    )}
  </div>
);

export default SectionOptions;
