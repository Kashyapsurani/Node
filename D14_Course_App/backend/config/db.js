const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    // Ensure MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }  
 
    // Add options to prevent deprecation warnings
    await mongoose.connect(process.env.MONGO_URI, {
    
    });
 
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message || error);
    process.exit(1); // Exit the process with failure
  }
}; 

module.exports = connectDb;
