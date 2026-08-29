import { useEffect, useRef, useState } from 'react';
import { Toolbar } from '../components/Toolbar';
import { Canvas } from '../components/Canvas';
import { useDrawing } from '../hooks/useDrawing';
import { useTextEditing } from '../hooks/useTextEditing';
import { loadLocalCache, saveLocalCache } from '../utils/storage';
import { apiGetBoardElements, apiSaveBoardElements } from '../api/boards';
import { COLORS, MAX_ZOOM, MIN_ZOOM, TOOL_HINT, TOOL_KEY } from '../constants';

const BoardPage = ({ board, onBack }) => {
  const [elements, setElements] = useState(() => loadLocalCache(board.id) || []);
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
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState('Loading…');

  const stageRef = useRef(null);
  const saveTimer = useRef(null);
  const elementsRef = useRef(elements);

  const { editing, editingRef, startEditing, setText, commitText, cancelText } =
    useTextEditing(setElements);

  const eraserRadius = strokeWidth * 4 + 10;

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await apiGetBoardElements(board.id);
        if (cancelled) return;
        setElements(data.elements || []);
        setPast([]);
        setFuture([]);
        setLoaded(true);
        setSaveState('Synced');
      } catch {
        if (cancelled) return;
        setLoaded(true);
        setSaveState('Offline — local only');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [board.id]);

  useEffect(() => {
    if (!loaded) return;
    saveLocalCache(board.id, elements);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveState('Saving…');
      try {
        const res = await apiSaveBoardElements(board.id, elements);
        setSaveState(res.count ? `${res.count} elements saved` : 'Saved');
      } catch {
        setSaveState('Save failed');
      }
    }, 700);
    return () => clearTimeout(saveTimer.current);
  }, [elements, loaded, board.id]);

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
    a.download = `${board.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  };

  const handleBack = () => {
    clearTimeout(saveTimer.current);
    apiSaveBoardElements(board.id, elementsRef.current).catch(() => {});
    onBack();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8f7f4] font-sans select-none">
      <div className="pointer-events-none fixed inset-x-0 top-4 z-30 flex items-center justify-center px-40">
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
      </div>

      <div className="pointer-events-auto fixed left-4 top-4 z-30 flex items-center gap-2 rounded-xl border border-neutral-900/10 bg-white/90 px-3 py-2 shadow-lg shadow-neutral-900/10 backdrop-blur">
        <button
          type="button"
          title="Back to boards"
          onClick={handleBack}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-200/70"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>
        <div className="border-l border-neutral-900/10 pl-2">
          <p className="max-w-40 truncate text-sm font-semibold text-neutral-800">{board.name}</p>
          <p className={`text-[10px] ${saveState === 'Save failed' ? 'text-red-500' : saveState.startsWith('Offline') ? 'text-amber-500' : 'text-neutral-400'}`}>
            {saveState}
          </p>
        </div>
      </div>

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
          Scroll to zoom
        </span>
      </div>
    </div>
  );
};

export default BoardPage;