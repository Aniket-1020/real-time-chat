import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_DB_URI;
        console.log("Mongo URI in connectToMongoDB:", mongoURI); // Debug statement
        if (!mongoURI) {
            throw new Error("MONGO_DB_URI environment variable is not set.");
        }
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with a failure code
    }
};

export default connectToMongoDB;
