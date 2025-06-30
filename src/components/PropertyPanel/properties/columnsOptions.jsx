// src/components/PropertyPanel/properties/columnsOptions.jsx
import React from 'react';

const ColumnsOptions = ({ block, handleChange }) => (
    <>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Columns</label>
            <input
                type="number"
                min="1"
                max="6" // Giả sử tối đa 6 cột
                className="w-full border rounded px-2 py-1"
                value={block.props.numColumns || 2}
                onChange={(e) => handleChange("numColumns", parseInt(e.target.value))}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gap (px)</label>
            <input
                type="number"
                className="w-full border rounded px-2 py-1"
                value={block.props.gap || 20}
                onChange={(e) => handleChange("gap", parseInt(e.target.value))}
            />
        </div>
    </>
);

export default ColumnsOptions;