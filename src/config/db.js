const mongoose = require('mongoose');

const connectDB = async (mongo_uri) => {
  try {
    await mongoose.connect(mongo_uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed: ', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
