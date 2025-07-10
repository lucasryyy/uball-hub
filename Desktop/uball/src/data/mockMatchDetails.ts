export type MatchEvent = {
  minute: number;
  team: 'home' | 'away';
  player: string;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  assist?: string;
};

export type PlayerRating = {
  name: string;
  rating: number;
};

export type MatchDetails = {
  events: MatchEvent[];
  homePlayers: PlayerRating[];
  awayPlayers: PlayerRating[];
};

export const mockMatchDetails: Record<number, MatchDetails> = {
  1: {
    events: [
      { minute: 12, team: 'home', player: 'Player A', type: 'goal', assist: 'Player B' },
      { minute: 45, team: 'away', player: 'Player X', type: 'yellow' },
      { minute: 78, team: 'home', player: 'Player C', type: 'sub' },
      { minute: 84, team: 'away', player: 'Player Y', type: 'goal' }
    ],
    homePlayers: [
      { name: 'Player A', rating: 7.8 },
      { name: 'Player B', rating: 7.2 },
      { name: 'Player C', rating: 6.9 }
    ],
    awayPlayers: [
      { name: 'Player X', rating: 6.3 },
      { name: 'Player Y', rating: 7.5 },
      { name: 'Player Z', rating: 6.7 }
    ]
  },
  2: {
    events: [
      { minute: 33, team: 'home', player: 'Player M', type: 'goal' },
      { minute: 67, team: 'away', player: 'Player N', type: 'red' }
    ],
    homePlayers: [
      { name: 'Player M', rating: 8.1 },
      { name: 'Player O', rating: 7.0 }
    ],
    awayPlayers: [
      { name: 'Player N', rating: 5.4 },
      { name: 'Player P', rating: 6.2 }
    ]
  }
};
