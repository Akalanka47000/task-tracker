import { removeDockerContainer } from '../__utils__';

export default async () => {
  await new Promise((resolve) => {
    setTimeout(async () => {
      await Promise.allSettled([removeDockerContainer('postgres'), removeDockerContainer('redis')]);
      resolve(true);
    }, 2000); // Allow 2 seconds for async tasks to complete
  });
};
