/*
    This function connects the database using the MONGO_URI

    Exports:
    ConnectDB - does the connection

    Imports:
    Mongoose - this is the library used to interact with the MongoDB database.
*/

import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected mongodb");
    } catch (error) {
        console.error("Couldn't connect to mongodb...", error);
        process.exit(1);
    }
}
