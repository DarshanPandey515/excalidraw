# Excalidraw Clone

An Excalidraw-style drawing app built with **React**, **Konva**, and **Vite** on the frontend and **Django REST Framework** on the backend. Users sign up / log in with JWT, create boards, and their drawings (every element's coordinates) are saved to the server — with a `localStorage` cache for offline resilience.

## Features

- **Tools** — pen, eraser, rectangle, ellipse, diamond, line, arrow, and text
- **Text editing** — click to add, double-click to edit; Enter/blur commits, Escape cancels
- **Eraser** — drag over any element to remove it (whole-stroke erasing)
- **Zoom & pan** — scroll to zoom around the cursor, toolbar controls, keyboard shortcuts
- **Styling** — 8-color palette and adjustable stroke width / eraser size
- **Undo / redo** — full history stack (Ctrl+Z / Ctrl+Shift+Z)
- **Accounts** — sign up and log in with email + password (JWT auth)
- **Boards** — create, list, and delete boards
- **Persistence** — drawings saved to the backend (debounced) and cached in `localStorage`
- **Export** — download the canvas as a PNG
- **Touch support** — draw on touch devices
- **Hand-drawn feel** — light roughness applied to pen strokes

## Getting started

Run two servers — the Django API and the Vite dev server.

### 1. Backend (Django)

```bash
cd ../backend        # or wherever the backend folder lives
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The API is served at `http://127.0.0.1:8000/api/`.

### 2. Frontend (Vite)

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

The frontend calls the API at `http://127.0.0.1:8000/api` by default. To point it elsewhere, set `VITE_API_URL` in a `.env` file:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
```

### API endpoints

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| POST   | `/api/auth/signup/`            | Create an account                  |
| POST   | `/api/auth/login/`             | Log in, returns JWT access/refresh |
| GET    | `/api/boards/`                 | List the user's boards             |
| POST   | `/api/boards/`                 | Create a board                     |
| GET    | `/api/boards/<id>/`            | Board details + its elements       |
| DELETE | `/api/boards/<id>/`            | Delete a board                     |
| GET    | `/api/boards/<id>/elements/`   | Get a board's elements             |
| PUT    | `/api/boards/<id>/elements/`   | Replace a board's elements         |

## Deploying to Vercel

`vercel.json` is already configured (Vite build, output `dist`, SPA rewrite).

1. Deploy the backend first and note its URL.
2. Add an environment variable to the frontend project:

   ```
   VITE_API_URL=https://<your-backend>.vercel.app/api
   ```

   It is read at build time, so set it before deploying. See `.env.example`.
3. Deploy:

   ```bash
   vercel
   # or import the GitHub repository in Vercel (it auto-detects Vite)
   ```

## Frontend scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build to `dist/`     |
| `npm run lint`  | Run oxlint                      |
| `npm run preview` | Preview the production build  |

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

While a board is open, every change is saved to the backend (debounced by ~700 ms) and mirrored to `localStorage` under `excalidraw-clone.board.<boardId>` as an offline cache. Boards load from the server; if the server is unreachable, the local cache is used.

## Frontend project structure

```
src/
├── App.jsx                  # Routing: auth → boards → board
├── constants.js             # Colors, tools, zoom limits
├── api/
│   ├── client.js            # Fetch wrapper with JWT header + error handling
│   ├── auth.js              # Login / signup calls
│   └── boards.js            # Board + elements calls
├── context/
│   ├── AuthProvider.jsx     # Auth state (login/signup/logout, JWT storage)
│   ├── authContext.js       # React context
│   └── useAuth.js           # useAuth hook
├── pages/
│   ├── AuthPage.jsx         # Login / signup form
│   ├── BoardsPage.jsx       # Board list, create, delete
│   └── BoardPage.jsx        # The drawing canvas wired to the backend
├── hooks/
│   ├── useDrawing.js        # Pointer handling for pen/eraser/shapes/text
│   └── useTextEditing.js    # Text editor state and commit/cancel logic
├── utils/
│   ├── geometry.js          # Distance, hit-testing, and shape math
│   └── storage.js           # localStorage board cache
└── components/
    ├── Toolbar.jsx          # Tool, color, width, undo/redo, zoom controls
    ├── Canvas.jsx           # Konva Stage + element layer + text editor
    ├── ElementLayer.jsx     # Renders elements and live drawing previews
    ├── TextEditor.jsx       # Inline HTML textarea overlay
    ├── Icons.jsx            # SVG icons
    └── ToolButton.jsx       # Toolbar button
```

## Tech stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [Konva](https://konvajs.org) / [react-konva](https://konvajs.org/docs/react) for canvas rendering
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Django](https://www.djangoproject.com) + [DRF](https://www.django-rest-framework.org) + SimpleJWT for the API