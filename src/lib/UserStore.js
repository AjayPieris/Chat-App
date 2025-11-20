import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,

  fetchUser: async (uid) => {
    if (!uid) {
      return set({ currentUser: null, isLoading: false });
    }
    set({ isLoading: true });
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.blocked) data.blocked = [];
        set({
          currentUser: { id: docSnap.id, ...data },
          isLoading: false,
        });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ currentUser: null, isLoading: false });
    }
  },

  updateBlockedLocal: (targetUserId, shouldBlock) =>
    set((state) => {
      const prev = state.currentUser;
      if (!prev) return state;
      const existing = prev.blocked || [];
      const updated = shouldBlock
        ? Array.from(new Set([...existing, targetUserId]))
        : existing.filter((id) => id !== targetUserId);
      return {
        ...state,
        currentUser: { ...prev, blocked: updated },
      };
    }),
}));