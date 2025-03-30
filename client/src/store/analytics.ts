import { EmployeeDepartment } from '@shared/constants';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AnalyticsSlice {
  selectedDepartment?: EmployeeDepartment;
  setSelectedDepartment: (arg: EmployeeDepartment) => void;
}

const createAnalyticsSlice: StateCreator<AnalyticsSlice> = (set) => ({
  selectedDepartment: undefined,
  setSelectedDepartment: (arg) => set({ selectedDepartment: arg })
});

export const useAnalyticsStore = create<AnalyticsSlice>()(devtools(createAnalyticsSlice));

const initialState = useAnalyticsStore.getState();

export const resetAnalyticsStore = () => useAnalyticsStore.setState(initialState);
