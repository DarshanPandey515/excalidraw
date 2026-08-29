import { useState } from 'react';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import AuthPage from './pages/AuthPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';

const Router = () => {
  const { user, logout } = useAuth();
  const [board, setBoard] = useState(null);

  if (!user) return <AuthPage />;
  if (!board)
    return (
      <BoardsPage
        onOpen={setBoard}
        onLogout={() => {
          setBoard(null);
          logout();
        }}
      />
    );
  return <BoardPage board={board} onBack={() => setBoard(null)} />;
};

const App = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;