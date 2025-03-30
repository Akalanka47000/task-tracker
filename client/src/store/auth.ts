import { create, StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthSlice {
  profile?: IUser;
  setProfile: (user: IUser) => void;
  registeredFCMToken?: string;
  setRegisteredFCMToken: (token: string) => void;
}

const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  profile: undefined,
  setProfile: (profile) => set({ profile }),
  registeredFCMToken: undefined,
  setRegisteredFCMToken: (token) => set({ registeredFCMToken: token })
});

export const useAuthStore = create<AuthSlice>()(
  devtools(
    persist(createAuthSlice, {
      name: 'auth-store',
      partialize: (state) => ({ profile: state.profile, registeredFCMToken: state.registeredFCMToken }),
      storage: createJSONStorage(() => localStorage)
    })
  )
);

const initialState = useAuthStore.getState();

export const resetAuthStore = () =>
  useAuthStore.setState({
    ...initialState,
    profile: undefined,
    registeredFCMToken: undefined
  });
