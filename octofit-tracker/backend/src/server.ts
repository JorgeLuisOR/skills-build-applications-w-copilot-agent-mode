import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database.js';
import { PORT, getApiBaseUrl } from './config/environment.js';
import { User } from './models/User.js';
import { Team } from './models/Team.js';
import { Activity } from './models/Activity.js';
import { LeaderboardEntry } from './models/LeaderboardEntry.js';
import { Workout } from './models/Workout.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const isDbConnected = (await import('./config/database.js')).default.readyState === 1;
  res.json({
    status: 'ok',
    service: 'octofit-tracker-backend',
    apiBaseUrl: getApiBaseUrl(),
    database: isDbConnected ? 'connected' : 'disconnected',
  });
});

app.get(['/api/users', '/api/users/'], async (_req, res) => {
  const users = await User.find().lean();
  res.json({ data: users });
});

app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
  const teams = await Team.find().populate('members').populate('captain').lean();
  res.json({ data: teams });
});

app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
  const activities = await Activity.find().populate('userId').lean();
  res.json({ data: activities });
});

app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find().lean();
  res.json({ data: leaderboard });
});

app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
  const workouts = await Workout.find().lean();
  res.json({ data: workouts });
});

app.listen(PORT, () => {
  console.log(`OctoFit Tracker backend listening on http://localhost:${PORT}`);
  console.log(`API base URL: ${getApiBaseUrl()}`);
});
