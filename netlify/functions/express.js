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

router.get('/requests/all', authenticationMiddleware, async (request, response) => {
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

router.get('/requests/open', authenticationMiddleware, async (request, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');
        const userId = new ObjectId(request.user.id);

        const query = {
            $and: [
                { user_id: userId },
                { completion_date: { $exists: false } }
            ]
        };

        const requests = await collection.find(query).toArray();

        requests.forEach(result => {
            result.isOwner = result.user_id.toString() === request.user.id;
            result.isAdmin = request.user.role === 'admin';
        });

        response.json(requests);
    } catch (error) {
        console.error('Error fetching open requests:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


router.get('/requests/all/open', authenticationMiddleware, async (request, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');
        const requests = await collection.find({ completion_date: { $exists: false } }).toArray();


        requests.forEach(result => {
            result.isOwner = result.user_id.toString() === request.user.id;
            result.isAdmin = request.user.role === 'admin';
        });

        response.json(requests);
    } catch (error) {
        console.error('Error fetching open requests:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.post('/requests', authenticationMiddleware, async (request, response) => {
    const { title, description } = request.body;
    if (!title || !description) {
        return response.status(400).json({ error: 'Titel og beskrivelse er påkrævet.' });
    }

    if (title.length > 30) {
        return response.status(400).json({ error: 'Titel må ikke overstige 30 tegn.' });
    }

    if (description.length > 200) {
        return response.status(400).json({ error: 'Beskrivelse må ikke overstige 200 tegn.' });
    }

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');
        const userId = new ObjectId(request.user.id);
        const newRequest = {
            title,
            description,
            user_id: userId,
            creation_date: new Date(),
            owner: request.user.username,
        };

        const result = await collection.insertOne(newRequest);
        response.status(201).json(result);
    } catch (error) {
        console.error('Error creating request:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await client.close();
    }
});

app.put('/requests/:id/start', authenticationMiddleware, async (request, response) => {
    const requestId = request.params.id;

    if (!requestId) return response.status(400).json({ error: 'Request ID is required.' });
    if (!ObjectId.isValid(requestId)) return response.status(400).json({ error: 'Invalid request ID format.' });
    if (!request.user.type === "admin") return response.status(403).json({ error: 'Du har ikke rettigheder til at starte denne anmodning.' });

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');

        const result = await collection.updateOne(
            { _id: new ObjectId(requestId) },
            {
                $set: {
                    response_date: new Date(),
                }
            }
        );
        if (result.modifiedCount === 0) {
            return response.status(404).json({ error: 'Request not found or already started.' });
        }
        response.status(200).json({ message: 'Request marked as started.' });
    } catch (error) {
        console.error('Error starting request:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await client.close();
    }
});


app.put('/requests/:id/complete', authenticationMiddleware, async (request, response) => {
    const requestId = request.params.id;

    if (!requestId) return response.status(400).json({ error: 'Request ID is required.' });
    if (!ObjectId.isValid(requestId)) return response.status(400).json({ error: 'Invalid request ID format.' });



    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');

        const existingRequest = await collection.findOne({ _id: new ObjectId(requestId) });
        if (!existingRequest) return response.status(404).json({ error: 'Request not found.' });
        if (existingRequest.user_id.toString() !== request.user.id && request.user.role !== 'admin') {
            return response.status(403).json({ error: 'Du har ikke rettighedder til at fuldføre denne anmodning.' });
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(requestId) },
            {
                $set: {
                    completion_date: new Date(),
                }
            }
        );

        if (result.modifiedCount === 0) {
            return response.status(404).json({ error: 'Request not found or already completed.' });
        }
        response.status(200).json({ message: 'Request marked as completed.' });
    } catch (error) {
        console.error('Error completing request:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await client.close();
    }
});