import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import authenticationMiddleware from './authentication.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const PORT = process.env.SERVER_PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);


const client = new MongoClient(MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());


app.post('/api/users/register', async (request, response) => {
    const { invite, username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ error: 'Brugernavn og adgangskode er påkrævet' });
    }

    await client.connect();

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
    await client.close();
});

app.post('/api/users/login', async (request, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ error: 'Brugernavn og adgangskode er påkrævet.' });
    }

    await client.connect();

    const database = client.db(DB_NAME);
    const collection = database.collection('users');

    const userData = await collection.findOne({ username: username.toLowerCase() });
    const isValidPassword = userData ? await bcrypt.compare(password, userData.password_hash) : false;

    if (!userData || !isValidPassword) {
        return response.status(401).json({ error: 'Ugyldigt brugernavn eller adgangskode.' });
    }

    const token = jwt.sign({ user: { id: userData._id, username: userData.username } }, process.env.JWT_SECRET, { expiresIn: '12h' });

    response.json({ token });
    await client.close();

});

app.get('/api/requests/all', authenticationMiddleware, async (_, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');
        const requests = await collection.find().toArray();

        response.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/api/requests/open', authenticationMiddleware, async (request, response) => {
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

        response.json(requests);
    } catch (error) {
        console.error('Error fetching open requests:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


app.get('/api/requests/all/open', authenticationMiddleware, async (request, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');
        const requests = await collection.find({ completion_date: { $exists: false } }).toArray();

        response.json(requests);
    } catch (error) {
        console.error('Error fetching open requests:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.post('/api/requests', authenticationMiddleware, async (request, response) => {
    const { title, description } = request.body;
    if (!title || !description) {
        return response.status(400).json({ error: 'Titel og beskrivelse er påkrævet.' });
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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
