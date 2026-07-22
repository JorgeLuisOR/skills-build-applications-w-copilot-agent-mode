import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';
import { LeaderboardEntry } from '../models/LeaderboardEntry.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Workout } from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [ava, leo, mia] = await User.insertMany([
      {
        name: 'Ava Patel',
        email: 'ava.patel@example.com',
        role: 'member',
        fitnessGoal: 'Run 5K consistently',
        weeklyTarget: 180,
      },
      {
        name: 'Leo Martinez',
        email: 'leo.martinez@example.com',
        role: 'captain',
        fitnessGoal: 'Improve cycling endurance',
        weeklyTarget: 240,
      },
      {
        name: 'Mia Johnson',
        email: 'mia.johnson@example.com',
        role: 'member',
        fitnessGoal: 'Build upper-body strength',
        weeklyTarget: 200,
      },
    ]);

    await Team.insertMany([
      {
        name: 'Trail Blazers',
        description: 'Weekend hiking and endurance training',
        members: [ava._id, mia._id],
        captain: leo._id,
      },
      {
        name: 'Velocity Crew',
        description: 'Sprint-focused performance team',
        members: [leo._id],
        captain: leo._id,
      },
    ]);

    await Activity.insertMany([
      {
        userId: ava._id,
        type: 'run',
        durationMinutes: 35,
        calories: 280,
        notes: 'Morning 5K pace work',
      },
      {
        userId: leo._id,
        type: 'cycling',
        durationMinutes: 45,
        calories: 320,
        notes: 'Tempo ride intervals',
      },
      {
        userId: mia._id,
        type: 'strength',
        durationMinutes: 50,
        calories: 225,
        notes: 'Upper-body circuit',
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        userId: leo._id,
        name: 'Leo Martinez',
        score: 980,
        streak: 11,
      },
      {
        userId: ava._id,
        name: 'Ava Patel',
        score: 840,
        streak: 8,
      },
      {
        userId: mia._id,
        name: 'Mia Johnson',
        score: 760,
        streak: 6,
      },
    ]);

    await Workout.insertMany([
      {
        title: 'HIIT Sprint',
        target: 'Endurance',
        difficulty: 'advanced',
        durationMinutes: 20,
        description: 'Short bursts with recovery intervals',
      },
      {
        title: 'Upper Body Strength',
        target: 'Strength',
        difficulty: 'intermediate',
        durationMinutes: 30,
        description: 'Push, pull, and core circuit',
      },
      {
        title: 'Mobility Reset',
        target: 'Recovery',
        difficulty: 'beginner',
        durationMinutes: 15,
        description: 'Gentle movement and stretching',
      },
    ]);

    console.log('Seed the octofit_db database with test data');
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
