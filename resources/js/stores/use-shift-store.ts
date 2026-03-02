import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShiftState {
    activeShift: any | null;
    isLoading: boolean;
    setActiveShift: (shift: any | null) => void;
    fetchStatus: () => Promise<void>;
}

export const useShiftStore = create<ShiftState>()(
    persist(
        (set) => ({
            activeShift: null,
            isLoading: false,
            setActiveShift: (shift) => set({ activeShift: shift }),
            fetchStatus: async () => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/shifts/status');
                    const data = await response.json();
                    set({ activeShift: data.shift, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch shift status', error);
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'pos-shift-storage',
        },
    ),
);
