// hooks/useUndoRedo.js
import { useState } from "react";

export function useUndoRedo(initialState) {
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const setState = (newState) => {
        const updated = [...history.slice(0, currentIndex + 1), newState];
        setHistory(updated);
        setCurrentIndex(updated.length - 1);
    };

    const undo = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const redo = () => {
        if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
    };

    return {
        state: history[currentIndex],
        setState,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
    };
}
