import { useRef, useState } from 'react';

export const useTextEditing = (setElements) => {
  const [editing, setEditing] = useState(null);
  const editingRef = useRef(null);

  const setEditingState = (value) => {
    editingRef.current = value;
    setEditing(value);
  };

  const startEditing = (id, x, y, text, color, fontSize, isNew) => {
    setEditingState({ id, x, y, text, color, fontSize, isNew });
  };

  const setText = (value) => {
    if (!editingRef.current) return;
    setEditingState({ ...editingRef.current, text: value });
  };

  const commitText = () => {
    const t = editingRef.current;
    if (!t) return;
    editingRef.current = null;
    setEditing(null);
    if (t.text.trim()) {
      setElements((prev) =>
        prev.map((el) => (el.id === t.id ? { ...el, text: t.text } : el)),
      );
    } else {
      setElements((prev) => prev.filter((el) => el.id !== t.id));
    }
  };

  const cancelText = () => {
    const t = editingRef.current;
    if (!t) return;
    editingRef.current = null;
    setEditing(null);
    if (t.isNew) setElements((prev) => prev.filter((el) => el.id !== t.id));
  };

  return { editing, editingRef, startEditing, setText, commitText, cancelText };
};