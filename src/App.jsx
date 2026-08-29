import { useEffect, useRef, useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { useDrawing } from './hooks/useDrawing';
import { useTextEditing } from './hooks/useTextEditing';
import { loadElements, saveElements } from './utils/storage';
import { COLORS, MAX_ZOOM, MIN_ZOOM, TOOL_HINT, TOOL_KEY } from './constants';

const App = () => {
  const [elements, setElements] = useState(loadElements);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [livePenPoints, setLivePenPoints] = useState(null);
  const [liveShape, setLiveShape] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const stageRef = useRef(null);

  const { editing, editingRef, startEditing, setText, commitText, cancelText } =
    useTextEditing(setElements);

  const eraserRadius = strokeWidth * 4 + 10;

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    saveElements(elements);
  }, [elements]);

  const commit = (next) => {
    setPast((p) => [...p, elements]);
    setFuture([]);
    setElements(next);
  };

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setFuture((f) => [elements, ...f]);
    setPast((p) => p.slice(0, -1));
    setElements(prev);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setPast((p) => [...p, elements]);
    setFuture((f) => f.slice(1));
    setElements(next);
  };

  const zoomAt = (factor) => {
    const center = { x: size.width / 2, y: size.height / 2 };
    const world = { x: (center.x - pos.x) / zoom, y: (center.y - pos.y) / zoom };
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor));
    setZoom(nextZoom);
    setPos({ x: center.x - world.x * nextZoom, y: center.y - world.y * nextZoom });
  };

  const resetZoom = () => {
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const p = stage.getPointerPosition();
    const world = { x: (p.x - pos.x) / zoom, y: (p.y - pos.y) / zoom };
    const factor = e.evt.deltaY > 0 ? 1 / 1.1 : 1.1;
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor));
    setZoom(nextZoom);
    setPos({ x: p.x - world.x * nextZoom, y: p.y - world.y * nextZoom });
  };

  const { handlePointerDown, handlePointerMove, handlePointerUp, handleDblClick } = useDrawing({
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
  });

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      for (const [name, key] of Object.entries(TOOL_KEY)) {
        if (e.key === key) setTool(name);
      }
      if (e.key === '+' || e.key === '=') zoomAt(1.1);
      if (e.key === '-') zoomAt(1 / 1.1);
      if ((e.ctrlKey || e.metaKey) && e.key === '0') resetZoom();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const clearAll = () => {
    if (!elements.length) return;
    if (window.confirm('Clear the whole canvas?')) commit([]);
  };

  const downloadPng = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const a = document.createElement('a');
    a.href = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
    a.download = 'drawing.png';
    a.click();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8f7f4] font-sans select-none">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        zoom={zoom}
        undo={undo}
        redo={redo}
        clearAll={clearAll}
        downloadPng={downloadPng}
        zoomAt={zoomAt}
        resetZoom={resetZoom}
      />

      <div className="canvas-grid relative h-full w-full">
        <Canvas
          stageRef={stageRef}
          size={size}
          zoom={zoom}
          pos={pos}
          elements={elements}
          livePenPoints={livePenPoints}
          liveShape={liveShape}
          color={color}
          strokeWidth={strokeWidth}
          pointer={pointer}
          eraserRadius={eraserRadius}
          tool={tool}
          editing={editing}
          setText={setText}
          commitText={commitText}
          cancelText={cancelText}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onDblClick={handleDblClick}
        />
      </div>

      <div className="pointer-events-none fixed bottom-3 left-4 z-20 flex items-center gap-2 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5 rounded-full border border-neutral-900/10 bg-white/80 px-2.5 py-1 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {TOOL_HINT[tool]}
        </span>
        <span className="rounded-full border border-neutral-900/10 bg-white/80 px-2.5 py-1 backdrop-blur">
          Scroll to zoom · Saved to localStorage
        </span>
      </div>
    </div>
  );
};

export default App;