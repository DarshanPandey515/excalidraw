import { Line, Circle, Rect, Ellipse, Arrow, Text } from 'react-konva';
import { FONT_FAMILY } from '../constants';
import { normalizeBox, diamondPoints } from '../utils/geometry';

const renderElement = (el, editing) => {
  const common = {
    stroke: el.color,
    strokeWidth: el.strokeWidth,
    lineCap: 'round',
    lineJoin: 'round',
    listening: false,
  };
  switch (el.type) {
    case 'pen':
      return <Line key={el.id} id={el.id} points={el.points} tension={0.5} {...common} />;
    case 'rect':
      return <Rect key={el.id} id={el.id} x={el.x} y={el.y} width={el.width} height={el.height} {...common} />;
    case 'ellipse':
      return (
        <Ellipse
          key={el.id}
          id={el.id}
          x={el.x + el.width / 2}
          y={el.y + el.height / 2}
          radiusX={el.width / 2}
          radiusY={el.height / 2}
          {...common}
        />
      );
    case 'diamond':
      return (
        <Line
          key={el.id}
          id={el.id}
          points={diamondPoints(el.x, el.y, el.width, el.height)}
          closed
          {...common}
        />
      );
    case 'line':
      return <Line key={el.id} id={el.id} points={el.points} {...common} />;
    case 'arrow':
      return (
        <Arrow
          key={el.id}
          id={el.id}
          points={el.points}
          pointerLength={el.strokeWidth * 3}
          pointerWidth={el.strokeWidth * 3}
          fill={el.color}
          {...common}
        />
      );
    case 'text':
      return (
        <Text
          key={el.id}
          id={el.id}
          x={el.x}
          y={el.y}
          text={editing?.id === el.id ? editing.text : el.text}
          fontSize={el.fontSize}
          fontFamily={FONT_FAMILY}
          fill={el.color}
          listening
        />
      );
    default:
      return null;
  }
};

export const ElementLayer = ({
  elements,
  livePenPoints,
  liveShape,
  color,
  strokeWidth,
  pointer,
  eraserRadius,
  tool,
  editing,
}) => {
  const liveEl = liveShape
    ? {
        id: 'live',
        type: liveShape.type,
        color,
        strokeWidth,
        ...(liveShape.type === 'line' || liveShape.type === 'arrow'
          ? { points: [liveShape.x1, liveShape.y1, liveShape.x2, liveShape.y2] }
          : normalizeBox(liveShape.x1, liveShape.y1, liveShape.x2, liveShape.y2)),
      }
    : null;

  return (
    <>
      {elements.map((el) => renderElement(el, editing))}
      {livePenPoints && (
        <Line
          points={livePenPoints}
          stroke={color}
          strokeWidth={strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
      )}
      {liveEl && renderElement(liveEl, editing)}
      {tool === 'eraser' && pointer && (
        <Circle
          x={pointer.x}
          y={pointer.y}
          radius={eraserRadius}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={1}
          dash={[4, 4]}
          listening={false}
        />
      )}
    </>
  );
};