import { urlBase64ToUint8Array } from "./converters";

const NOTIFICATIONS_PUBLIC_KEY = urlBase64ToUint8Array(import.meta.env.VITE_NOTIFICATIONS_PUBLIC_KEY);


export async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: NOTIFICATIONS_PUBLIC_KEY // Use Uint8Array
  });

  const token = localStorage.getItem('token') || '';

  
  // Send subscription to your backend to store in MongoDB
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    body: JSON.stringify(subscription)
  });
}
