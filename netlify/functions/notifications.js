import { MongoClient } from 'mongodb';
import webPush from 'web-push';


const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'help';

const client = new MongoClient(MONGODB_URI);

const VAPID_CONTACT_EMAIL = process.env.VITE_CONTACT_EMAIL;
const VAPID_PUBLIC_KEY = process.env.VITE_NOTIFICATIONS_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.NOTIFICATIONS_PRIVATE_KEY;

webPush.setVapidDetails(VAPID_CONTACT_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function sendNotification(userId, title, message) {

    if (!MONGODB_URI) {
        console.error('MONGODB_URI environment variable is not set');
        return;
    }

    const database = client.db(DB_NAME);
    const collection = database.collection('subscriptions');

    const subscriptions = await collection.find({ userId }).toArray();

    if (!subscriptions || subscriptions.length === 0) {
        console.log('No subscriptions found for user:', userId);
        return;
    }

    for (const entry of subscriptions) {
        try {
            await webPush.sendNotification(entry.subscription, JSON.stringify({ title, message }));
            console.log('Notification sent to user:', userId);
        } catch (error) {
            console.error('Error sending notification to user:', userId, error);

            if (error.statusCode === 410 || error.statusCode === 404) {
                await collection.deleteOne({ _id: entry._id });
                console.log('Deleted invalid subscription for user:', userId);
            }
        }
    }
}
