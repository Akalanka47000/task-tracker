import { moduleLogger } from '@sliit-foss/module-logger';
import admin from 'firebase-admin';

const logger = moduleLogger('FCM');

/**
 * @description Sends a notification to a single user
 */
export function sendPushNotification(token: string, title: string, body: string) {
  return admin
    .messaging()
    .send({
      data: {
        title,
        body
      },
      token
    })
    .catch(() => {
      logger.warn(`Failed to send push notification to token - ${token}`);
    });
}

/**
 * @description Sends a notification with a topic as its base
 */
export function sendPushNotificationToTopic(topic: string, title: string, body: string) {
  return admin
    .messaging()
    .send({
      data: {
        title,
        body
      },
      topic
    })
    .catch(() => {
      logger.warn(`Failed to send push notification to topic - ${topic}`);
    });
}
