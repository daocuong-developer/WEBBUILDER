// ProjectManager.jsx
import React, { useState, useEffect } from "react";
import { Plus, Upload, MoreHorizontal, X } from "lucide-react";
import { Pencil, Copy, Trash2, Download, ArrowUpRight } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

// Thêm onProjectsUpdate làm prop
export default function ProjectManager({ onClose, onProjectsUpdate }) {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Lấy dữ liệu projects ban đầu từ localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("projects")) || [];
        setProjects(saved);
    }, []);

    // Cập nhật localStorage và state `projects`, đồng thời gọi callback để thông báo cho component cha
    const saveProjects = (data) => {
        localStorage.setItem("projects", JSON.stringify(data));
        setProjects(data);
        if (onProjectsUpdate) {
            onProjectsUpdate(data); // Gọi callback để Navbar cập nhật state của nó
        }
    };

    const handleCreate = () => {
        if (!name.trim()) return;

        const newProject = {
            id: Date.now().toString(),
            name,
            description,
            updatedAt: new Date().toISOString(),
            pages: Math.floor(Math.random() * 5) + 1,
        };

        const updated = [...projects, newProject];
        saveProjects(updated); // Sẽ tự động gọi onProjectsUpdate

        // Reset form
        setName("");
        setDescription("");
    };

    const handleSetCurrent = (id) => {
        const selected = projects.find((p) => p.id === id);
        if (!selected) return;
        localStorage.setItem("currentProject", JSON.stringify(selected));
        if (onProjectsUpdate) {
            // Cập nhật cả danh sách projects (không thay đổi) và currentProject
            onProjectsUpdate(projects, selected);
        }
        // Đóng ProjectManager sau khi chọn project mới
        onClose();
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    saveProjects([...projects, ...imported]); // Sẽ tự động gọi onProjectsUpdate
                    alert("Import thành công!");
                } else {
                    alert("File không hợp lệ.");
                }
            } catch (err) {
                alert("Lỗi khi đọc file JSON.");
            }
        };
        reader.readAsText(file);
    };

    const handleClose = () => {
        // Có thể không cần CustomEvent nếu bạn dùng prop `onClose` của ProjectManager
        // const event = new CustomEvent("close-project-manager");
        // window.dispatchEvent(event);
        if (onClose) {
            onClose();
        }
    };

    const handleEdit = (project) => {
        setName(project.name);
        setDescription(project.description);
        setShowForm(true);
        setActiveMenuId(null); // Đóng menu sau khi click
    };

    const handleDuplicate = (project) => {
        const newProject = {
            ...project,
            id: Date.now().toString(),
            name: `${project.name} Copy`,
            updatedAt: new Date().toISOString(),
        };
        saveProjects([...projects, newProject]); // Sẽ tự động gọi onProjectsUpdate
        setActiveMenuId(null); // Đóng menu sau khi click
    };

    const handleExport = (project) => {
        const blob = new Blob([JSON.stringify([project], null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setActiveMenuId(null); // Đóng menu sau khi click
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
        setActiveMenuId(null); // Đóng menu sau khi click
    };

    const confirmDelete = () => {
        const updated = projects.filter((p) => p.id !== deleteId);
        saveProjects(updated); // Sẽ tự động gọi onProjectsUpdate
        if (deleteId === currentProjectId) {
            localStorage.removeItem("currentProject"); // Xóa currentProject nếu project hiện tại bị xóa
            if (onProjectsUpdate) {
                onProjectsUpdate(updated, null); // Cập nhật currentProject là null nếu bị xóa
            }
        }
        setDeleteId(null);
        setShowConfirm(false);
    };

    const currentProject = JSON.parse(localStorage.getItem("currentProject"));
    const currentProjectId = currentProject?.id;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-xl font-semibold">Project Manager</div>
                    <button
                        onClick={handleClose}
                        className="flex items-center gap-2 px-4 py-2 rounded text-sm text-gray-500 hover:text-black"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 border rounded bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                    >
                        <Plus size={16} /> New Project
                    </button>

                    <label className="px-4 py-2 border rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100">
                        <Upload size={16} /> Import Project
                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                    </label>
                </div>

                {showForm && (
                    <div className="border rounded p-4 mb-6 bg-white space-y-2">
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Project description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setName("");
                                    setDescription("");
                                    setShowForm(false);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-black text-white rounded">
                                Create Project
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="border rounded shadow-sm">
                            <div className="bg-gray-100 text-center p-4 text-lg font-medium text-gray-600">
                                {project.name}
                            </div>
                            <div className="p-4 text-sm space-y-2">
                                <div className="font-medium">{project.name}</div>
                                <div className="text-gray-500">{project.description || "No description"}</div>
                                <div className="text-xs text-gray-400">
                                    {project.pages || 1} pages • Updated{" "}
                                    {new Date(project.updatedAt).toLocaleDateString()}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    {project.id === currentProjectId ? (
                                        <span className="text-xs px-3 py-1 rounded-full bg-black text-white">
                                            Current
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleSetCurrent(project.id)}
                                            className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                                        >
                                            Current
                                        </button>
                                    )}
                                    <div className="text-gray-500 hover:text-black">
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setActiveMenuId(activeMenuId === project.id ? null : project.id)
                                                }
                                                className="text-gray-500 hover:text-black"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>

                                            {activeMenuId === project.id && (
                                                <div className="absolute right-[22px] top-0 bg-white border shadow-md rounded w-40 text-sm z-10">
                                                    <button
                                                        onClick={() => handleSetCurrent(project.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        <ArrowUpRight size={16} /> Open
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        <Pencil size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDuplicate(project)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        <Copy size={16} /> Duplicate
                                                    </button>
                                                    <button
                                                        onClick={() => handleExport(project)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        <Download size={16} /> Export
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmModal
                isOpen={showConfirm}
                onCancel={() => {
                    setShowConfirm(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
