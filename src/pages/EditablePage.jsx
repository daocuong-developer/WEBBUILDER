import React, { useEffect, useState, useCallback } from "react"; // Xóa useRef
import {
  LayoutTemplate,
  Package,
  ChevronDown,
  ChevronRight,
  Undo,
  Redo,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function EditablePage() {
  // Lấy tất cả các giá trị cần thiết từ useUndo
  const {
    recordState,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    currentBlocks,
  } = useUndo();

  // blocks giờ đây là biến cục bộ, lấy giá trị từ currentBlocks của context.
  // Khi currentBlocks thay đổi, EditablePage sẽ tự động re-render.
  const blocks = currentBlocks || [];

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const { id } = useParams();
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const isContainerSelected =
    selectedBlock?.type === "container" || selectedBlock?.type === "section";
  const { setSaveFn } = useSave();
  const [expandedBlocks, setExpandedBlocks] = useState({});

  // Effect để lưu trạng thái hiện tại vào localStorage thông qua SaveContext
  useEffect(() => {
    setSaveFn(() => () => {
      const dataToSave = JSON.stringify(blocks);
      localStorage.setItem(`page_data_${id}`, dataToSave);
      toast.success("Saved successfully!");
    });
  }, [blocks, id, setSaveFn]);

  // Effect để tải dữ liệu ban đầu từ localStorage và đẩy vào UndoContext CHỈ MỘT LẦN
  // Đây là nơi duy nhất chúng ta sẽ chủ đ��ng gọi recordState để thiết lập trạng thái khởi tạo.
  useEffect(() => {
    const saved = localStorage.getItem(`page_data_${id}`);
    const initialBlocks = saved ? JSON.parse(saved) : [];

    // So sánh trực tiếp với currentBlocks từ context.
    // Nếu context chưa có gì hoặc khác với dữ liệu đã lưu, thì recordState.
    // Đây là điểm khởi đầu cho trạng thái trong context.
    // Chỉ chạy một lần trên component mount (do deps là []).
    if (!blocks.length && initialBlocks.length > 0) {
      // Chỉ record nếu blocks rỗng và có dữ liệu lưu
      recordState(initialBlocks);
    }

    // Lắng nghe sự kiện 'update-blocks' từ UndoContext để đảm bảo `selectedBlockId` hợp lệ
    const handleUpdateBlocks = () => {
      if (
        selectedBlockId &&
        !currentBlocks.some((b) => b.id === selectedBlockId)
      ) {
        setSelectedBlockId(null);
      }
    };

    // Xử lý thêm block vào column
    const handleAddBlockToColumn = (event) => {
      const { type, parentId, columnIndex } = event.detail;
      console.log("Adding block to column:", { type, parentId, columnIndex });

      // Tạo block mới với ID unique hơn
      const newBlock = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        props: getDefaultProps(type),
      };

      console.log("Created new block:", newBlock);

      // Tìm và cập nhật parent block
      const updatedBlocks = blocks.map((block) => {
        if (block.id === parentId) {
          const newChildren = [...(block.children || [])];
          // Đảm bảo có đủ mảng con cho từng cột
          while (newChildren.length <= columnIndex) {
            newChildren.push([]);
          }
          // Thêm block vào cột tương ứng
          if (!Array.isArray(newChildren[columnIndex])) {
            newChildren[columnIndex] = [];
          }
          newChildren[columnIndex] = [...newChildren[columnIndex], newBlock.id];

          console.log("Updated parent children:", newChildren);

          return {
            ...block,
            children: newChildren,
          };
        }
        return block;
      });

      // Thêm block mới vào danh sách
      const finalBlocks = [...updatedBlocks, newBlock];
      console.log("Final blocks:", finalBlocks);
      recordState(finalBlocks);
      setSelectedBlockId(newBlock.id);
    };

    window.addEventListener("update-blocks", handleUpdateBlocks);
    window.addEventListener("addBlockToColumn", handleAddBlockToColumn);

    return () => {
      window.removeEventListener("update-blocks", handleUpdateBlocks);
      window.removeEventListener("addBlockToColumn", handleAddBlockToColumn);
    };
  }, [id, recordState, selectedBlockId, blocks.length]); // Thêm blocks.length vào dependencies

  // ADD BLOCK
  const addBlock = (type, parentId = null) => {
    const newBlock = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      props: getDefaultProps(type),
    };
    let updatedBlocks;

    if (parentId) {
      updatedBlocks = blocks.map((b) =>
        b.id === parentId
          ? {
              ...b,
              props: {
                ...b.props,
                children: [...(b.props.children || []), newBlock.id],
              },
            }
          : b,
      );
      updatedBlocks = [...updatedBlocks, newBlock];
    } else {
      updatedBlocks = [...blocks, newBlock];
    }
    recordState(updatedBlocks);
    setSelectedBlockId(newBlock.id);
  };

  // UPDATE BLOCK
  const updateBlock = useCallback(
    (updatedBlock) => {
      const updateRecursive = (blocksArray) =>
        blocksArray.map((block) => {
          if (block.id === updatedBlock.id) return updatedBlock;

          if (
            block.type === "container" &&
            Array.isArray(block.props.children)
          ) {
            // Lấy các đối tượng con thực sự để đệ quy
            const childrenActualObjects = block.props.children
              .map((childId) => blocks.find((b) => b.id === childId))
              .filter(Boolean);
            const updatedChildren = updateRecursive(childrenActualObjects);
            return {
              ...block,
              props: {
                ...block.props,
                children: updatedChildren.map((c) => c.id),
              },
            };
          }
          return block;
        });

      const newBlocksState = updateRecursive(blocks);
      recordState(newBlocksState);
    },
    [blocks, recordState],
  );

  // DELETE BLOCK (with all children)
  const handleDeleteBlock = useCallback(
    (idToDelete) => {
      const findAllChildIds = (parentId) => {
        const block = blocks.find((b) => b.id === parentId);
        if (!block?.props?.children) return [parentId];
        return [parentId, ...block.props.children.flatMap(findAllChildIds)];
      };
      const idsToDelete = new Set(findAllChildIds(idToDelete));
      const newBlocks = blocks.filter((b) => !idsToDelete.has(b.id));
      recordState(newBlocks);
      if (selectedBlockId === idToDelete) {
        setSelectedBlockId(null);
      }
    },
    [blocks, recordState, selectedBlockId],
  );

  // DELETE SINGLE COMPONENT (without children)
  const handleDeleteSingleComponent = useCallback(
    (idToDelete) => {
      const blockToDelete = blocks.find((b) => b.id === idToDelete);
      if (!blockToDelete) return;

      // If the component has children, move them to its parent
      if (blockToDelete.props?.children) {
        const parent = blocks.find((b) =>
          b.props?.children?.includes(idToDelete),
        );
        if (parent) {
          // Remove the component from parent's children and add its children
          const newChildren = parent.props.children.reduce((acc, childId) => {
            if (childId === idToDelete) {
              return [...acc, ...blockToDelete.props.children];
            }
            return [...acc, childId];
          }, []);

          const updatedBlocks = blocks.map((b) => {
            if (b.id === parent.id) {
              return {
                ...b,
                props: {
                  ...b.props,
                  children: newChildren,
                },
              };
            }
            return b;
          });

          // Remove the component itself
          const newBlocks = updatedBlocks.filter((b) => b.id !== idToDelete);
          recordState(newBlocks);
        } else {
          // If no parent, just remove the component and its children become root elements
          const newBlocks = blocks.filter((b) => b.id !== idToDelete);
          recordState(newBlocks);
        }
      } else {
        // No children, just remove the component
        const newBlocks = blocks.filter((b) => b.id !== idToDelete);
        recordState(newBlocks);
      }

      if (selectedBlockId === idToDelete) {
        setSelectedBlockId(null);
      }
    },
    [blocks, recordState, selectedBlockId],
  );

  // MOVE ELEMENT
  const handleMoveElement = useCallback(
    (id, direction) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index < 0) return;

      const parent = blocks.find((b) => b.props?.children?.includes(id));
      if (parent) {
        const children = [...parent.props.children];
        const childIndex = children.indexOf(id);
        const newIndex = childIndex + direction;

        if (newIndex < 0 || newIndex >= children.length) return;

        children.splice(childIndex, 1);
        children.splice(newIndex, 0, id);

        const updatedParent = {
          ...parent,
          props: {
            ...parent.props,
            children,
          },
        };

        const newBlocks = blocks.map((b) =>
          b.id === parent.id ? updatedParent : b,
        );
        recordState(newBlocks);
      } else {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= blocks.length) return blocks; // Trả về blocks nếu không hợp lệ

        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(index, 1);
        newBlocks.splice(newIndex, 0, moved);
        recordState(newBlocks);
      }
    },
    [blocks, recordState],
  );

  const toggleExpand = (blockId) => {
    setExpandedBlocks((prev) => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  const renderTree = (block, level = 0) => {
    if (!block) return null;
    const isExpanded = expandedBlocks[block.id] ?? true;
    const children = block.props.children
      ?.map((id) => blocks.find((b) => b.id === id))
      .filter(Boolean);
    const isContainer = block.type === "container";

    return (
      <div key={block.id} className="ml-1">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition ${
            selectedBlockId === block.id
              ? "bg-blue-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBlockId(block.id);
          }}
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
              {isExpanded ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          )}
        </div>
        {isExpanded && children?.map((child) => renderTree(child, level + 1))}
      </div>
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onAddComponent={(type) =>
          addBlock(type, isContainerSelected ? selectedBlockId : null)
        }
        canvasElements={blocks}
        selectedElement={blocks.find((b) => b.id === selectedBlockId)}
        onSelectElement={(el) => setSelectedBlockId(el.id)}
        onMoveElement={handleMoveElement}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;

          // Xử lý drop vào column
          if (over.id.startsWith("column-")) {
            const overData = over.data.current;
            if (overData && overData.type === "column") {
              const { parentId, columnIndex } = overData;
              const activeBlock = blocks.find((b) => b.id === active.id);

              if (activeBlock) {
                // Tìm parent column block
                const parentBlock = blocks.find((b) => b.id === parentId);
                if (parentBlock) {
                  const updatedBlocks = blocks.map((block) => {
                    if (block.id === parentId) {
                      const newChildren = [...(block.children || [])];
                      // Đảm bảo có đủ mảng con cho từng cột
                      while (newChildren.length <= columnIndex) {
                        newChildren.push([]);
                      }
                      // Thêm block vào cột tương ứng
                      if (!Array.isArray(newChildren[columnIndex])) {
                        newChildren[columnIndex] = [];
                      }
                      newChildren[columnIndex] = [
                        ...newChildren[columnIndex],
                        active.id,
                      ];

                      return {
                        ...block,
                        children: newChildren,
                      };
                    }
                    return block;
                  });
                  recordState(updatedBlocks);
                }
              }
              return;
            }
          }

          // Logic cũ cho reorder
          const activeIndex = blocks.findIndex((b) => b.id === active.id);
          const overIndex = blocks.findIndex((b) => b.id === over.id);
          const isChild = (id) =>
            blocks.some((b) => b.props.children?.includes(id));
          if (isChild(active.id) || isChild(over.id)) return;
          const newBlocks = arrayMove(blocks, activeIndex, overIndex);
          recordState(newBlocks);
        }}
      >
        <SortableContext
          items={blocks.filter(
            (b) => !blocks.some((p) => p.props.children?.includes(b.id)),
          )}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="flex-1 overflow-y-auto"
            style={{ height: "90vh" }}
            onClick={(e) => {
              // Click vào background để deselect
              if (e.target === e.currentTarget) {
                setSelectedBlockId(null);
              }
            }}
          >
            {blocks.map((block) => {
              const isChild = blocks.some((b) =>
                b.props.children?.includes(block.id),
              );
              if (isChild) return null;
              return (
                <SortableItem key={block.id} block={block}>
                  <div
                    className={`relative group mb-2 cursor-pointer rounded border p-2 transition ${
                      selectedBlockId === block.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent hover:border-gray-900"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="absolute z-10 top-2 right-2 hidden group-hover:flex items-center justify-center bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      <Trash2 size={"18px"} />
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
            .filter(
              (b) => !blocks.some((p) => p.props.children?.includes(b.id)),
            )
            .map((block) => renderTree(block))}
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded ${canUndo ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            <Undo size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded ${canRedo ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            <Redo size={20} />
          </button>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Properties</h2>
          {selectedBlock ? (
            <PropertyPanel
              block={selectedBlock}
              onChange={updateBlock}
              onDelete={() => handleDeleteSingleComponent(selectedBlock.id)}
            />
          ) : (
            <p className="text-gray-500 text-sm">
              Select an element to edit its properties
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
