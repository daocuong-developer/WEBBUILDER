import React, { useEffect, useState } from "react";
import { LayoutTemplate, Package, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import { useSave } from "@/contexts/SaveContext";
import { toast } from "react-toastify";
import RenderBlockComponent from "@/components/RenderBlock";
import getDefaultProps from "@/utils/defaultProps";
import PropertyPanel from "@/components/PropertyPanel/PropertyPanel";
import { useUndo } from "@/contexts/UndoContext";

function SortableItem({ block, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export default function EditablePage() {
    const [blocks, setBlocks] = useState([]);
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const { id } = useParams();
    const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
    const isContainerSelected = selectedBlock?.type === "container";
    const { setSaveFn } = useSave();
    const [expandedBlocks, setExpandedBlocks] = useState({});
    const { recordState, handleUndo, handleRedo, canUndo, canRedo } = useUndo();

    useEffect(() => {
        setSaveFn(() => () => {
            const dataToSave = JSON.stringify(blocks);
            localStorage.setItem(`page_data_${id}`, dataToSave);
            toast.success("Saved successfully!");
        });
    }, [blocks, id]);

    useEffect(() => {
        const saved = localStorage.getItem(`page_data_${id}`);
        setBlocks(saved ? JSON.parse(saved) : []);
    }, [id]);

    useEffect(() => {
        const handleUpdateBlocks = () => {
            const saved = localStorage.getItem("currentBlocks");
            if (saved) setBlocks(JSON.parse(saved));
        };

        window.addEventListener("update-blocks", handleUpdateBlocks);
        return () => window.removeEventListener("update-blocks", handleUpdateBlocks);
    }, []);

    const addBlock = (type, parentId = null) => {
        const newBlock = { id: Date.now().toString(), type, props: getDefaultProps(type) };

        setBlocks((prev) => {
            const updated = [...prev, newBlock];
            const newState = parentId
                ? updated.map((b) =>
                      b.id === parentId
                          ? {
                                ...b,
                                props: {
                                    ...b.props,
                                    children: [...(b.props.children || []), newBlock.id],
                                },
                            }
                          : b
                  )
                : updated;

            recordState(newState);
            return newState;
        });

        if (!parentId) setSelectedBlockId(newBlock.id);
    };

    const updateBlock = (updatedBlock) => {
        const updateRecursive = (blocks) =>
            blocks.map((block) => {
                if (block.id === updatedBlock.id) {
                    return updatedBlock;
                }

                if (block.type === "container" && Array.isArray(block.props.children)) {
                    const updatedChildren = updateRecursive(block.props.children);
                    return {
                        ...block,
                        props: {
                            ...block.props,
                            children: updatedChildren,
                        },
                    };
                }

                return block;
            });

        const newBlocks = updateRecursive(blocks);
        setBlocks(newBlocks);
        recordState(newBlocks);
    };

    const renderTree = (block, level = 0) => {
        if (!block) return null;
        const isExpanded = expandedBlocks[block.id] ?? true;
        const children = block.props.children?.map((id) => blocks.find((b) => b.id === id)).filter(Boolean);
        const isContainer = block.type === "container";

        return (
            <div key={block.id} className="ml-1">
                <div
                    className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition ${
                        selectedBlockId === block.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
                    }`}
                    style={{ paddingLeft: `${level * 16}px` }}
                    onClick={() => setSelectedBlockId(block.id)}
                >
                    <div className="flex items-center gap-1">
                        {isContainer ? <LayoutTemplate size={16} /> : <Package size={16} />}
                        {block.type}
                    </div>
                    {isContainer && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(block.id);
                            }}
                            className="text-xs text-gray-600 w-4"
                        >
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                    )}
                </div>
                {isExpanded && children?.map((child) => renderTree(child, level + 1))}
            </div>
        );
    };

    const toggleExpand = (blockId) => setExpandedBlocks((prev) => ({ ...prev, [blockId]: !prev[blockId] }));

    const handleDeleteBlock = (id) => {
        setBlocks((prev) => {
            const findAllChildIds = (parentId) => {
                const block = prev.find((b) => b.id === parentId);
                if (!block?.props?.children) return [parentId];
                return [parentId, ...block.props.children.flatMap(findAllChildIds)];
            };
            const idsToDelete = new Set(findAllChildIds(id));
            const newBlocks = prev.filter((b) => !idsToDelete.has(b.id));
            recordState(newBlocks);
            return newBlocks;
        });
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleMoveElement = (id, direction) => {
        setBlocks((prev) => {
            const index = prev.findIndex((b) => b.id === id);
            if (index < 0) return prev;

            const parent = prev.find((b) => b.props?.children?.includes(id));
            if (parent) {
                const children = [...parent.props.children];
                const childIndex = children.indexOf(id);
                const newIndex = childIndex + direction;

                if (newIndex < 0 || newIndex >= children.length) return prev;

                children.splice(childIndex, 1);
                children.splice(newIndex, 0, id);

                const updatedParent = {
                    ...parent,
                    props: {
                        ...parent.props,
                        children,
                    },
                };

                const newBlocks = prev.map((b) => (b.id === parent.id ? updatedParent : b));
                recordState(newBlocks);
                return newBlocks;
            }

            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newBlocks = [...prev];
            const [moved] = newBlocks.splice(index, 1);
            newBlocks.splice(newIndex, 0, moved);
            recordState(newBlocks);
            return newBlocks;
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                onAddComponent={(type) => addBlock(type, isContainerSelected ? selectedBlockId : null)}
                canvasElements={blocks}
                selectedElement={blocks.find((b) => b.id === selectedBlockId)}
                onSelectElement={(el) => setSelectedBlockId(el.id)}
                onMoveElement={handleMoveElement}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                    if (!over || active.id === over.id) return;
                    setBlocks((prev) => {
                        const activeIndex = prev.findIndex((b) => b.id === active.id);
                        const overIndex = prev.findIndex((b) => b.id === over.id);
                        const isChild = (id) => prev.some((b) => b.props.children?.includes(id));
                        if (isChild(active.id) || isChild(over.id)) return prev;
                        const newBlocks = arrayMove(prev, activeIndex, overIndex);
                        recordState(newBlocks);
                        return newBlocks;
                    });
                }}
            >
                <SortableContext
                    items={blocks.filter((b) => !blocks.some((p) => p.props.children?.includes(b.id)))}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex-1 overflow-y-auto" style={{ height: "90vh" }}>
                        {blocks.map((block) => {
                            const isChild = blocks.some((b) => b.props.children?.includes(block.id));
                            if (isChild) return null;
                            return (
                                <SortableItem key={block.id} block={block}>
                                    <div
                                        className={`relative group mb-2 cursor-pointer rounded border p-2 transition ${
                                            selectedBlockId === block.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-transparent hover:border-gray-900"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBlockId(block.id);
                                        }}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteBlock(block.id);
                                            }}
                                            className="absolute z-10 top-2 right-2 hidden group-hover:flex items-center justify-center bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                        >
                                            <Trash2 size="18px" />
                                        </button>
                                        <RenderBlockComponent
                                            block={block}
                                            blocks={blocks}
                                            onSelect={(id) => setSelectedBlockId(id)}
                                            onChange={updateBlock}
                                        />
                                    </div>
                                </SortableItem>
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="w-80 max-h-[90vh] overflow-y-auto p-2 border-l flex flex-col gap-4 overflow-auto">
                <div className="min-h-[250px] max-h-64 overflow-auto border rounded p-2">
                    <h2 className="text-lg font-semibold mb-2">Page Structure</h2>
                    {blocks
                        .filter((b) => !blocks.some((p) => p.props.children?.includes(b.id)))
                        .map((block) => renderTree(block))}
                </div>

                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Properties</h2>
                    {selectedBlock ? (
                        <PropertyPanel block={selectedBlock} onChange={updateBlock} />
                    ) : (
                        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
                    )}
                </div>
            </div>
        </div>
    );
}
