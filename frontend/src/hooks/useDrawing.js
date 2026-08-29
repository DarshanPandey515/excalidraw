import { useRef } from 'react';
import { SHAPES, FONT_SIZE } from '../constants';
import { dist, roughen, normalizeBox, eraserHitTest } from '../utils/geometry';

export const useDrawing = ({
  tool,
  color,
  strokeWidth,
  elements,
  liveShape,
  zoom,
  pos,
  eraserRadius,
  editingRef,
  startEditing,
  commit,
  setTool,
  setPointer,
  setLivePenPoints,
  setLiveShape,
}) => {
  const drawing = useRef(false);
  const currentPoints = useRef([]);
  const eraserPoints = useRef([]);
  const shapeStart = useRef(null);
  const isShape = SHAPES.includes(tool);

  const getWorldPos = (e) => {
    const p = e.target.getStage().getPointerPosition();
    return { x: (p.x - pos.x) / zoom, y: (p.y - pos.y) / zoom };
  };

  const handlePointerDown = (e) => {
    const world = getWorldPos(e);
    setPointer(world);
    drawing.current = true;
    if (tool === 'eraser') {
      eraserPoints.current = [world];
    } else if (tool === 'pen') {
      currentPoints.current = [world];
      setLivePenPoints([world.x, world.y]);
    } else if (isShape) {
      shapeStart.current = world;
      setLiveShape({ type: tool, x1: world.x, y1: world.y, x2: world.x, y2: world.y });
    } else if (tool === 'text') {
      if (editingRef.current) {
        drawing.current = false;
        return;
      }
      e.evt.preventDefault();
      const el = {
        id: crypto.randomUUID(),
        type: 'text',
        x: world.x,
        y: world.y,
        text: '',
        color,
        fontSize: FONT_SIZE,
      };
      commit([...elements, el]);
      startEditing(el.id, el.x, el.y, '', color, el.fontSize, true);
      drawing.current = false;
    }
  };

  const handlePointerMove = (e) => {
    const world = getWorldPos(e);
    setPointer(world);
    if (!drawing.current) return;
    if (tool === 'eraser') {
      const last = eraserPoints.current[eraserPoints.current.length - 1];
      if (!last || dist(world.x, world.y, last.x, last.y) > 2) {
        eraserPoints.current = [...eraserPoints.current, world];
      }
      return;
    }
    if (tool === 'pen') {
      const last = currentPoints.current[currentPoints.current.length - 1];
      if (!last || dist(world.x, world.y, last.x, last.y) > 1.5) {
        currentPoints.current = [...currentPoints.current, world];
        setLivePenPoints(currentPoints.current.flatMap((p) => [p.x, p.y]));
      }
      return;
    }
    if (isShape && shapeStart.current) {
      setLiveShape({
        type: tool,
        x1: shapeStart.current.x,
        y1: shapeStart.current.y,
        x2: world.x,
        y2: world.y,
      });
    }
  };

  const handlePointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (tool === 'eraser') {
      const hit = eraserHitTest(elements, eraserPoints.current, eraserRadius);
      eraserPoints.current = [];
      if (hit.size) commit(elements.filter((el) => !hit.has(el.id)));
      return;
    }
    if (tool === 'pen') {
      if (currentPoints.current.length >= 2) {
        const stroke = {
          id: crypto.randomUUID(),
          type: 'pen',
          color,
          strokeWidth,
          points: roughen(currentPoints.current.flatMap((p) => [p.x, p.y])),
        };
        commit([...elements, stroke]);
      }
      currentPoints.current = [];
      setLivePenPoints(null);
      return;
    }
    if (isShape && shapeStart.current) {
      const { x1, y1, x2, y2 } = liveShape;
      if (Math.abs(x2 - x1) > 3 || Math.abs(y2 - y1) > 3) {
        const el =
          tool === 'line' || tool === 'arrow'
            ? { id: crypto.randomUUID(), type: tool, points: [x1, y1, x2, y2], color, strokeWidth }
            : { id: crypto.randomUUID(), type: tool, ...normalizeBox(x1, y1, x2, y2), color, strokeWidth };
        commit([...elements, el]);
      }
      shapeStart.current = null;
      setLiveShape(null);
    }
  };

  const handleDblClick = (e) => {
    const stage = e.target.getStage();
    const p = stage.getPointerPosition();
    const node = stage.getIntersection(p);
    if (node && node.getType() === 'Text' && node.id()) {
      const el = elements.find((item) => item.id === node.id());
      if (el && el.type === 'text') {
        setTool('text');
        startEditing(el.id, el.x, el.y, el.text, el.color, el.fontSize, false);
      }
    }
  };

  return { handlePointerDown, handlePointerMove, handlePointerUp, handleDblClick };
};