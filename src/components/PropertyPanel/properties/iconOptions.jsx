import React, { useState } from "react";
import * as Icons from "lucide-react";

const iconList = [
    "Star",
    "Heart",
    "Check",
    "Smile",
    "Sun",
    "Moon",
    "Home",
    "User",
    "AlertCircle",
    "Bell",
    "Camera",
    "Cloud",
    "Download",
    "Edit",
    "Eye",
    "File",
    "Gift",
    "Globe",
    "Image",
    "Key",
    "Lock",
    "MapPin",
    "Phone",
    "Search",
    "Settings",
];

const IconOptions = ({ block, handleChange }) => {
    const selectedIconName = block.props.iconName || "Star";
    const IconComponent = Icons[selectedIconName] || Icons["Star"];
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIcons = iconList.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm và chọn Icon</label>
                <input
                    type="text"
                    placeholder="Tìm icon (e.g., star, user...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded px-2 py-1 mb-2"
                />

                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                    {filteredIcons.map((name) => {
                        const Icon = Icons[name];
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => handleChange("iconName", name)}
                                className={`flex flex-col items-center justify-center p-2 border rounded text-xs hover:bg-gray-100 ${
                                    selectedIconName === name ? "bg-blue-100 border-blue-500" : ""
                                }`}
                            >
                                <Icon size={24} />
                                <span>{name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Size (px)</label>
                <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={block.props.size || 24}
                    onChange={(e) => handleChange("size", parseInt(e.target.value))}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                <input
                    type="color"
                    className="w-full border rounded px-2 py-1"
                    value={block.props.color || "#000000"}
                    onChange={(e) => handleChange("color", e.target.value)}
                />
            </div>
        </div>
    );
};

export default IconOptions;
