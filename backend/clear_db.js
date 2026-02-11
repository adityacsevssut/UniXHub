const mongoose = require('mongoose');
require('dotenv').config();

const clearUsers = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Count before
    const countBefore = await mongoose.connection.collection('users').countDocuments();
    console.log(`Users before cleanup: ${countBefore}`);

    // Delete all
    await mongoose.connection.collection('users').deleteMany({});
    console.log('Executed deleteMany({}) on users collection.');

    // Count after
    const countAfter = await mongoose.connection.collection('users').countDocuments();
    console.log(`Users remaining: ${countAfter}`);

  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

clearUsers();
