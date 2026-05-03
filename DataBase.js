const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connection established');
    } catch (error) {
        console.warn(`Cloud DB failed (${error.message}), falling back to local...`);
        try {
            await mongoose.connect(process.env.MONGO_LOCAL_URL);
            console.log('Connected to local database');
        } catch (localError) {
            console.error('Local DB also failed:', localError.message);
            process.exit(1);
        }
    }
};

module.exports = ConnectDB;
