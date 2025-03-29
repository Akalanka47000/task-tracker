import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserSlice {
  selectedUser?: IUser;
  isUserDialogOpen: boolean;
  isUserDeleteDialogOpen: boolean;
  openUserDialogWithSelector: (arg?: IUser) => void;
  openUserDeleteDialogWithSelector: (arg: IUser) => void;
  setIsUserDialogOpen: (arg: boolean) => void;
  setIsUserDeleteDialogOpen: (arg: boolean) => void;
}

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  selectedUser: undefined,
  isUserDialogOpen: false,
  isUserDeleteDialogOpen: false,
  openUserDialogWithSelector: (arg) => set({ selectedUser: arg, isUserDialogOpen: true }),
  openUserDeleteDialogWithSelector: (arg) => set({ selectedUser: arg, isUserDeleteDialogOpen: true }),
  setIsUserDialogOpen: (arg) => set({ isUserDialogOpen: arg, ...(arg ? {} : { selectedUser: undefined }) }),
  setIsUserDeleteDialogOpen: (arg) => set({ isUserDeleteDialogOpen: arg, ...(arg ? {} : { selectedUser: undefined }) })
});

export const useUserStore = create<UserSlice>()(devtools(createUserSlice));

const initialState = useUserStore.getState();

export const resetUserStore = () => useUserStore.setState(initialState);
