
import { create } from 'zustand';

interface UIState {
  // Modal states
  activeModal: string | null;
  modalData: unknown;
  
  // Theme and preferences
  isDarkMode: boolean;
  sidebarCollapsed: boolean;
  
  // UI actions
  setActiveModal: (modal: string | null, data?: unknown) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  activeModal: null,
  modalData: null,
  isDarkMode: false,
  sidebarCollapsed: false,
  
  // Actions
  setActiveModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

