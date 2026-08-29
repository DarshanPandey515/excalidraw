export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 4;
export const FONT_SIZE = 20;
export const FONT_FAMILY = 'system-ui, -apple-system, sans-serif';

export const COLORS = [
  '#000000',
  '#1e1e1e',
  '#e03131',
  '#f08c00',
  '#2f9e44',
  '#1971c2',
  '#4263eb',
  '#9c36b5',
];

export const SHAPES = ['rect', 'ellipse', 'diamond', 'line', 'arrow'];
export const ALL_TOOLS = ['pen', 'eraser', ...SHAPES, 'text'];

export const TOOL_LABEL = {
  pen: 'Pen',
  eraser: 'Eraser',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  diamond: 'Diamond',
  line: 'Line',
  arrow: 'Arrow',
  text: 'Text',
};

export const TOOL_HINT = {
  pen: 'Pen — drag to draw',
  eraser: 'Eraser — drag over elements to remove them',
  rect: 'Rectangle — drag to draw',
  ellipse: 'Ellipse — drag to draw',
  diamond: 'Diamond — drag to draw',
  line: 'Line — drag to draw',
  arrow: 'Arrow — drag to draw',
  text: 'Text — click to add, double-click to edit',
};

export const TOOL_KEY = {
  pen: '1',
  eraser: '2',
  rect: 'r',
  ellipse: 'o',
  diamond: 'd',
  line: 'l',
  arrow: 'a',
  text: 't',
};