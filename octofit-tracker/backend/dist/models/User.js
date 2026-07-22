import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, required: true, enum: ['member', 'captain', 'coach'] },
    fitnessGoal: { type: String, default: 'Improve consistency' },
    weeklyTarget: { type: Number, default: 180 },
}, { timestamps: true });
export const User = mongoose.models.User || mongoose.model('User', userSchema);
