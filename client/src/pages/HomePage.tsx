import React from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import PlayerCard from '../components/PlayerCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { players, isConnected } = useSocket();

  // Get top 5 by bytes
  const topByBytes = [...players]
    .sort((a, b) => b.bits - a.bits)
    .slice(0, 5);

  // Get top 5 by wins
  const topByWins = [...players]
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 5);

  // Stats
  const totalPlayers = players.length;
  const totalBytes = players.reduce((sum, p) => sum + p.bits, 0);
  const totalWins = players.reduce((sum, p) => sum + p.wins, 0);

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="pixel-font hero-title">Numbah1Spinna</h1>
        <p className="hero-subtitle">
          Live stats and leaderboards for the spinner battle game
        </p>
        <div className="hero-status">
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          {isConnected ? 'Connected - Data updates in real-time' : 'Connecting...'}
        </div>
      </section>

      <section className="stats-overview">
        <div className="stat-card">
          <span className="stat-number">{totalPlayers.toLocaleString()}</span>
          <span className="stat-title">Total Players</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalBytes.toLocaleString()}</span>
          <span className="stat-title">Total Bytes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalWins.toLocaleString()}</span>
          <span className="stat-title">Total Wins</span>
        </div>
      </section>

      <div className="leaderboard-preview-grid">
        <section className="leaderboard-preview">
          <div className="section-header">
            <h2>Top Bytes</h2>
            <Link to="/leaderboard?sort=bits" className="view-all">View All →</Link>
          </div>
          <div className="player-list">
            {topByBytes.map((player, index) => (
              <PlayerCard 
                key={player.userId} 
                player={player} 
                rank={index + 1}
                showDetails={true}
              />
            ))}
            {topByBytes.length === 0 && (
              <p className="empty-state">No players yet</p>
            )}
          </div>
        </section>

        <section className="leaderboard-preview">
          <div className="section-header">
            <h2>Top Wins</h2>
            <Link to="/leaderboard?sort=wins" className="view-all">View All →</Link>
          </div>
          <div className="player-list">
            {topByWins.map((player, index) => (
              <PlayerCard 
                key={player.userId} 
                player={player} 
                rank={index + 1}
                showDetails={true}
              />
            ))}
            {topByWins.length === 0 && (
              <p className="empty-state">No players yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
