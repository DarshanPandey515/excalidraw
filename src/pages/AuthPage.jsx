import { useState } from 'react';
import { useAuth } from '../context/useAuth';

const inputClass =
  'w-full rounded-lg border border-neutral-900/10 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#6965db] focus:ring-2 focus:ring-[#6965db]/20';

const AuthPage = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="canvas-grid flex h-screen w-screen items-center justify-center bg-[#f8f7f4] font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-900/10 bg-white/90 p-6 shadow-xl shadow-neutral-900/10 backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-800">Excalidraw Clone</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {mode === 'login' ? 'Welcome back — sign in to your boards' : 'Create an account to start drawing'}
          </p>
        </div>

        <div className="mb-5 flex rounded-lg bg-neutral-100 p-1">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError('');
              }}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-colors ${
                mode === m ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
            minLength={8}
          />

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-[#6965db] py-2 text-sm font-semibold text-white transition hover:bg-[#5a56c8] disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-neutral-400">
          Your drawings are stored on the server and survive page reloads.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;