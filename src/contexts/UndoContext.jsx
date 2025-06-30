import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const UndoContext = createContext();

export function UndoProvider({ children }) {
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isRestoring, setIsRestoring] = useState(false);

    // currentBlocksRef sẽ chứa trạng thái blocks hiện tại và được sử dụng làm nguồn đáng tin cậy.
    // Initialized as an empty array to avoid null checks.
    const currentBlocksRef = useRef([]);

    // Helper to save to localStorage and dispatch update event
    // Đảm bảo hàm này được useCallback để tránh tạo lại không cần thiết
    const saveAndDispatch = useCallback((state) => {
        try {
            localStorage.setItem("currentBlocks", JSON.stringify(state));
            window.dispatchEvent(new Event("update-blocks")); // Trigger UI update for consumers
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            // Có thể thêm toast.error ở đây nếu muốn thông báo lỗi lưu
        }
    }, []); // Không có dependencies vì nó không phụ thuộc vào props hay state nào thay đổi

    // Helper to compare states deeply
    const isSameState = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    // Effect để tải trạng thái ban đầu từ localStorage khi Provider mount
    useEffect(() => {
        const saved = localStorage.getItem("currentBlocks");
        const initial = saved ? JSON.parse(saved) : [];
        // Cập nhật ref trực tiếp. Không cần gọi recordState ở đây
        // vì recordState sẽ được gọi từ EditablePage khi nó mount.
        currentBlocksRef.current = initial;

        // Dispatch sự kiện để thông báo cho EditablePage cập nhật trạng thái ban đầu
        // sau khi ref được gán. Điều này quan trọng để EditablePage biết trạng thái khởi tạo.
        // Tuy nhiên, việc này cần thận trọng. Nếu EditablePage cũng gọi recordState ngay lập tức,
        // có thể gây vòng lặp. Cách tốt hơn là EditablePage đọc trực tiếp currentBlocks.
        // Tôi đã loại bỏ việc dispatch ở đây vì EditablePage sẽ đọc trực tiếp currentBlocks.
        // window.dispatchEvent(new Event("update-blocks"));
    }, []); // Empty dependency array ensures this runs only once on mount

    const recordState = useCallback(
        (newState) => {
            if (!newState) {
                console.warn("recordState called with null or undefined newState.");
                return;
            }

            // Nếu đang khôi phục từ undo/redo, không ghi trạng thái mới
            // và đặt lại cờ isRestoring.
            if (isRestoring) {
                setIsRestoring(false);
                // Nếu trạng thái mới giống với trạng thái vừa khôi phục, thoát
                if (isSameState(newState, currentBlocksRef.current)) {
                    return;
                }
            }

            // Chỉ ghi trạng thái nếu nó thực sự khác với trạng thái hiện tại
            if (isSameState(newState, currentBlocksRef.current)) {
                return;
            }

            // Đẩy trạng thái HIỆN TẠI (trước khi thay đổi) vào undoStack
            setUndoStack((prev) => {
                const updated = [...prev, currentBlocksRef.current];
                return updated.slice(Math.max(updated.length - 100, 0)); // Giới hạn 100 bước
            });

            // Xóa redoStack khi có thay đổi mới
            setRedoStack([]);

            // Cập nhật trạng thái hiện tại
            currentBlocksRef.current = newState;
            saveAndDispatch(newState); // Lưu vào localStorage và thông báo UI
        },
        [isRestoring, saveAndDispatch]
    );

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;

        setIsRestoring(true); // Đặt cờ đang khôi phục

        const lastState = undoStack[undoStack.length - 1];
        const newUndoStack = undoStack.slice(0, -1);

        setUndoStack(newUndoStack);
        // Đẩy trạng thái HIỆN TẠI vào redoStack trước khi undo
        setRedoStack((prev) => [...prev, currentBlocksRef.current].slice(Math.max(prev.length + 1 - 100, 0)));

        currentBlocksRef.current = lastState; // Cập nhật trạng thái
        saveAndDispatch(lastState); // Lưu và thông báo UI
    }, [undoStack, saveAndDispatch]);

    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;

        setIsRestoring(true); // Đặt cờ đang khôi phục

        const nextState = redoStack[redoStack.length - 1];
        const newRedoStack = redoStack.slice(0, -1);

        setRedoStack(newRedoStack);

        setUndoStack((prev) => [...prev, currentBlocksRef.current].slice(Math.max(prev.length + 1 - 100, 0)));

        currentBlocksRef.current = nextState; // Cập nhật trạng thái
        saveAndDispatch(nextState); // Lưu và thông báo UI
    }, [redoStack, saveAndDispatch]);

    return (
        <UndoContext.Provider
            value={{
                recordState,
                handleUndo,
                handleRedo,
                canUndo: undoStack.length > 0,
                canRedo: redoStack.length > 0,
                currentBlocks: currentBlocksRef.current,
            }}
        >
            {children}
        </UndoContext.Provider>
    );
}

export const useUndo = () => useContext(UndoContext);
