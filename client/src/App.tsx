import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider, useSocket } from './context/SocketContext';
import Layout from './components/Layout';
import ServerWaking from './components/ServerWaking';
import LeaderboardPage from './pages/LeaderboardPage';
import PlayersPage from './pages/PlayersPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import HomePage from './pages/HomePage';

const AppContent: React.FC = () => {
  const { connectionState, retryConnection } = useSocket();

  if (connectionState !== 'connected') {
    return (
      <ServerWaking 
        state={connectionState} 
        onRetry={retryConnection} 
      />
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:userId" element={<PlayerDetailPage />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
};

export default App;
