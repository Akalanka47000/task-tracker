import { moduleLogger } from '@sliit-foss/module-logger';
import { default as admin } from 'firebase-admin';
import { Config } from '@/config';

const logger = moduleLogger('Firebase');

export * from './push-notifications';

try {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(Buffer.from(Config.FIREBASE_SERVICE_ACCOUNT ?? '', 'base64').toString('utf8'))
    )
  });
  logger.info('Firebase admin app initialized successfully');
} catch (e) {
  logger.warn('Failed to initialize Firebase admin app', e);
}
