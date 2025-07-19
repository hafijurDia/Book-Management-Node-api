import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

let server: Server;
const PORT = process.env.PORT || 3000;

async function serverStart(){
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        console.log('Connected to MongoDB');
        server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log('Failed to connect to MongoDB', error);
        
    }
}

serverStart();