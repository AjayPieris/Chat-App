import React, { useEffect, useState, useMemo } from "react";
import "./chatlist.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/UserStore";
import { useChatStore } from "../../../lib/chatStore";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const { currentUser, isLoading } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id || isLoading) return;

    const userChatRef = doc(db, "userChats", currentUser.id);
    const unSub = onSnapshot(userChatRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setChats([]);
        return;
      }
      const items = snapshot.data().chats || [];
      const chatPromises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        return {
          ...item,
          user: userDocSnap.exists()
            ? { id: userDocSnap.id, ...userDocSnap.data() }
            : null,
        };
      });
      const chatData = await Promise.all(chatPromises);
      setChats(
        chatData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      );
    });

    return () => unSub();
  }, [currentUser?.id, isLoading]);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    return chats.filter((c) =>
      (c.user?.username || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );
  }, [search, chats]);

  const handleSelect = (chat) => {
    if (!chat?.user) return;
    changeChat(chat.chatId, chat.user);
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchbar">
          <img src="./src/assets/public/search.png" alt="search" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <img
          src={
            addMode
              ? "./src/assets/public/minus.png"
              : "./src/assets/public/plus.png"
          }
          className="add"
            onClick={() => setAddMode((prev) => !prev)}
          alt="add"
        />
      </div>

      {filteredChats.length === 0 && (
        <p className="no-chats">No chats {search ? "match search" : "yet"}</p>
      )}

      {filteredChats.map((chat) => {
        const active = chat.chatId === chatId;
        return (
          <div
            className={`item ${active ? "active" : ""}`}
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
          >
            <img
              src={chat.user?.avatar || "/default-avatar.png"}
              alt="User Avatar"
            />
            <div className="texts">
              <span>{chat.user?.username || "Unknown"}</span>
              <p className={chat.isSeen ? "" : "unread"}>
                {chat.lastMessage || "Say hi 👋"}
              </p>
            </div>
            {!chat.isSeen && <span className="badge">•</span>}
          </div>
        );
      })}

      {addMode && <AddUser onClose={() => setAddMode(false)} />}
    </div>
  );
}

export default ChatList;