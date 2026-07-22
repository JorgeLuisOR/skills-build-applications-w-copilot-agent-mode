export const mockUsers = [
  { id: 'user-1', name: 'Ava Patel', email: 'ava@example.com', role: 'member' },
  { id: 'user-2', name: 'Leo Martinez', email: 'leo@example.com', role: 'captain' },
  { id: 'user-3', name: 'Mia Johnson', email: 'mia@example.com', role: 'member' },
];

export const mockTeams = [
  { id: 'team-1', name: 'Trail Blazers', members: ['user-1', 'user-3'] },
  { id: 'team-2', name: 'Velocity Crew', members: ['user-2'] },
];

export const mockActivities = [
  { id: 'activity-1', userId: 'user-1', type: 'run', durationMinutes: 35, calories: 280 },
  { id: 'activity-2', userId: 'user-2', type: 'cycling', durationMinutes: 45, calories: 320 },
];

export const mockLeaderboard = [
  { id: 'leaderboard-1', userId: 'user-2', name: 'Leo Martinez', score: 980 },
  { id: 'leaderboard-2', userId: 'user-1', name: 'Ava Patel', score: 840 },
  { id: 'leaderboard-3', userId: 'user-3', name: 'Mia Johnson', score: 760 },
];

export const mockWorkouts = [
  { id: 'workout-1', title: 'HIIT Sprint', target: 'Endurance', durationMinutes: 20 },
  { id: 'workout-2', title: 'Upper Body Strength', target: 'Strength', durationMinutes: 30 },
];
