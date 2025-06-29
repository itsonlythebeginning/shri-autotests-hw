import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      aggregateHistory: [],
      addHistoryEntry: (item) =>
        set((state) => ({
          aggregateHistory: [...state.aggregateHistory, item],
        })),
      resetHistory: () => set({ aggregateHistory: [] }),
      removeHistoryEntry: (id) =>
        set((state) => ({
          aggregateHistory: state.aggregateHistory.filter(
            (item) => item.id !== id
          ),
        })),
    }),
    {
      name: 'aggregate-history-store',
    }
  )
);

export default useAppStore;
