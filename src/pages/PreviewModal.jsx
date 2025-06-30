import React, { useState, useEffect } from "react";
import { X, Home, ChevronLeft, ChevronRight } from "lucide-react";
import RenderBlock from "@/components/renderBlock";

export default function PreviewModal({ open, onClose, device }) {
    const [pages, setPages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [projectName, setProjectName] = useState("");
    const isPreview = true;

    useEffect(() => {
        const storedPages = JSON.parse(localStorage.getItem("pages")) || [];
        const currentPageId = localStorage.getItem("currentPageId");
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));
        setProjectName(currentProject?.name || "Project");

        const filtered = storedPages.filter((page) => page.projectId === currentProject?.id);

        const currentIndex = filtered.findIndex((p) => p.id === currentPageId);
        setPages(filtered);
        setCurrentPageIndex(currentIndex !== -1 ? currentIndex : 0);
    }, [open]);

    const currentPage = pages[currentPageIndex];

    const currentBlocks =
        currentPage?.id === localStorage.getItem("currentPageId")
            ? JSON.parse(localStorage.getItem(`page_data_${currentPage?.id}`)) || []
            : [];
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="p-4  max-h-[95vh]">
                <div
                    className={`bg-white rounded shadow transition-all duration-300 border
                    ${device === "mobile" ? "w-[375px]" : device === "tablet" ? "w-[768px]" : "w-[1240px]"}
                `}
                >
                    {/* Header */}
                    {/* <div className="flex justify-between items-center border-b px-4 py-2">
                        <h2 className="text-lg font-semibold">
                            Preview: {projectName} - {currentPage?.name}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPageIndex === 0}
                                onClick={() => setCurrentPageIndex((prev) => prev - 1)}
                                className="border rounded px-2 py-1 disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm">
                                Page {currentPageIndex + 1} of {pages.length}
                            </span>
                            <button
                                disabled={currentPageIndex === pages.length - 1}
                                onClick={() => setCurrentPageIndex((prev) => prev + 1)}
                                className="border rounded px-2 py-1 disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPageIndex(0)}
                                className="border rounded px-2 py-1"
                                title="Go to Home Page"
                            >
                                <Home size={16} />
                            </button>
                            <button onClick={onClose} className="ml-2 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                    </div> */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
                        <h2 className="text-lg font-semibold min-w-0 truncate">
                            Preview: {projectName} - {currentPage?.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                disabled={currentPageIndex === 0}
                                onClick={() => setCurrentPageIndex((prev) => prev - 1)}
                                className="border rounded px-2 py-1 disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm">
                                Page {currentPageIndex + 1} of {pages.length}
                            </span>
                            <button
                                disabled={currentPageIndex === pages.length - 1}
                                onClick={() => setCurrentPageIndex((prev) => prev + 1)}
                                className="border rounded px-2 py-1 disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPageIndex(0)}
                                className="border rounded px-2 py-1"
                                title="Go to Home Page"
                            >
                                <Home size={16} />
                            </button>
                            <button onClick={onClose} className="ml-2 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="overflow-y-auto p-4"
                        style={{
                            maxHeight: "calc(90vh - 48px)",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                pointerEvents: isPreview ? "none" : "auto",
                            }}
                        >
                            {isPreview ? (
                                <div
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        backgroundColor: "#fff",
                                        minHeight: "300px",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    {currentBlocks && currentBlocks.length > 0 ? (
                                        currentBlocks.map((block) => (
                                            <div key={block.id} style={{ marginBottom: "12px" }}>
                                                <RenderBlock block={block} blocks={currentBlocks} isPreview={true} />
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className="text-gray-400 text-center italic"
                                            style={{
                                                margin: "auto",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            This page is empty. Add elements to see a preview.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                currentBlocks.map((block) => (
                                    <RenderBlock
                                        key={block.id}
                                        block={block}
                                        blocks={currentBlocks}
                                        isPreview={false}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
