import { create } from 'zustand';

export enum Tabs {
  HOME = 1,
  FRIEND = 2
}

interface TabStore {
  tab: Tabs | null;
  onChangeTab: (tab: Tabs | null) => void;
}

export const useTab = create<TabStore>((set: (partial: Partial<TabStore>) => void) => ({
  tab: Tabs.HOME,
  onChangeTab: (tab: Tabs | null) => set({ tab })
}));
