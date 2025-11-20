import { create } from "zustand";
import { useUserStore } from "./UserStore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function computeBlockFlags(currentUser, otherUser) {
  if (!currentUser || !otherUser) {
    return { isCurrentUserBlocked: false, isReceiverBlocked: false };
  }
  return {
    isCurrentUserBlocked: (otherUser.blocked || []).includes(currentUser.id),
    isReceiverBlocked: (currentUser.blocked || []).includes(otherUser.id),
  };
}

export const useChatStore = create((set, get) => ({
  user: null,
  chatId: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  _otherUserUnsub: null,
  typingUsers: {}, // { userId: boolean }

  changeChat: (chatId, user) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser || !user) return;

    const flags = computeBlockFlags(currentUser, user);

    // Clean previous subscription
    const prevUnsub = get()._otherUserUnsub;
    if (prevUnsub) prevUnsub();

    // Subscribe to other user's doc for live block changes
    const userDocRef = doc(db, "users", user.id);
    const unsub = onSnapshot(userDocRef, (snap) => {
      if (!snap.exists()) return;
      const freshUser = { id: snap.id, ...snap.data() };
      const { currentUser: cu } = useUserStore.getState();
      const newFlags = computeBlockFlags(cu, freshUser);
      set({
        user: freshUser,
        isCurrentUserBlocked: newFlags.isCurrentUserBlocked,
        isReceiverBlocked: newFlags.isReceiverBlocked,
      });
    });

    set({
      chatId,
      user,
      isCurrentUserBlocked: flags.isCurrentUserBlocked,
      isReceiverBlocked: flags.isReceiverBlocked,
      _otherUserUnsub: unsub,
    });
  },

  recomputeBlockFlags: () => {
    const { currentUser } = useUserStore.getState();
    const { user } = get();
    const flags = computeBlockFlags(currentUser, user);
    set({
      isCurrentUserBlocked: flags.isCurrentUserBlocked,
      isReceiverBlocked: flags.isReceiverBlocked,
    });
  },

  clearChat: () => {
    const prevUnsub = get()._otherUserUnsub;
    if (prevUnsub) prevUnsub();
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
      _otherUserUnsub: null,
    });
  },

  setTyping: (userId, isTyping) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [userId]: isTyping },
    })),
}));