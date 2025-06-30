import React from "react";
import { Trash2 } from "lucide-react";

const FooterOptions = ({ block, handleChange }) => {
    const props = block.props || {};

    const handleColumnChange = (index, key, value) => {
        const updated = [...props.columns];
        updated[index][key] = value;
        handleChange("columns", updated);
    };

    const handleItemChange = (colIdx, itemIdx, value) => {
        const updated = [...props.columns];
        updated[colIdx].items[itemIdx] = value;
        handleChange("columns", updated);
    };

    const addColumn = () => {
        handleChange("columns", [...(props.columns || []), { title: "New Column", items: [] }]);
    };

    const removeColumn = (index) => {
        const updated = [...props.columns];
        updated.splice(index, 1);
        handleChange("columns", updated);
    };

    const addItem = (colIdx) => {
        const updated = [...props.columns];
        updated[colIdx].items.push("New Item");
        handleChange("columns", updated);
    };

    const removeItem = (colIdx, itemIdx) => {
        const updated = [...props.columns];
        updated[colIdx].items.splice(itemIdx, 1);
        handleChange("columns", updated);
    };

    return (
        <div>
            <hr className="my-4" />
            <div className="mb-4 font-semibold">General</div>
            <input
                type="color"
                value={props.backgroundColor}
                onChange={(e) => handleChange("backgroundColor", e.target.value)}
            />
            <input type="color" value={props.color} onChange={(e) => handleChange("color", e.target.value)} />

            <div className="mb-4 mt-4 font-semibold">Columns</div>
            {(props.columns || []).map((col, colIdx) => (
                <div key={colIdx} className="mb-4 border p-2 rounded bg-gray-50">
                    <input
                        className="w-full mb-2 border px-2 py-1"
                        value={col.title}
                        onChange={(e) => handleColumnChange(colIdx, "title", e.target.value)}
                        placeholder="Column Title"
                    />

                    {(col.items || []).map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2 mb-1">
                            <input
                                className="w-full border px-2 py-1"
                                value={typeof item === "string" ? item : item.icon}
                                onChange={(e) =>
                                    handleItemChange(
                                        colIdx,
                                        itemIdx,
                                        typeof item === "string" ? e.target.value : { ...item, icon: e.target.value }
                                    )
                                }
                            />
                            <button onClick={() => removeItem(colIdx, itemIdx)} className="text-red-500 text-sm">
                                ✕
                            </button>
                        </div>
                    ))}

                    <button onClick={() => addItem(colIdx)} className="text-blue-600 text-sm mt-2">
                        + Add Item
                    </button>
                    <button onClick={() => removeColumn(colIdx)} className="text-red-600 text-sm ml-2">
                        <Trash2 /> Remove Column
                    </button>
                </div>
            ))}

            <button onClick={addColumn} className="text-blue-600 text-sm mt-2">
                + Add Column
            </button>

            <hr className="my-4" />
            <div className="font-semibold">Copyright</div>
            <input
                className="w-full border px-2 py-1 mt-2"
                value={props.copyrightText}
                onChange={(e) => handleChange("copyrightText", e.target.value)}
            />
            <input
                type="color"
                className="mt-2"
                value={props.copyrightColor}
                onChange={(e) => handleChange("copyrightColor", e.target.value)}
            />
        </div>
    );
};

export default FooterOptions;
