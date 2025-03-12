// models/Campaign.js
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  goalAmount: {
    type: Number,
    required: true
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  creator: {
    type: String, // can later be ref to user
    required: true
  },
  imageUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

// models/Campaign.js
export default mongoose.model("Campaign", campaignSchema);
