import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging, notificationService } from '@/services';
import { useAuthStore } from '@/store/auth';

export function useNotificationPermissions() {
  const profile = useAuthStore((state) => state.profile);
  const registeredFCMToken = useAuthStore((state) => state.registeredFCMToken);
  const setRegisteredFCMToken = useAuthStore((state) => state.setRegisteredFCMToken);

  useEffect(() => {
    if (profile?.id && !registeredFCMToken) {
      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
          const token = await getToken(messaging);
          console.info('Notification permission granted.', token);
          if (token !== registeredFCMToken) {
            notificationService.registerDevice({ data: { token } });
            setRegisteredFCMToken(token);
          }
        }
      });
    }
  }, [registeredFCMToken, profile?.id]);
}
