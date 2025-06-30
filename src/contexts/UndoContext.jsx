import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const UndoContext = createContext();

export function UndoProvider({ children }) {
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const currentBlocksRef = useRef([]);

    const saveAndDispatch = useCallback((state) => {
        try {
            localStorage.setItem("currentBlocks", JSON.stringify(state));
            window.dispatchEvent(new Event("update-blocks"));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, []);

    const isSameState = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    useEffect(() => {
        const saved = localStorage.getItem("currentBlocks");
        const initial = saved ? JSON.parse(saved) : [];
        currentBlocksRef.current = initial;
    }, []);

    const applyState = useCallback(
        (newState, isFromUndoRedo = false) => {
            if (!isSameState(newState, currentBlocksRef.current)) {
                if (!isFromUndoRedo) {
                    setUndoStack((prev) => [...prev, currentBlocksRef.current].slice(-100));
                    setRedoStack([]);
                }
                currentBlocksRef.current = newState;
                saveAndDispatch(newState);
            }
        },
        [saveAndDispatch]
    );

    const recordState = useCallback(
        (newState) => {
            if (!newState || isSameState(newState, currentBlocksRef.current)) return;
            applyState(newState);
        },
        [applyState]
    );

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;
        const lastState = undoStack[undoStack.length - 1];
        const newUndoStack = undoStack.slice(0, -1);
        setUndoStack(newUndoStack);
        setRedoStack((prev) => [...prev, currentBlocksRef.current].slice(-100));
        applyState(lastState, true);
    }, [undoStack, applyState]);

    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];
        const newRedoStack = redoStack.slice(0, -1);
        setRedoStack(newRedoStack);
        setUndoStack((prev) => [...prev, currentBlocksRef.current].slice(-100));
        applyState(nextState, true);
    }, [redoStack, applyState]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleUndo, handleRedo]);

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
