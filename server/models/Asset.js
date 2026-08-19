import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: true
  },
  license: {
    type: String,
    default: 'Commercial'
  },
  tags: [{
    type: String
  }],
  downloads: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dimensions: {
    type: String
  },
  fileSize: {
    type: String
  },
  format: {
    type: String,
    required: true
  },
  shapeType: {
    type: String,
    default: 'torus'
  },
  gradient: {
    type: String
  },
  url: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Asset', AssetSchema);
