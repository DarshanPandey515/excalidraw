# Excalidraw Clone

A frontend-only, Excalidraw-style drawing app built with **React**, **Konva**, and **Vite**. Everything you draw is stored directly in `localStorage` — there is **no backend**.

## Features

- **Tools** — pen, eraser, rectangle, ellipse, diamond, line, arrow, and text
- **Text editing** — click to add, double-click to edit; Enter/blur commits, Escape cancels
- **Eraser** — drag over any element to remove it (whole-stroke erasing)
- **Zoom & pan** — scroll to zoom around the cursor, toolbar controls, keyboard shortcuts
- **Styling** — 8-color palette and adjustable stroke width / eraser size
- **Undo / redo** — full history stack (Ctrl+Z / Ctrl+Shift+Z)
- **Persistence** — every element's coordinates are saved to `localStorage` automatically
- **Export** — download the canvas as a PNG
- **Touch support** — draw on touch devices
- **Hand-drawn feel** — light roughness applied to pen strokes

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

Other scripts:

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build to `dist/` |
| `npm run lint`  | Run oxlint               |
| `npm run preview` | Preview the production build |

## Keyboard shortcuts

| Key                        | Action                    |
| -------------------------- | ------------------------- |
| `1` / `2`                  | Pen / Eraser              |
| `r` / `o` / `d`            | Rectangle / Ellipse / Diamond |
| `l` / `a` / `t`            | Line / Arrow / Text       |
| `+` / `-`                  | Zoom in / out             |
| `Ctrl` + `0`               | Reset zoom                |
| `Ctrl` + `Z`               | Undo                      |
| `Ctrl` + `Shift` + `Z` / `Ctrl` + `Y` | Redo           |

## Storage

Drawings are persisted to `localStorage` under the key `excalidraw-clone.elements.v3`. Older stroke-only data (`excalidraw-clone.strokes.v1`) is migrated automatically on first load. Clearing your browser data will erase your drawings.

## Project structure

```
src/
├── App.jsx                  # Top-level state, history, zoom, keyboard shortcuts
├── constants.js             # Colors, tools, storage keys, zoom limits
├── hooks/
│   ├── useDrawing.js        # Pointer handling for pen/eraser/shapes/text
│   └── useTextEditing.js    # Text editor state and commit/cancel logic
├── utils/
│   ├── geometry.js          # Distance, hit-testing, and shape math
│   └── storage.js           # localStorage load/save with migration
└── components/
    ├── Toolbar.jsx          # Tool, color, width, undo/redo, zoom controls
    ├── Canvas.jsx           # Konva Stage + element layer + text editor
    ├── ElementLayer.jsx     # Renders elements and live drawing previews
    ├── TextEditor.jsx       # Inline HTML textarea overlay
    └── Icons.jsx            # SVG icons and toolbar button
```

## Tech stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [Konva](https://konvajs.org) / [react-konva](https://konvajs.org/docs/react) for canvas rendering
- [Tailwind CSS](https://tailwindcss.com) for styling