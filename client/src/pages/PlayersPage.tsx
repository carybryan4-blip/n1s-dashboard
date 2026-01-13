import React, { useState, useMemo } from 'react';
import { useSocket } from '../context/SocketContext';
import PlayerCard from '../components/PlayerCard';
import './PlayersPage.css';

const PlayersPage: React.FC = () => {
  const { players } = useSocket();
  const [search, setSearch] = useState('');
  const [filterClan, setFilterClan] = useState<string>('');

  // Get unique clans
  const clans = useMemo(() => {
    const clanSet = new Set<string>();
    players.forEach((p) => {
      if (p.clan) clanSet.add(p.clan);
    });
    return Array.from(clanSet).sort();
  }, [players]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch = player.userId
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesClan = !filterClan || player.clan === filterClan;
      return matchesSearch && matchesClan;
    });
  }, [players, search, filterClan]);

  return (
    <div className="players-page">
      <header className="page-header">
        <h1>Players</h1>
        <p className="page-subtitle">
          Search and browse all players
        </p>
      </header>

      <div className="search-controls">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button 
              className="clear-search"
              onClick={() => setSearch('')}
            >
              ×
            </button>
          )}
        </div>

        {clans.length > 0 && (
          <select
            value={filterClan}
            onChange={(e) => setFilterClan(e.target.value)}
            className="clan-filter"
          >
            <option value="">All Clans</option>
            {clans.map((clan) => (
              <option key={clan} value={clan}>
                [{clan}]
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="results-info">
        Showing {filteredPlayers.length} of {players.length} players
      </div>

      <div className="players-grid">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.userId}
            player={player}
            showDetails={true}
          />
        ))}

        {filteredPlayers.length === 0 && (
          <div className="empty-state">
            <p>No players found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
