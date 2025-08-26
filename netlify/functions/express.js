import express, { Router } from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import authenticationMiddleware from './authentication.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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


router.post('/users/register', async (request, response) => {

    request.on('data', async data => {
        const { invite, username, password } = JSON.parse(data.toString());

        if (!username || !password) {
            return response.status(400).json({ error: 'Brugernavn og adgangskode er påkrævet' });
        }

        

        const database = client.db(DB_NAME);
        const inviteCollection = database.collection('invites');
        const userCollection = database.collection('users');

        const inviteData = await inviteCollection.findOne({ code: invite });
        if (!inviteData) return response.status(400).json({ error: 'Ugyldig invitationsnøgle' });


        const existingUser = await userCollection.findOne({ username: username.toLowerCase() });

        if (existingUser) {
            return response.status(409).json({ error: 'Brugernavnet findes allerede. Vælg venligst et andet.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            username: username.toLowerCase(),
            password_hash: passwordHash,
            created_at: new Date(),
            invite_code: invite,
            role: 'user'
        };

        await userCollection.insertOne(newUser);

        await inviteCollection.deleteOne({ code: invite });

        response.status(201).json({ message: 'User registered successfully' });

    });
});

router.post('/users/login', async (request, response) => {

    request.on('data', async data => {

        const { username, password } = JSON.parse(data.toString());

        if (!username || !password) {
            return response.status(400).json({ error: 'Brugernavn og adgangskode er påkrævet.' });
        }

        const database = client.db(DB_NAME);
        const collection = database.collection('users');

        const userData = await collection.findOne({ username: username.toLowerCase() });
        const isValidPassword = userData ? await bcrypt.compare(password, userData.password_hash) : false;

        if (!userData || !isValidPassword) {
            return response.status(401).json({ error: 'Ugyldigt brugernavn eller adgangskode.' });
        }

        const token = jwt.sign({ user: { id: userData._id, username: userData.username, role: userData.role } }, process.env.JWT_SECRET, { expiresIn: '12h' });

        response.json({ token });
    });
});

router.get('/requests/all', authenticationMiddleware, async (request, response) => {
    try {
        
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

    }
});

router.get('/requests/open', authenticationMiddleware, async (request, response) => {
    try {
        
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

    }
});


router.get('/requests/all/open', authenticationMiddleware, async (request, response) => {
    try {
        
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

    }
});

router.post('/requests', authenticationMiddleware, async (request, response) => {

    request.on('data', async data => {
        const { title, description } = JSON.parse(data.toString());
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

        }
    });
});

router.put('/requests/:id/start', authenticationMiddleware, async (request, response) => {
    const requestId = request.params.id;

    if (!requestId) return response.status(400).json({ error: 'Request ID is required.' });
    if (!ObjectId.isValid(requestId)) return response.status(400).json({ error: 'Invalid request ID format.' });
    if (!request.user.type === "admin") return response.status(403).json({ error: 'Du har ikke rettigheder til at starte denne anmodning.' });

    try {
        
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

    }
});


router.put('/requests/:id/complete', authenticationMiddleware, async (request, response) => {
    const requestId = request.params.id;

    if (!requestId) return response.status(400).json({ error: 'Request ID is required.' });
    if (!ObjectId.isValid(requestId)) return response.status(400).json({ error: 'Invalid request ID format.' });



    try {
        
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

    }
});