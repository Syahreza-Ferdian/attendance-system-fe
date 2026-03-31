import type { UserRoleType } from "@/types/user/user-role.types";
import type { User } from "@/types/user/user.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: User | null;
  role: UserRoleType | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ token, user, role: user.role.name, isAuthenticated: true });
      },

      clearAuth: () => {
        set({ token: null, user: null, role: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updatedUser } });
        }
      },
    }),
    {
      name: "absensi-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
