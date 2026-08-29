# Excalidraw Clone — Backend (Django)

Django REST Framework API for the Excalidraw Clone. Handles JWT auth, boards, and saving/loading drawing elements.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Create a `.env` file (see `config/settings.py`):

```bash
DJANGO_SECRET_KEY=your-secret-key
# Optional: set to a PostgreSQL URL to use Postgres instead of SQLite
DATABASE_URL=postgres://user:pass@host/dbname
```

The API is served at `http://127.0.0.1:8000/api/`.

## API endpoints

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

## Deploying to Vercel

`vercel.json` is already configured — Vercel detects `manage.py`, reads the WSGI
entrypoint (`config/wsgi.py`), and installs packages from `requirements.txt`.

1. Set these environment variables in the Vercel project (or the CLI):

   - `DJANGO_SECRET_KEY` — a strong random key
   - `DATABASE_URL` — a **PostgreSQL** URL (SQLite is ephemeral on Vercel). [Neon](https://neon.tech) or [Supabase](https://supabase.com) are easy options.
   - `DJANGO_DEBUG` — `False`
   - `DJANGO_ALLOWED_HOSTS` — `.vercel.app` (also add any custom domain)

2. Run the database migrations **once** against the production database:

   ```bash
   DATABASE_URL=<your-postgres-url> python manage.py migrate
   ```

3. Deploy:

   ```bash
   vercel
   # or connect the backend as its own Git repository and import it in Vercel
   ```

> **Note:** serverless functions can't hold state, so make sure `DATABASE_URL`
> points at a real Postgres instance, not the local `db.sqlite3`.