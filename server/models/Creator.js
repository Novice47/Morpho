import mongoose from 'mongoose';

const CreatorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatarColor: {
    type: String
  },
  specialty: {
    type: String
  },
  bio: {
    type: String
  },
  followers: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  assetCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Creator', CreatorSchema);
