import { ifError } from "assert";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env file")

}

let cached: any = (global as any).mongoose;

if (!cached) {
    (global as any).mongoose = cached = { conn: null, promise: null };
}

export async function connectToDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const ops = {
            bufferCommands: true,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, ops).then((m) => {
            return m.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}