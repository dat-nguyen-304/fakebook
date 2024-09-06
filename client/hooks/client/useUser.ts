import { User } from '@/types';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  onChangeUser: (user: User | null) => void;
}

export const useUser = create<UserStore>((set: (partial: Partial<UserStore>) => void) => ({
  user: null,
  onChangeUser: (user: User | null) => set({ user })
}));
