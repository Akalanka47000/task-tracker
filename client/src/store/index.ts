import { resetAuthStore } from './auth';
import { resetTaskStore } from './task';
import { resetUserStore } from './user';

export const resetStores = () => {
  resetAuthStore();
  resetTaskStore();
  resetUserStore();
};
