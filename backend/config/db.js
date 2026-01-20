const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.log("Error in connecting to DB");
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;
