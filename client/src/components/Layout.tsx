import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { connectionState, lastUpdate } = useSocket();

  const formatLastUpdate = (timestamp: string | null): string => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const isConnected = connectionState === 'connected';

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-content">
          <NavLink to="/" className="logo">
            <span className="pixel-font logo-text">N1S</span>
            <span className="logo-subtitle">Dashboard</span>
          </NavLink>

          <nav className="nav">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/leaderboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Leaderboard
            </NavLink>
            <NavLink 
              to="/players" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Players
            </NavLink>
          </nav>

          <div className="status-bar">
            <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
            <span className="status-text">
              {isConnected ? 'Live' : 'Offline'}
            </span>
            {lastUpdate && (
              <span className="last-update">
                Updated: {formatLastUpdate(lastUpdate)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>Numbah1Spinna Dashboard</p>
          <p className="footer-links">
            <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer">Twitch</a>
            {' • '}
            <a href="https://kick.com" target="_blank" rel="noopener noreferrer">Kick</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
