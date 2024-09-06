import { create } from 'zustand';

interface ChatBoxStore {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  recipient: number | null;
  onChangeRecipient: (recipient: number | null) => void;
}

export const useChatBox = create<ChatBoxStore>((set: (partial: Partial<ChatBoxStore>) => void) => ({
  open: false,
  onChangeOpen: (open: boolean) => set({ open }),
  recipient: null,
  onChangeRecipient: (recipient: number | null) => set({ recipient })
}));
