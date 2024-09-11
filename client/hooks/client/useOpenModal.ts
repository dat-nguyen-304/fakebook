import { create } from 'zustand';

interface OpenModalStore {
  modalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
}

export const useOpenModal = create<OpenModalStore>((set: (partial: Partial<OpenModalStore>) => void) => ({
  modalOpen: false,
  onModalOpen: () => set({ modalOpen: true }),
  onModalClose: () => set({ modalOpen: false })
}));
