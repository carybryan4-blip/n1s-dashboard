import { Player } from '../types/types';

export function parsePlayerDataCSV(content: string): Player[] {
  const lines = content.trim().split('\n');
  const players: Player[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    if (values.length < 7) continue;

    const player: Player = {
      userId: values[0].trim(),
      counterSpin: values[1].trim().toLowerCase() === 'true',
      wins: parseInt(values[2].trim(), 10) || 0,
      spinnerId: values[3].trim(),
      bits: parseInt(values[4].trim(), 10) || 0,
      clan: values[5].trim(),
      unlocks: parseUnlocks(values[6].trim()),
    };

    players.push(player);
  }

  return players;
}

function parseUnlocks(unlockString: string): string[] {
  if (!unlockString) return [];
  // Unlocks are stored as "+unlock1+unlock2+unlock3"
  return unlockString
    .split('+')
    .filter((s) => s.length > 0);
}

export function getLeaderboard(
  players: Player[],
  sortBy: 'bits' | 'wins' = 'bits',
  limit?: number
) {
  const sorted = [...players].sort((a, b) => b[sortBy] - a[sortBy]);
  const limited = limit ? sorted.slice(0, limit) : sorted;

  return limited.map((player, index) => ({
    rank: index + 1,
    player,
  }));
}
