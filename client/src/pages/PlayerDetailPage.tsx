import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './PlayerDetailPage.css';

const PlayerDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { players } = useSocket();

  const player = useMemo(() => {
    return players.find(
      (p) => p.userId.toLowerCase() === userId?.toLowerCase()
    );
  }, [players, userId]);

  // Calculate rank
  const ranks = useMemo(() => {
    if (!player) return { bytes: 0, wins: 0 };

    const byBytes = [...players].sort((a, b) => b.bits - a.bits);
    const byWins = [...players].sort((a, b) => b.wins - a.wins);

    return {
      bytes: byBytes.findIndex((p) => p.userId === player.userId) + 1,
      wins: byWins.findIndex((p) => p.userId === player.userId) + 1,
    };
  }, [players, player]);

  if (!player) {
    return (
      <div className="player-detail-page">
        <div className="not-found">
          <h1>Player Not Found</h1>
          <p>Could not find a player with username "{userId}"</p>
          <Link to="/players" className="btn btn-primary">
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="player-detail-page">
      <Link to="/players" className="back-link">
        ← Back to Players
      </Link>

      <div className="player-header">
        <div className="player-avatar-large">
          <span className="spinner-name">{player.spinnerId}</span>
        </div>

        <div className="player-title">
          <h1>{player.userId}</h1>
          {player.clan && (
            <span className="clan-tag">[{player.clan}]</span>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card large">
          <span className="stat-value">{player.bits.toLocaleString()}</span>
          <span className="stat-label">Bytes</span>
          <span className="stat-rank">Rank #{ranks.bytes}</span>
        </div>

        <div className="stat-card large">
          <span className="stat-value">{player.wins}</span>
          <span className="stat-label">Wins</span>
          <span className="stat-rank">Rank #{ranks.wins}</span>
        </div>
      </div>

      <div className="details-section">
        <h2>Details</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Spinner</span>
            <span className="detail-value">{player.spinnerId}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Counter-Spin</span>
            <span className={`detail-value ${player.counterSpin ? 'enabled' : 'disabled'}`}>
              {player.counterSpin ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Clan</span>
            <span className="detail-value">
              {player.clan || 'None'}
            </span>
          </div>
        </div>
      </div>

      {player.unlocks.length > 0 && (
        <div className="unlocks-section">
          <h2>Unlocks</h2>
          <div className="unlocks-list">
            {player.unlocks.map((unlock, index) => (
              <span key={index} className="unlock-badge">
                {unlock}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDetailPage;
