export type LeaderboardEntry = {
  rank: number;
  handle: string;
  score: number;
  isCurrentUser?: boolean;
};

const LEADERBOARD_SIZE = 300;

const XP_SEEDS: LeaderboardEntry[] = [
  { rank: 1, handle: '@GarysDiner', score: 970 },
  { rank: 2, handle: '@justhoopin', score: 924 },
  { rank: 3, handle: '@SEANYBOY1', score: 894 },
  { rank: 4, handle: '@collectingeats', score: 719 },
  { rank: 5, handle: '@manjy1144', score: 702 },
  { rank: 6, handle: '@eddieyou', score: 649 },
  { rank: 7, handle: '@allian', score: 648 },
  { rank: 8, handle: '@kathyglin', score: 619 },
  { rank: 9, handle: '@sola', score: 617 },
  { rank: 10, handle: '@emcraven', score: 591 },
];

const SAVED_SEEDS: LeaderboardEntry[] = [
  { rank: 1, handle: '@maya.studies', score: 12400 },
  { rank: 2, handle: '@alex.wnted', score: 9800 },
  { rank: 3, handle: '@jordan.saves', score: 8650 },
  { rank: 4, handle: '@priya.goals', score: 7420 },
  { rank: 5, handle: '@noah.funds', score: 6890 },
  { rank: 6, handle: '@khushi', score: 2840 },
  { rank: 7, handle: '@lina.wish', score: 2510 },
  { rank: 8, handle: '@devon.cash', score: 2280 },
  { rank: 9, handle: '@sam.deposits', score: 1950 },
  { rank: 10, handle: '@taylor.wnt', score: 1720 },
];

const HANDLE_STEMS = [
  'wishlist',
  'saves',
  'goals',
  'funds',
  'wnted',
  'deposits',
  'streak',
  'grind',
  'budget',
  'vault',
  'stack',
  'coins',
  'prize',
  'dream',
  'haul',
  'cart',
  'loot',
  'mint',
  'earn',
  'boost',
  'flex',
  'stash',
  'cents',
  'planner',
  'tracker',
  'hustle',
  'collector',
  'spender',
  'saver',
  'builder',
  'maker',
  'shopper',
  'finder',
  'hunter',
  'picker',
  'scout',
  'chaser',
  'runner',
  'climber',
  'rider',
  'roamer',
  'voyager',
  'wander',
  'nova',
  'luna',
  'sage',
  'river',
  'sky',
  'pearl',
  'stone',
] as const;

const handleForRank = (rank: number) => {
  const stem = HANDLE_STEMS[(rank * 13) % HANDLE_STEMS.length];
  const suffix = rank % 97;
  return `@${stem}${suffix > 0 ? suffix : ''}`;
};

const buildLeaderboard = (
  seeds: LeaderboardEntry[],
  minScore: number,
  decay: (rank: number, previousScore: number) => number
): LeaderboardEntry[] => {
  const entries = [...seeds];
  let previousScore = seeds[seeds.length - 1]?.score ?? minScore;

  for (let rank = seeds.length + 1; rank <= LEADERBOARD_SIZE; rank += 1) {
    previousScore = Math.max(minScore, decay(rank, previousScore));
    entries.push({
      rank,
      handle: handleForRank(rank),
      score: previousScore,
    });
  }

  return entries;
};

export const MOST_XP_LEADERBOARD = buildLeaderboard(XP_SEEDS, 42, (_rank, previous) => {
  const drop = 1 + ((_rank * 7) % 4);
  return previous - drop;
});

export const MOST_SAVED_LEADERBOARD = buildLeaderboard(SAVED_SEEDS, 120, (rank, previous) => {
  const drop = 3 + ((rank * 11) % 12);
  return previous - drop;
});

/** Replaces any existing row for `handle`, inserts the user, and re-ranks by score. */
export const withCurrentUser = (
  entries: LeaderboardEntry[],
  handle: string,
  score: number
): LeaderboardEntry[] => {
  const withoutUser = entries.filter((entry) => entry.handle !== handle);
  const merged: LeaderboardEntry[] = [
    ...withoutUser,
    { rank: 0, handle, score, isCurrentUser: true },
  ];

  if (merged.length > LEADERBOARD_SIZE) {
    const lastNonUserIndex = [...merged]
      .map((entry, index) => ({ entry, index }))
      .reverse()
      .find(({ entry }) => entry.handle !== handle)?.index;

    if (lastNonUserIndex !== undefined) {
      merged.splice(lastNonUserIndex, 1);
    }
  }

  merged.sort((a, b) => b.score - a.score);

  return merged.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isCurrentUser: entry.handle === handle,
  }));
};
