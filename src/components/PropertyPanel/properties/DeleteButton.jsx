import React from "react";
import { Trash2 } from "lucide-react";

const DeleteButton = ({ onDelete, className = "" }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors ${className}`}
      title="Delete Component"
    >
      <Trash2 size={16} />
      Delete Component
    </button>
  );
};

export default DeleteButton;
