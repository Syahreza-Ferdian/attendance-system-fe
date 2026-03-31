import { create } from "zustand";

interface UIState {
  isSidebarExpand: boolean;
  toggleSidebar: () => void;
  setSidebarExpand: (val: boolean) => void;
}

const useUIStore = create<UIState>((set) => ({
  isSidebarExpand: true,

  toggleSidebar: () =>
    set((state) => ({ isSidebarExpand: !state.isSidebarExpand })),

  setSidebarExpand: (val) => set({ isSidebarExpand: val }),
}));

export default useUIStore;
