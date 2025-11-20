import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./addUser.css";
import {
  collection,
  getDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase.js";
import { useUserStore } from "../../../../lib/UserStore.js";
import { ToastContainer, toast } from "react-toastify";
import assets from "../../../../assets/public/asset";

function AddUser({ onClose }) {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  // 🔍 SEARCH USER BY USERNAME (Case-insensitive)
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username").toLowerCase();

    setLoading(true);
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username_lower", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUser({
          id: userDoc.id,
          ...userDoc.data(),
        });
      } else {
        setUser(null);
        alert("User not found");
      }
    } catch (error) {
      console.error("Error searching user: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!user) return;

    try {
      const otherUserChatDoc = doc(db, "userChats", user.id);
      const myUserChatDoc = doc(db, "userChats", currentUser.id);

      // Create docs if missing
      if (!(await getDoc(otherUserChatDoc)).exists()) {
        await setDoc(otherUserChatDoc, { chats: [] });
      }
      if (!(await getDoc(myUserChatDoc)).exists()) {
        await setDoc(myUserChatDoc, { chats: [] });
      }

      // Fetch current chats
      const myChatsSnap = await getDoc(myUserChatDoc);
      const myChats = myChatsSnap.data().chats || [];

      // Check if chat already exists with this user
      const exists = myChats.some((chat) => chat.receiverId === user.id);

      if (exists) {
        toast.error("Chat with this user already exists!");
        return;
      }

      // Create a new chat document
      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Add chat to both users
      await updateDoc(otherUserChatDoc, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(myUserChatDoc, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      toast.success("User added successfully!");
      onClose();
      setUser(null);
    } catch (error) {
      console.error("Error adding user to chat:", error);
      toast.error("Failed to add user to chat.");
    }
  };

  // PORTAL UI
  const content = (
    <div className="addUser-overlay" role="dialog" aria-modal="true">
      <div className="addUser-card">
        <div className="addUser-header">
          <h3>Add user</h3>
          <button className="addUser-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSearch} className="addUser-form">
          <input type="text" name="username" placeholder="Enter username" />
          <button type="submit">{loading ? "Searching..." : "Search"}</button>
        </form>

        {/* Show user result */}
        {user && (
          <div className="user">
            <div className="detail">
              <img
                src={
                  (typeof user?.avatar === "string"
                    ? user.avatar
                    : user?.avatar?.url) || assets.avatar
                }
                alt="User Avatar"
              />
              <span>{user.username}</span>
            </div>

            <button onClick={handleAdd}>Add User</button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

export default AddUser;
