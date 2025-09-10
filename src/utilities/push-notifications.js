import { urlBase64ToUint8Array } from "./converters";

const NOTIFICATIONS_PUBLIC_KEY = import.meta.env.VITE_NOTIFICATIONS_PUBLIC_KEY;

export async function subscribeToNotifications() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(NOTIFICATIONS_PUBLIC_KEY)
  });

  const token = localStorage.getItem('token') ?? '';

  const uuid = localStorage.getItem('uuid') ?? crypto.randomUUID();

  localStorage.setItem('uuid', uuid);

  await fetch(`/api/notifications/${uuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(subscription)
  });
}

export async function unsubscribeFromNotifications() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  const uuid = localStorage.getItem('uuid') ?? null;

  if (subscription) {
    await subscription.unsubscribe();
  }

  const token = localStorage.getItem('token') ?? '';

  if (!uuid) return;

  await fetch(`/api/notifications/${uuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

}

export async function isSubscribedToNotifications() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  return subscription !== null;
}