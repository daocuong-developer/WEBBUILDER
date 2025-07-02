import React, { useEffect, useState } from "react";
import { X, Pencil, Trash, Check, File, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageManager() {
    const [pages, setPages] = useState([]);
    const [newPageName, setNewPageName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState("");

    const navigate = useNavigate();

    // Lấy currentProject và currentPage từ localStorage
    const currentProject = JSON.parse(localStorage.getItem("currentProject"));
    const currentProjectId = currentProject?.id;
    const currentPage = localStorage.getItem("currentPage");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("pages")) || [];
        setPages(saved);
    }, []);

    const savePages = (data) => {
        localStorage.setItem("pages", JSON.stringify(data));
        setPages(data);
    };

    const slugify = (name) =>
        name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

    const handleAddPage = () => {
        if (!newPageName.trim()) return;

        if (!currentProjectId) {
            alert("Please select a project first in the Project Manager.");
            return;
        }

        const slug = "/" + slugify(newPageName);

        const newPage = {
            id: Date.now().toString(),
            name: newPageName,
            slug,
            updatedAt: new Date().toISOString(),
            status: "Saved",
            projectId: currentProjectId,
        };

        const updated = [...pages, newPage];
        savePages(updated);
        setNewPageName("");
    };

    const handleDelete = (id) => {
        const updated = pages.filter((p) => p.id !== id);
        savePages(updated);
        if (id === currentPage) {
            localStorage.removeItem("currentPage");
            window.location.reload();
        }
    };

    const handleSetCurrent = (id) => {
        localStorage.setItem("currentPage", id);
        window.location.reload();
    };

    const handleClose = () => {
        const event = new CustomEvent("close-page-manager");
        window.dispatchEvent(event);
    };

    const handleStartEdit = (page) => {
        setEditingId(page.id);
        setEditedName(page.name);
    };

    const handleConfirmEdit = (id) => {
        const updated = pages.map((page) =>
            page.id === id
                ? {
                      ...page,
                      name: editedName,
                      slug: "/" + slugify(editedName),
                      updatedAt: new Date().toISOString(),
                  }
                : page
        );
        savePages(updated);
        setEditingId(null);
        setEditedName("");
    };

    const filteredPages = pages.filter((p) => p.projectId === currentProjectId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-4xl min-h-[500px] rounded-lg shadow-xl p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Page Manager</h2>
                    <button onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                {!currentProjectId && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                        <p className="font-bold">No Project Selected</p>
                        <p>Please select a project from the Project Manager to add or view pages.</p>
                    </div>
                )}

                <div className="flex gap-2 mb-4">
                    <input
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        placeholder="New page name"
                        className="flex-1 p-2 border rounded"
                        disabled={!currentProjectId}
                    />
                    <button
                        onClick={handleAddPage}
                        className={`px-4 py-2 text-white rounded ${
                            !currentProjectId ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                        }`}
                        disabled={!currentProjectId}
                    >
                        + Add Page
                    </button>
                </div>

                <table className="w-full text-sm border-t">
                    <thead>
                        <tr className="text-left text-gray-500 border-b">
                            <th className="py-2">Page Name</th>
                            <th>URL</th>
                            <th>Last Updated</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPages.length > 0 ? (
                            filteredPages.map((page) => (
                                <tr key={page.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 flex items-center gap-2">
                                        {page.name.toLowerCase() === "home" ? <Home size={16} /> : <File size={16} />}
                                        {editingId === page.id ? (
                                            <input
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="border rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            <span>{page.name}</span>
                                        )}
                                    </td>
                                    <td>{page.slug}</td>
                                    <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
                                    <td>
                                        {page.id === currentPage ? (
                                            <span className="px-2 py-1 text-xs bg-black text-white rounded">
                                                Current
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs bg-gray-200 rounded">Saved</span>
                                        )}
                                    </td>
                                    <td className="flex gap-2 py-2 items-center">
                                        <button
                                            onClick={() => (window.location.href = `/edit-page/${page.id}`)}
                                            className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                            title="Edit Page Content"
                                        >
                                            Edit
                                        </button>
                                        {/* <button
                                            onClick={() => navigate(`/edit-page/${page.id}`)}
                                            className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                            title="Edit Page Content"
                                        >
                                            Edit
                                        </button> */}

                                        {page.id !== currentPage && (
                                            <button
                                                onClick={() => handleSetCurrent(page.id)}
                                                className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                                            >
                                                Set
                                            </button>
                                        )}

                                        {editingId === page.id ? (
                                            <button
                                                onClick={() => handleConfirmEdit(page.id)}
                                                className="p-1 hover:bg-green-100 rounded text-green-600"
                                                title="Save"
                                            >
                                                <Check size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStartEdit(page)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                                title="Rename"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(page.id)}
                                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                                            title="Delete"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    {currentProjectId
                                        ? "No pages found for this project. Add a new page above!"
                                        : "Select a project to view its pages."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}