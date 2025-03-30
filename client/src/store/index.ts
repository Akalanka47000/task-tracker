import { resetAnalyticsStore } from './analytics';
import { resetAuthStore } from './auth';
import { resetTaskStore } from './task';
import { resetUserStore } from './user';

export const resetStores = () => {
  resetAnalyticsStore();
  resetAuthStore();
  resetTaskStore();
  resetUserStore();
};
