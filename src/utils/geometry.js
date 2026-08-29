export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

export const pointToSegmentDist = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, x1, y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return dist(px, py, x1 + t * dx, y1 + t * dy);
};

export const distToRect = (px, py, rx, ry, rw, rh) => {
  const cx = Math.max(rx, Math.min(px, rx + rw));
  const cy = Math.max(ry, Math.min(py, ry + rh));
  return dist(px, py, cx, cy);
};

export const normalizeBox = (x1, y1, x2, y2) => ({
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  width: Math.abs(x2 - x1),
  height: Math.abs(y2 - y1),
});

export const textSize = (text, fontSize) => {
  const lines = text.split('\n');
  const width = Math.max(...lines.map((l) => l.length), 1) * fontSize * 0.6;
  const height = lines.length * fontSize * 1.2;
  return { width, height };
};

export const roughen = (points, strength = 0.9) => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed % 1000) / 1000;
  };
  const flat = [];
  for (let i = 0; i < points.length; i += 2) {
    flat.push(points[i] + (rand() - 0.5) * strength * 2, points[i + 1] + (rand() - 0.5) * strength * 2);
  }
  return flat;
};

export const diamondPoints = (x, y, width, height) => [
  x + width / 2, y,
  x + width, y + height / 2,
  x + width / 2, y + height,
  x, y + height / 2,
];

export const eraserHitTest = (elements, points, radius) => {
  const hit = new Set();
  if (!points.length) return hit;
  for (const el of elements) {
    if (el.type === 'pen') {
      for (let i = 0; i < el.points.length - 1; i += 2) {
        for (let j = 0; j < points.length; j++) {
          if (
            pointToSegmentDist(
              el.points[i], el.points[i + 1],
              points[j].x, points[j].y,
              points[j + 1] ? points[j + 1].x : points[j].x,
              points[j + 1] ? points[j + 1].y : points[j].y,
            ) <= radius
          ) {
            hit.add(el.id);
            break;
          }
        }
        if (hit.has(el.id)) break;
      }
    } else if (el.type === 'rect' || el.type === 'ellipse' || el.type === 'diamond') {
      for (const p of points) {
        if (distToRect(p.x, p.y, el.x, el.y, el.width, el.height) <= radius) {
          hit.add(el.id);
          break;
        }
      }
    } else if (el.type === 'line' || el.type === 'arrow') {
      for (const p of points) {
        if (
          pointToSegmentDist(p.x, p.y, el.points[0], el.points[1], el.points[2], el.points[3]) <=
          radius
        ) {
          hit.add(el.id);
          break;
        }
      }
    } else if (el.type === 'text') {
      const { width, height } = textSize(el.text, el.fontSize);
      for (const p of points) {
        if (distToRect(p.x, p.y, el.x, el.y, width, height) <= radius) {
          hit.add(el.id);
          break;
        }
      }
    }
  }
  return hit;
};