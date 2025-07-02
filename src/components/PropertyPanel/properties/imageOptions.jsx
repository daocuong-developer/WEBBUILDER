// // src/components/PropertyPanel/properties/imageOptions.jsx
// import React from 'react';

// const ImageOptions = ({ block, handleChange }) => (
//     <>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
//             <input
//                 type="url"
//                 className="w-full border rounded px-2 py-1"
//                 value={block.props.src || ""}
//                 onChange={(e) => handleChange("src", e.target.value)}
//             />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
//             <input
//                 className="w-full border rounded px-2 py-1"
//                 value={block.props.alt || ""}
//                 onChange={(e) => handleChange("alt", e.target.value)}
//             />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Width (px or %)</label>
//             <input
//                 type="text"
//                 className="w-full border rounded px-2 py-1"
//                 value={block.props.width || "100%"}
//                 onChange={(e) => handleChange("width", e.target.value)}
//             />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Height (px or auto)</label>
//             <input
//                 type="text"
//                 className="w-full border rounded px-2 py-1"
//                 value={block.props.height || "auto"}
//                 onChange={(e) => handleChange("height", e.target.value)}
//             />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Object Fit</label>
//             <select
//                 className="w-full border rounded px-2 py-1"
//                 value={block.props.objectFit || "cover"}
//                 onChange={(e) => handleChange("objectFit", e.target.value)}
//             >
//                 <option value="fill">Fill</option>
//                 <option value="contain">Contain</option>
//                 <option value="cover">Cover</option>
//                 <option value="none">None</option>
//                 <option value="scale-down">Scale Down</option>
//             </select>
//         </div>
//     </>
// );

// export default ImageOptions;

// src/components/PropertyPanel/properties/ImageOptions.jsx
import React from "react";
import DeleteButton from "./DeleteButton";

const ImageOptions = ({ block, handleChange, onDelete }) => (
  <div className="space-y-4">
    {/* Image URL */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Image URL
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        value={block.props.src || ""}
        onChange={(e) => handleChange("src", e.target.value)}
      />
    </div>

    {/* Upload Image */}
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const localUrl = URL.createObjectURL(file);
            handleChange("src", localUrl);
          }
        }}
      />
    </div>

    {/* Alt Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Alt Text
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        value={block.props.alt || ""}
        onChange={(e) => handleChange("alt", e.target.value)}
      />
    </div>

    {/* Width */}
    <div className="mt-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Width (px)
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        type="number"
        value={block.props.width || ""}
        onChange={(e) => handleChange("width", e.target.value)}
      />
    </div>

    {/* Height */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Height (px)
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        type="number"
        value={block.props.height || ""}
        onChange={(e) => handleChange("height", e.target.value)}
      />
    </div>

    {/* Border Radius */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Border Radius
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        value={block.props.borderRadius || ""}
        onChange={(e) => handleChange("borderRadius", e.target.value)}
      />
    </div>

    {/* Shadow */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Shadow
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        value={block.props.shadow || ""}
        onChange={(e) => handleChange("shadow", e.target.value)}
      />
    </div>

    {/* Click Action */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Click Action (URL/Popup)
      </label>
      <input
        className="w-full border rounded px-2 py-1"
        value={block.props.onClickAction || ""}
        onChange={(e) => handleChange("onClickAction", e.target.value)}
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

export default ImageOptions;
