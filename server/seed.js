import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Asset from './models/Asset.js';
import Creator from './models/Creator.js';
import { assets } from '../src/data/assets.js';
import { creators } from '../src/data/creators.js';

dotenv.config();

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set. Seeding cancelled.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Seeding connection established.");

    // Clear old collection records
    await Asset.deleteMany({});
    console.log("Legacy Assets dropped.");
    await Creator.deleteMany({});
    console.log("Legacy Creators dropped.");

    // Insert creators
    const seededCreators = await Creator.insertMany(creators);
    console.log(`Successfully seeded ${seededCreators.length} creators.`);

    // Insert assets
    const seededAssets = await Asset.insertMany(assets);
    console.log(`Successfully seeded ${seededAssets.length} assets.`);

    console.log("Seeding script completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed with error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
