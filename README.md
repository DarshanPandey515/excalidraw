# Excalidraw Clone

An Excalidraw-style whiteboard application with a **React + Konva** frontend and a **Django REST Framework** backend. Draw with pen, shapes, and text; organize drawings into boards; and save everything to a database — all from a clean, minimal UI.

![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/Konva-canvas-orange) ![Stack](https://img.shields.io/badge/Django-6-green) ![Stack](https://img.shields.io/badge/Vercel-ready-black)

## Repository layout

```
excalidraw/
├── backend/    # Django REST API — JWT auth, boards, element persistence
└── frontend/   # Vite + React + Konva drawing app
```

Each folder is its own deployable Vercel project. See `backend/README.md` and `frontend/README.md` for their individual setup and deploy instructions.

## Features

**Drawing**
- Pen, eraser, rectangle, ellipse, diamond, line, arrow, and text tools
- Text editor: click to add, double-click to edit
- Whole-stroke eraser that removes any element it touches
- Zoom & pan (scroll, toolbar controls, and shortcuts)
- Hand-drawn feel via light roughness on pen strokes

**Accounts & boards**
- Email + password signup / login with JWT tokens
- Create, list, and delete boards
- Drawings saved per board and reloaded when you reopen

**Persistence**
- Elements saved to the backend (debounced ~700 ms)
- Mirrored to `localStorage` as an offline cache per board

**Extras**
- 8-color palette, adjustable stroke width / eraser size
- Undo / redo history (Ctrl+Z / Ctrl+Shift+Z)
- Export the canvas as PNG
- Touch support

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Create a `backend/.env` file:

```bash
DJANGO_SECRET_KEY=your-secret-key
# Optional: DATABASE_URL=postgres://user:pass@host/dbname
```

API base: `http://127.0.0.1:8000/api/`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend calls the API at `http://127.0.0.1:8000/api` by default; override with `VITE_API_URL` (see `frontend/.env.example`).

## API overview

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| POST   | `/api/auth/signup/`          | Create an account            |
| POST   | `/api/auth/login/`           | Log in, returns JWT tokens   |
| GET    | `/api/boards/`               | List the user's boards       |
| POST   | `/api/boards/`               | Create a board               |
| GET    | `/api/boards/<id>/`          | Board details + its elements |
| DELETE | `/api/boards/<id>/`          | Delete a board               |
| GET    | `/api/boards/<id>/elements/` | Get a board's elements       |
| PUT    | `/api/boards/<id>/elements/` | Replace a board's elements   |

## Keyboard shortcuts

| Key                        | Action                         |
| -------------------------- | ------------------------------ |
| `1` / `2`                  | Pen / Eraser                   |
| `r` / `o` / `d`            | Rectangle / Ellipse / Diamond  |
| `l` / `a` / `t`            | Line / Arrow / Text            |
| `+` / `-`                  | Zoom in / out                  |
| `Ctrl` + `0`               | Reset zoom                     |
| `Ctrl` + `Z`               | Undo                           |
| `Ctrl` + `Shift` + `Z` / `Ctrl` + `Y` | Redo                  |

## Deploying to Vercel

Both folders ship with a `vercel.json`. Create two Vercel projects from this repo:

| Project | Root directory | Notes                                        |
| ------- | -------------- | -------------------------------------------- |
| Backend | `backend/`     | Set `DJANGO_SECRET_KEY`, `DATABASE_URL` (Postgres), `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS` |
| Frontend| `frontend/`    | Set `VITE_API_URL` to the deployed backend URL |

> Backend migrations must be run **once** against the production database before
> traffic hits it: `DATABASE_URL=<url> python manage.py migrate` (SQLite is
> ephemeral on Vercel — use PostgreSQL, e.g. Neon or Supabase).

## Tech stack

- **Frontend:** React, Vite, Konva / react-konva, Tailwind CSS
- **Backend:** Django, Django REST Framework, SimpleJWT
- **Database:** SQLite (local dev) / PostgreSQL (production)
