import { getMessaging, onMessage } from 'firebase/messaging';
import { addToast } from '@heroui/react';
import { app } from './app';

export const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  addToast({
    title: payload.data?.title,
    description: payload.data?.body,
    color: 'primary',
    variant: 'flat',
    timeout: 6000
  });
});
