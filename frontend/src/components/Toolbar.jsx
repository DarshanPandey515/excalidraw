import { ALL_TOOLS, COLORS, TOOL_LABEL, TOOL_KEY } from '../constants';
import { Icon, ToolIcon } from './Icons';
import { ToolButton } from './ToolButton';

const Divider = () => <div className="mx-1 h-6 w-px bg-neutral-900/10" />;

export const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  zoom,
  undo,
  redo,
  clearAll,
  downloadPng,
  zoomAt,
  resetZoom,
}) => (
  <div className="pointer-events-none fixed inset-x-0 top-4 z-20 flex justify-center">
    <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-neutral-900/10 bg-white/90 p-1.5 shadow-lg shadow-neutral-900/10 backdrop-blur">
      <ToolButton active={tool === 'pen'} title={`Pen (${TOOL_KEY.pen})`} onClick={() => setTool('pen')}>
        {Icon.Pen}
      </ToolButton>
      <ToolButton active={tool === 'eraser'} title={`Eraser (${TOOL_KEY.eraser})`} onClick={() => setTool('eraser')}>
        {Icon.Eraser}
      </ToolButton>

      <Divider />

      {ALL_TOOLS.filter((t) => t !== 'pen' && t !== 'eraser').map((t) => (
        <ToolButton
          key={t}
          active={tool === t}
          title={`${TOOL_LABEL[t]} (${TOOL_KEY[t]})`}
          onClick={() => setTool(t)}
        >
          {ToolIcon[t]}
        </ToolButton>
      ))}

      <Divider />

      <div className="flex items-center gap-1 px-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            onClick={() => setColor(c)}
            className={`h-6 w-6 rounded-full border-2 transition-transform ${
              color === c ? 'scale-110 border-[#6965db]' : 'border-white hover:scale-105'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <Divider />

      <div className="flex flex-col items-center gap-0.5 px-1">
        <input
          type="range"
          min="1"
          max="12"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-24 accent-[#6965db]"
          title={tool === 'eraser' ? 'Eraser size' : 'Stroke width'}
        />
        <span className="text-[10px] font-medium text-neutral-400">
          {tool === 'eraser' ? 'Size' : 'Width'}
        </span>
      </div>

      <Divider />

      <ToolButton title="Undo (Ctrl+Z)" onClick={undo}>
        {Icon.Undo}
      </ToolButton>
      <ToolButton title="Redo (Ctrl+Shift+Z)" onClick={redo}>
        {Icon.Redo}
      </ToolButton>
      <ToolButton title="Clear all" onClick={clearAll}>
        {Icon.Trash}
      </ToolButton>
      <ToolButton title="Export PNG" onClick={downloadPng}>
        {Icon.Download}
      </ToolButton>

      <Divider />

      <ToolButton title="Zoom out (-)" onClick={() => zoomAt(1 / 1.1)}>
        {Icon.ZoomOut}
      </ToolButton>
      <button
        type="button"
        title="Reset zoom (Ctrl+0)"
        onClick={resetZoom}
        className="flex h-9 min-w-12 items-center justify-center rounded-lg px-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-200/70"
      >
        {Math.round(zoom * 100)}%
      </button>
      <ToolButton title="Zoom in (+)" onClick={() => zoomAt(1.1)}>
        {Icon.ZoomIn}
      </ToolButton>
    </div>
  </div>
);