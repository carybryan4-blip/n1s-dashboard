import React from 'react';
import { Link } from 'react-router-dom';
import { Player } from '../../../shared/types';
import './PlayerCard.css';

interface PlayerCardProps {
  player: Player;
  rank?: number;
  showDetails?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank, showDetails = true }) => {
  const getRankClass = (rank: number): string => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  return (
    <Link to={`/players/${player.userId}`} className="player-card">
      {rank && (
        <div className={`player-rank ${getRankClass(rank)}`}>
          #{rank}
        </div>
      )}
      
      <div className="player-avatar">
        <span className="avatar-spinner">{player.spinnerId}</span>
      </div>

      <div className="player-info">
        <h3 className="player-name">{player.userId}</h3>
        {player.clan && (
          <span className="player-clan">[{player.clan}]</span>
        )}
      </div>

      {showDetails && (
        <div className="player-stats">
          <div className="stat">
            <span className="stat-value">{player.bits.toLocaleString()}</span>
            <span className="stat-label">Bytes</span>
          </div>
          <div className="stat">
            <span className="stat-value">{player.wins}</span>
            <span className="stat-label">Wins</span>
          </div>
        </div>
      )}

      {player.counterSpin && (
        <div className="counter-spin-badge" title="Counter-Spin Enabled">
          ↺
        </div>
      )}
    </Link>
  );
};

export default PlayerCard;
