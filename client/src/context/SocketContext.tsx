import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, WSMessage } from '../../../shared/types';

type ConnectionState = 'connecting' | 'waking' | 'connected' | 'error';

interface SocketContextType {
  players: Player[];
  connectionState: ConnectionState;
  lastUpdate: string | null;
  retryConnection: () => void;
}

const SocketContext = createContext<SocketContextType>({
  players: [],
  connectionState: 'connecting',
  lastUpdate: null,
  retryConnection: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || ''
  : 'http://localhost:3001';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const connectToServer = useCallback(async () => {
    setConnectionState('connecting');

    // First, try to reach the API with a simple fetch
    // This wakes up the server if it's sleeping
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_URL}/api/status`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API not ready');
      }

      // API is up, now connect WebSocket
      setConnectionState('connected');
    } catch (error) {
      // Server is likely waking up
      setConnectionState('waking');
      
      // Retry with longer timeout
      try {
        const response = await fetch(`${API_URL}/api/status`, {
          signal: AbortSignal.timeout(45000), // 45s for cold start
        });

        if (response.ok) {
          setConnectionState('connected');
        } else {
          setConnectionState('error');
          return;
        }
      } catch {
        setConnectionState('error');
        return;
      }
    }

    // Connect WebSocket after API is confirmed up
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket] Connected');
      setConnectionState('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    newSocket.on('connect_error', () => {
      console.log('[Socket] Connection error');
    });

    newSocket.on('update', (message: WSMessage<Player[]>) => {
      console.log(`[Socket] Received update: ${message.data.length} players`);
      setPlayers(message.data);
      setLastUpdate(message.timestamp);
    });

    // Also fetch initial data via REST in case WebSocket is slow
    try {
      const response = await fetch(`${API_URL}/api/players`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
        setLastUpdate(new Date().toISOString());
      }
    } catch (error) {
      console.error('[API] Failed to fetch players:', error);
    }
  }, []);

  useEffect(() => {
    connectToServer();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [retryCount]);

  const retryConnection = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setRetryCount((c) => c + 1);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ players, connectionState, lastUpdate, retryConnection }}>
      {children}
    </SocketContext.Provider>
  );
};
