import { create } from "zustand";                     // import zustand
import { doc, getDoc } from "firebase/firestore";    // firebase read functions
import { db } from "./firebase.js";                  // your firestore instance

export const useUserStore = create((set) => ({       // create a zustand store
  currentUser: null,                                 // store logged-in user data
  isLoading: true,                                   // loading state for UI

  fetchUser: async (uid) => {                        // function to get user data
    if (!uid)                                        // if no UID given
      return set({ currentUser: null, isLoading: false });  

    set({ isLoading: true });                        // start loading

    try {
      const docRef = doc(db, "users", uid);          // reference to users/{uid}
      const docSnap = await getDoc(docRef);          // fetch the document

      if (docSnap.exists()) {                        // if user found in firestore
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {                                       
        console.log("No such document!");            // no user found
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error); // if fetch fails
      set({ currentUser: null, isLoading: false });  // clear user + stop loading
    }
  },
}));
