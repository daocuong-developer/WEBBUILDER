import React from "react";
import {
    CubeTransparentIcon,
    PhotoIcon,
    Squares2X2Icon,
    RectangleStackIcon,
    MegaphoneIcon,
    Bars3BottomLeftIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

const getIconForType = (type) => {
    switch (type) {
        case "button":
            return <RectangleStackIcon className="h-4 w-4 mr-2 text-blue-500" />;
        case "heading":
            return <MegaphoneIcon className="h-4 w-4 mr-2 text-green-500" />;
        case "paragraph":
            return <Bars3BottomLeftIcon className="h-4 w-4 mr-2 text-purple-500" />;
        case "image":
            return <PhotoIcon className="h-4 w-4 mr-2 text-orange-500" />;
        case "container":
            return <Squares2X2Icon className="h-4 w-4 mr-2 text-indigo-500" />;
        default:
            return <CubeTransparentIcon className="h-4 w-4 mr-2 text-gray-500" />;
    }
};

const LayerItem = ({ element, isSelected, onSelectElement, children }) => {
    const handleSelect = (e) => {
        e.stopPropagation();
        onSelectElement(element);
    };

    return (
        <div
            className={`
            flex flex-col rounded text-sm mb-1
            ${isSelected ? " border-blue-500" : "bg-white hover:bg-gray-50"}
        `}
        >
            <button className="flex items-center w-full p-2 text-left" onClick={handleSelect}>
                {getIconForType(element.type)}
                <span className="flex-grow capitalize">
                    {element.type} {element.type === "container" && element.children && `(${element.children.length})`}
                </span>
            </button>
            {children}
        </div>
    );
};

export default LayerItem;
