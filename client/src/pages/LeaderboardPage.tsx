import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import PlayerCard from '../components/PlayerCard';
import './LeaderboardPage.css';

type SortField = 'bits' | 'wins';

const LeaderboardPage: React.FC = () => {
  const { players } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSort = (searchParams.get('sort') as SortField) || 'bits';
  const [sortBy, setSortBy] = useState<SortField>(initialSort);
  const [limit, setLimit] = useState<number>(50);

  const sortedPlayers = useMemo(() => {
    return [...players]
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, limit);
  }, [players, sortBy, limit]);

  const handleSortChange = (newSort: SortField) => {
    setSortBy(newSort);
    setSearchParams({ sort: newSort });
  };

  return (
    <div className="leaderboard-page">
      <header className="page-header">
        <h1>Leaderboard</h1>
        <p className="page-subtitle">
          {players.length} total players
        </p>
      </header>

      <div className="controls">
        <div className="sort-controls">
          <span className="control-label">Sort by:</span>
          <button
            className={`sort-btn ${sortBy === 'bits' ? 'active' : ''}`}
            onClick={() => handleSortChange('bits')}
          >
            Bytes
          </button>
          <button
            className={`sort-btn ${sortBy === 'wins' ? 'active' : ''}`}
            onClick={() => handleSortChange('wins')}
          >
            Wins
          </button>
        </div>

        <div className="limit-controls">
          <span className="control-label">Show:</span>
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="limit-select"
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
            <option value={9999}>All</option>
          </select>
        </div>
      </div>

      <div className="leaderboard-list">
        {sortedPlayers.map((player, index) => (
          <PlayerCard
            key={player.userId}
            player={player}
            rank={index + 1}
            showDetails={true}
          />
        ))}

        {sortedPlayers.length === 0 && (
          <div className="empty-state">
            <p>No players found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
