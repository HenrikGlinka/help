import express, { Router } from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import authenticationMiddleware from './authentication.js';
/* import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; */

dotenv.config();

/* const PORT = process.env.SERVER_PORT; */
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'help';

if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);

const client = new MongoClient(MONGODB_URI);

const app = express();
const router = Router();

app.use(cors());
app.use(express.json());
app.use("/api/", router);

export const handler = serverless(app);

router.get('/api/requests/all', authenticationMiddleware, async (request, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');
        const requests = await collection.find().toArray();

        requests.forEach(result => {
            result.isOwner = result.user_id.toString() === request.user.id;
            result.isAdmin = request.user.role === 'admin';
        });

        response.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});
