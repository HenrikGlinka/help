import express, { request, Router } from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import authenticationMiddleware from './authentication.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendNotification } from "./notifications.js";

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
            role: 'user',
        };

        if (inviteData.group) newUser.group = inviteData.group;
        if (inviteData.role) newUser.role = inviteData.role;

        await userCollection.insertOne(newUser);

        await inviteCollection.deleteOne({ code: invite });

        response.status(201).json({ message: 'Bruger registreret med succes' });

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

        const token = jwt.sign({
            user: {
                id: userData._id,
                username: userData.username,
                role: userData.role,
                group: userData.group,
            }
        }, process.env.JWT_SECRET, { expiresIn: '12h' });

        response.json({ token });
    });
});

router.get('/users/me', async (request, response) => {

    try {
        const token = request.headers.authorization?.split(' ')[1];
        const { user } = jwt.verify(token, process.env.JWT_SECRET);
        response.json({ user });
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? `Token udløbet den ${error.expiredAt}` : 'Ugyldigt token';
        response.status(401).json({ error: message });
    }
});

router.get('/users/me/refresh', authenticationMiddleware, async (request, response) => {
try {

        const token = request.headers.authorization?.split(' ')[1];
        const { user } = jwt.verify(token, process.env.JWT_SECRET);

        const database = client.db(DB_NAME);
        const collection = database.collection('users');

        const userData = await collection.findOne({ username: user.username.toLowerCase() });
        
        if (!userData) {
            return response.status(401).json({ error: 'Ugyldig bruger.' });
        }

        const newToken = jwt.sign({
            user: {
                id: userData._id,
                username: userData.username,
                role: userData.role,
                group: userData.group,
            }
        }, process.env.JWT_SECRET, { expiresIn: '12h' });

        response.json({ token: newToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
});

router.put('/users/:id/group', authenticationMiddleware, async (request, response) => {
    const userId = request.params.id;
    if (request.user.role !== 'admin') {
        return response.status(403).json({ error: 'Du har ikke adgang til denne ressource.' });
    }

    request.on('data', async data => {
        const { group } = JSON.parse(data.toString());
        if (!group) return response.status(400).json({ error: 'Gruppe er påkrævet.' });

        const database = client.db(DB_NAME);
        const collection = database.collection('users');

        const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { group } });

        if (result.modifiedCount === 0) {
            return response.status(404).json({ error: 'Bruger ikke fundet.' });
        }

        response.json({ message: 'Brugergruppe opdateret med succes.' });
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
        response.status(500).json({ error: 'Intern serverfejl' });
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
        response.status(500).json({ error: 'Intern serverfejl' });
    } finally {

    }
});


router.get('/requests/:group/open', authenticationMiddleware, async (request, response) => {
    try {

        const group = request.params.group;
        const database = client.db(DB_NAME);
        const collection = database.collection('requests');

        console.log(`Looking for group: "${group}"`);

        const query = { completion_date: { $exists: false } };

        if (group !== 'all') query.group = group;

        const requests = await collection.find(query).toArray();

        console.log(`Found ${requests.length} requests for group "${group}"`);
        console.log(query);



        requests.forEach(result => {
            result.isOwner = result.user_id.toString() === request.user.id;
            result.isAdmin = request.user.role === 'admin';
        });

        response.json(requests);
    } catch (error) {
        console.error('Error fetching open requests:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    } finally {

    }
});

router.get('/groups/all', authenticationMiddleware, async (request, response) => {
    try {
        if (request.user.role !== 'admin') {
            return response.status(403).json({ error: 'Du har ikke adgang til denne ressource.' });
        }

        const database = client.db(DB_NAME);
        const collection = database.collection('users');
        const groups = await collection.distinct('group', { group: { $exists: true, $ne: null } });
        response.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
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

            if (request.user.group) newRequest.group = request.user.group.toLowerCase();

            const result = await collection.insertOne(newRequest);

            const admins = await database.collection('users').find({ role: 'admin' }).toArray();

            console.log('Notifying admins about new request:', admins.map(a => a._id.toString()));

            for (const admin of admins) {

                if (admin.group === 'all' || request.user.group === admin.group) {
                    const username = request.user.username.charAt(0).toUpperCase() + request.user.username.slice(1);
                    await sendNotification(admin._id.toString(), `Nyt spørgsmål fra ${username}`, title);
                }
            }

            response.status(201).json(result);
        } catch (error) {
            console.error('Error creating request:', error);
            response.status(500).json({ error: 'Intern serverfejl' });
        }
        finally {

        }
    });
});

router.put('/requests/:id/start', authenticationMiddleware, async (request, response) => {
    const requestId = request.params.id;

    if (!requestId) return response.status(400).json({ error: 'Anmodnings-ID er påkrævet.' });
    if (!ObjectId.isValid(requestId)) return response.status(400).json({ error: 'Ugyldigt anmodnings-ID format.' });
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
            return response.status(404).json({ error: 'Anmodning ikke fundet eller allerede startet.' });
        }

        const userId = (await collection.findOne({ _id: new ObjectId(requestId) })).user_id.toString();
        const adminName = request.user.username.charAt(0).toUpperCase() + request.user.username.slice(1);

        await sendNotification(userId, `${adminName} er på vej for at hjælpe dig!`);
        response.status(200).json({ message: 'Anmodning markeret som startet.' });
    } catch (error) {
        console.error('Error starting request:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
    finally {

    }
});


router.put('/requests/:id/complete', authenticationMiddleware, async (request, response) => {
    const requestId = request.params.id;

    if (!requestId) return response.status(400).json({ error: 'Anmodnings-ID er påkrævet.' });
    if (!ObjectId.isValid(requestId)) return response.status(400).json({ error: 'Ugyldigt anmodnings-ID format.' });



    try {

        const database = client.db(DB_NAME);
        const collection = database.collection('requests');

        const existingRequest = await collection.findOne({ _id: new ObjectId(requestId) });
        if (!existingRequest) return response.status(404).json({ error: 'Anmodning ikke fundet.' });
        if (existingRequest.user_id.toString() !== request.user.id && request.user.role !== 'admin') {
            return response.status(403).json({ error: 'Du har ikke rettigheder til at fuldføre denne anmodning.' });
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
            return response.status(404).json({ error: 'Anmodning ikke fundet eller allerede fuldført.' });
        }
        response.status(200).json({ message: 'Anmodning markeret som fuldført.' });
    } catch (error) {
        console.error('Error completing request:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
    finally {

    }
});

router.post('/notifications/:uuid', authenticationMiddleware, async (request, response) => {

    request.on('data', async data => {

        const uuid = request.params.uuid;
        const userId = new ObjectId(request.user.id);

        if (!uuid) return response.status(400).json({ error: 'UUID er påkrævet.' });

        const subscription = JSON.parse(data.toString());

        // Save the subscription to the database
        const database = client.db(DB_NAME);
        const collection = database.collection('push_subscriptions');

        await collection.insertOne({ uuid, user_id: userId, subscription });

        response.status(201).json({ message: 'Abonnement gemt med succes.' });
    });
});

router.delete('/notifications/:uuid', authenticationMiddleware, async (request, response) => {
    const uuid = request.params.uuid;
    if (!uuid) return response.status(400).json({ error: 'UUID er påkrævet.' });
    try {
        const database = client.db(DB_NAME);
        const collection = database.collection('push_subscriptions');
        const result = await collection.deleteOne({ uuid });
        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Abonnement ikke fundet.' });
        }
        response.status(200).json({ message: 'Abonnement slettet med succes.' });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
});

router.get('/notifications/:uuid', async (request, response) => {
    const uuid = request.params.uuid;
    if (!uuid) return response.status(400).json({ error: 'UUID er påkrævet.' });
    try {

        const database = client.db(DB_NAME);
        const collection = database.collection('push_subscriptions');
        const subscription = await collection.findOne({ 'subscription.uuid': uuid });

        if (!subscription) {
            return response.status(404).json({ error: 'Abonnement ikke fundet.' });
        }

        return response.json(subscription.subscription);

    } catch (error) {
        console.error('Error fetching subscription by UUID:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
});

router.get('/invites', authenticationMiddleware, async (request, response) => {

    if (request.user.role !== 'admin') {
        return response.status(403).json({ error: 'Du har ikke adgang til denne ressource.' });
    }

    try {
        const database = client.db(DB_NAME);
        const collection = database.collection('invites');
        const invites = await collection.find().toArray();
        response.status(200).json(invites);
    } catch (error) {
        console.error('Error fetching invites:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
});

router.post('/invites', authenticationMiddleware, async (request, response) => {

    if (request.user.role !== 'admin') {
        return response.status(403).json({ error: 'Du har ikke adgang til denne ressource.' });
    }

    request.on('data', async data => {
        const { code, group, role } = JSON.parse(data.toString());

        if (!code) return response.status(400).json({ error: 'Invitationskode er påkrævet.' });
        if (!group) return response.status(400).json({ error: 'Gruppe er påkrævet.' });
        if (!role) return response.status(400).json({ error: 'Rolle er påkrævet.' });

        if (role !== 'user' && role !== 'admin') {
            return response.status(400).json({ error: 'Rolle skal være enten "user" eller "admin".' });
        }

        const database = client.db(DB_NAME);
        const collection = database.collection('invites');

        const existingInvite = await collection.findOne({ code });
        if (existingInvite) {
            return response.status(400).json({ error: 'Invitationskode eksisterer allerede.' });
        }

        const result = await collection.insertOne({ code, group, role });
        response.status(201).json({ message: 'Invitation oprettet med succes.', inviteId: result.insertedId });
    });
});

router.delete('/invites/:id', authenticationMiddleware, async (request, response) => {

    if (request.user.role !== 'admin') {
        return response.status(403).json({ error: 'Du har ikke adgang til denne ressource.' });
    }
    const inviteId = request.params.id;

    if (!inviteId) return response.status(400).json({ error: 'Invitations-ID er påkrævet.' });
    if (!ObjectId.isValid(inviteId)) return response.status(400).json({ error: 'Ugyldigt invitations-ID format.' });

    try {
        const database = client.db(DB_NAME);
        const collection = database.collection('invites');
        const result = await collection.deleteOne({ _id: new ObjectId(inviteId) });
        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Invitation ikke fundet.' });
        }
        response.status(200).json({ message: 'Invitation slettet med succes.' });
    } catch (error) {
        console.error('Error deleting invite:', error);
        response.status(500).json({ error: 'Intern serverfejl' });
    }
});
