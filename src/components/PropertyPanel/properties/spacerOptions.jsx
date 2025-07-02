// src/components/PropertyPanel/properties/spacerOptions.jsx
import React from "react";
import DeleteButton from "./DeleteButton";

const SpacerOptions = ({ block, handleChange, onDelete }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Height (px)
      </label>
      <input
        type="number"
        className="w-full border rounded px-2 py-1"
        value={block.props.height || 20}
        onChange={(e) => handleChange("height", parseInt(e.target.value))}
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

export default SpacerOptions;
