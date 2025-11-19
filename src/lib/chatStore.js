import { create } from "zustand";
import { useUserStore } from "./UserStore"; // <-- import your user store

export const useChatStore = create((set, get) => ({
  user: null,
  chatId: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const { currentUser } = useUserStore.getState(); // FIXED

    if (!currentUser || !user) return;

    // If the other user has blocked the current user
    if (user.blocked?.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // If current user has blocked the receiver
    if (currentUser.blocked?.includes(user.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }

    // Both users not blocked → open chat
    set({
      chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },

  changeBlock: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));
