
import { create } from 'zustand';

interface ApplicationState {
  selectedApplications: string[];
  setSelectedApplications: (ids: string[]) => void;
  toggleApplicationSelection: (id: string) => void;
  clearSelection: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  selectedApplications: [],
  setSelectedApplications: (ids) => set({ selectedApplications: ids }),
  toggleApplicationSelection: (id) => 
    set((state) => ({
      selectedApplications: state.selectedApplications.includes(id)
        ? state.selectedApplications.filter(appId => appId !== id)
        : [...state.selectedApplications, id]
    })),
  clearSelection: () => set({ selectedApplications: [] })
}));
