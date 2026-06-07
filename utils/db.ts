import { ifError } from "assert";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env file")

}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn:null , promise:null} 
}

export async function connectToDB() {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const ops = {
            bufferCommands : true,
            maxPoolSize : 10
        }
        mongoose
        .connect(MONGODB_URI,ops)
        .then(()=>{mongoose.connection})
    }
    try {
        cached.conn  = await cached.promise;
    } catch (error) {
        cached.promise =null;
    }
    return cached.conn;
}