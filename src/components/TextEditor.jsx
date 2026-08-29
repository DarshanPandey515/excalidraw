import { useEffect, useRef } from 'react';
import { FONT_FAMILY } from '../constants';

export const TextEditor = ({ editing, zoom, pos, setText, commitText, cancelText }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (editing) {
      const id = requestAnimationFrame(() => ref.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [editing]);

  if (!editing) return null;

  return (
    <textarea
      ref={ref}
      wrap="off"
      value={editing.text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          commitText();
        } else if (e.key === 'Escape') {
          cancelText();
        }
      }}
      onBlur={commitText}
      style={{
        left: editing.x * zoom + pos.x,
        top: editing.y * zoom + pos.y,
        fontSize: editing.fontSize * zoom,
        lineHeight: `${editing.fontSize * zoom * 1.2}px`,
        width: Math.max(80, (editing.text.length + 1) * editing.fontSize * zoom * 0.62),
        color: editing.color,
        fontFamily: FONT_FAMILY,
        resize: 'none',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        padding: 0,
      }}
      className="absolute z-10 text-left"
      rows={Math.max(1, editing.text.split('\n').length)}
    />
  );
};