import mongoose, { Schema } from 'mongoose';
const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    calories: { type: Number, required: true },
    notes: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
