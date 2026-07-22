import mongoose, { Schema } from 'mongoose';
const teamSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'Community fitness team' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    captain: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
