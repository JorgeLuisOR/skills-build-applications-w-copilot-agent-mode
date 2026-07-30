import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: false },
    calories: { type: Number, required: false },
    notes: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    schedule: { type: String, default: '' },
    maxAttendance: { type: Number },
  },
  { timestamps: true },
);

export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
