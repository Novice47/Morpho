import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  savedAssets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  }],
  ownedAssets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);
