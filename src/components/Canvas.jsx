import { Stage, Layer } from 'react-konva';
import { ElementLayer } from './ElementLayer';
import { TextEditor } from './TextEditor';

export const Canvas = ({
  stageRef,
  size,
  zoom,
  pos,
  elements,
  livePenPoints,
  liveShape,
  color,
  strokeWidth,
  pointer,
  eraserRadius,
  tool,
  editing,
  setText,
  commitText,
  cancelText,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  onDblClick,
}) => (
  <>
    <Stage
      ref={stageRef}
      width={size.width}
      height={size.height}
      scaleX={zoom}
      scaleY={zoom}
      x={pos.x}
      y={pos.y}
      style={{ cursor: 'crosshair' }}
      onMouseDown={onPointerDown}
      onMousemove={onPointerMove}
      onMouseup={onPointerUp}
      onMouseleave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
      onWheel={onWheel}
      onDblClick={onDblClick}
    >
      <Layer>
        <ElementLayer
          elements={elements}
          livePenPoints={livePenPoints}
          liveShape={liveShape}
          color={color}
          strokeWidth={strokeWidth}
          pointer={pointer}
          eraserRadius={eraserRadius}
          tool={tool}
          editing={editing}
        />
      </Layer>
    </Stage>
    <TextEditor editing={editing} zoom={zoom} pos={pos} setText={setText} commitText={commitText} cancelText={cancelText} />
  </>
);