import { create } from "zustand";

interface PaginationFilterState {
  offset: number;
  total: number;
  // limit: number;

  setOffset: (value: number) => void;
  settotal: (value: number) => void;
  // setLimit: (value: number) => void;
}

export const usePaginationStore = create<PaginationFilterState>((set) => ({
  offset: 0,
  total: 1,
  // limit: 10,

  setOffset: (value) => set({ offset: value }),
  settotal: (value) => set({ total: value }),
  // // setLimit: (value) => set({ limit: value }),
}));
