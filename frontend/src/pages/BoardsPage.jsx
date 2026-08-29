import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  apiListBoards,
  apiCreateBoard,
  apiDeleteBoard,
} from '../api/boards';

const inputClass =
  'w-full rounded-lg border border-neutral-900/10 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#6965db] focus:ring-2 focus:ring-[#6965db]/20';

const BoardsPage = ({ onOpen, onLogout }) => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      const data = await apiListBoards();
      setBoards(data.boards || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiListBoards();
        if (!cancelled) setBoards(data.boards || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      const board = await apiCreateBoard(name.trim());
      setName('');
      await refresh();
      onOpen(board);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id, boardName) => {
    if (!window.confirm(`Delete board "${boardName}"?`)) return;
    try {
      await apiDeleteBoard(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="canvas-grid min-h-screen w-screen bg-[#f8f7f4] font-sans">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Your boards</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Signed in as {user?.name || user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-neutral-900/10 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
          >
            Log out
          </button>
        </div>

        <form
          onSubmit={create}
          className="mb-8 flex items-center gap-2 rounded-2xl border border-neutral-900/10 bg-white/90 p-2 shadow-sm"
        >
          <input
            type="text"
            placeholder="New board name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="shrink-0 rounded-lg bg-[#6965db] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5a56c8] disabled:opacity-50"
          >
            Create board
          </button>
        </form>

        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-neutral-500">Loading boards…</p>
        ) : boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-900/15 p-12 text-center">
            <p className="text-neutral-500">No boards yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <div
                key={board.id}
                className="group cursor-pointer rounded-2xl border border-neutral-900/10 bg-white p-5 shadow-sm transition hover:border-[#6965db]/50 hover:shadow-md"
                onClick={() => onOpen(board)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-neutral-800">
                      {board.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      {new Date(board.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    title="Delete board"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(board.id, board.name);
                    }}
                    className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardsPage;