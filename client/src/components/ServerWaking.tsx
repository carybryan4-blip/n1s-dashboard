import React from 'react';
import './ServerWaking.css';

interface ServerWakingProps {
  state: 'connecting' | 'waking' | 'error';
  onRetry: () => void;
}

const ServerWaking: React.FC<ServerWakingProps> = ({ state, onRetry }) => {
  return (
    <div className="server-waking-overlay">
      <div className="server-waking-card">
        {state === 'connecting' && (
          <>
            <div className="spinner" />
            <h2>Connecting to server...</h2>
          </>
        )}

        {state === 'waking' && (
          <>
            <div className="spinner" />
            <h2>Waking up the server</h2>
            <p className="waking-message">
              This app uses free-tier hosting which sleeps when inactive.
              <br />
              Please wait ~30 seconds while it starts up.
            </p>
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
            <p className="waking-note">
              ☕ Good time for a sip of coffee
            </p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="error-icon">⚠️</div>
            <h2>Couldn't reach the server</h2>
            <p className="error-message">
              The server might be experiencing issues or undergoing maintenance.
            </p>
            <button className="retry-btn" onClick={onRetry}>
              Try Again
            </button>
          </>
        )}

        <p className="hosting-note">
          Hosted on Render free tier to keep costs down.
          <br />
          <a 
            href="https://render.com/docs/free#spinning-down-on-idle" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Why does this happen?
          </a>
        </p>
      </div>
    </div>
  );
};

export default ServerWaking;
