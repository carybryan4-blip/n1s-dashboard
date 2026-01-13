import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getLeaderboard } from './utils/csvParser';
import { Player, WSMessage, ServerStatus } from '../../shared/types';

// Configuration
const PORT = process.env.PORT || 3001;
const SYNC_API_KEY = process.env.SYNC_API_KEY || 'change-this-in-production';

// State - stored in memory, persists until server restarts
let players: Player[] = [];
let lastUpdate: Date = new Date();

// Express setup
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // Allow larger payloads for full sync

const httpServer = createServer(app);

// Socket.IO setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Helper to broadcast updates
function broadcastUpdate() {
  const message: WSMessage<Player[]> = {
    type: 'players_update',
    data: players,
    timestamp: lastUpdate.toISOString(),
  };
  io.emit('update', message);
  console.log(`[Server] Broadcasted update to ${io.engine.clientsCount} clients`);
}

// REST API Routes

// Get all players
app.get('/api/players', (req, res) => {
  res.json(players);
});

// Get single player by userId
app.get('/api/players/:userId', (req, res) => {
  const player = players.find(
    (p) => p.userId.toLowerCase() === req.params.userId.toLowerCase()
  );
  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sortBy = (req.query.sortBy as 'bits' | 'wins') || 'bits';
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

  const leaderboard = getLeaderboard(players, sortBy, limit);
  res.json(leaderboard);
});

// Get server status
app.get('/api/status', (req, res) => {
  const status: ServerStatus = {
    connected: true,
    playerCount: players.length,
    lastUpdate: lastUpdate.toISOString(),
  };
  res.json(status);
});

// SYNC ENDPOINT - Called by the game to update all player data
app.post('/api/sync', (req, res) => {
  // Validate API key
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== SYNC_API_KEY) {
    console.warn('[Sync] Rejected - invalid API key');
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { playerData } = req.body;

  if (!Array.isArray(playerData)) {
    return res.status(400).json({ error: 'playerData must be an array' });
  }

  // Validate and transform player data
  try {
    players = playerData.map((p: Record<string, unknown>) => ({
      userId: String(p.userId || ''),
      counterSpin: Boolean(p.counterSpin),
      wins: Number(p.wins) || 0,
      spinnerId: String(p.spinnerId || 'default'),
      bits: Number(p.bits) || 0,
      clan: String(p.clan || ''),
      unlocks: Array.isArray(p.unlocks) ? p.unlocks.map(String) : [],
    }));

    lastUpdate = new Date();

    console.log(`[Sync] Received ${players.length} players`);

    // Broadcast to all connected clients
    broadcastUpdate();

    res.json({ 
      success: true, 
      playerCount: players.length,
      timestamp: lastUpdate.toISOString(),
    });
  } catch (error) {
    console.error('[Sync] Error processing data:', error);
    res.status(400).json({ error: 'Invalid player data format' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send current data on connect
  const message: WSMessage<Player[]> = {
    type: 'players_update',
    data: players,
    timestamp: lastUpdate.toISOString(),
  };
  socket.emit('update', message);

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] Sync endpoint: POST /api/sync (requires x-api-key header)`);
  console.log(`[Server] Players in memory: ${players.length}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down...');
  httpServer.close();
  process.exit(0);
});
