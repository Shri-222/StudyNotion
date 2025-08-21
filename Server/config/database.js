const mongoose = require('mongoose');

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = async () => {
    
    // Skip real DB connection when running tests
     if (process.env.NODE_ENV === 'test') {
        console.log('Skipping real MongoDB connection for tests');
        return;
    } 

    try {
        await mongoose.connect(MONGODB_URL);

        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};