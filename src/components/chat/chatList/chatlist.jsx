import React, { useEffect, useState } from 'react';
import './chatlist.css';
import AddUser from './addUser/addUser';
import { useUserStore } from '../../../lib/UserStore.js';
import { useChatStore } from '../../../lib/chatStore.js'; // ✅ FIXED IMPORT
import { onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase.js';

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore(); // ✅ GET THE FUNCTION

  useEffect(() => {
    if (!currentUser?.id) return;

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
          user: userDocSnap.data() || {},
        };
      });

      const chatData = await Promise.all(chatPromises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser?.id]);

  // ✅ FIXED: Properly closed function
  const handleSelect = (chat) => {
    changeChat(chat.chatId, chat.user);
  };

  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchbar'>
          <img src='./src/assets/public/search.png' alt='search' />
          <input type='text' placeholder='search' />
        </div>

        <img
          src={addMode ? "./src/assets/public/minus.png" : "./src/assets/public/plus.png"}
          className='add'
          onClick={() => setAddMode(prev => !prev)}
          alt='add'
        />
      </div>

      {chats.length === 0 && (
        <p className='no-chats'>No chats yet</p>
      )}

      {chats.map((chat) => (
        <div
          className='item'
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <img
            src={chat.user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
          />

          <div className='texts'>
            <span>{chat.user?.username}</span>
            <p>{chat.lastMessage || "Say hi 👋"}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser onClose={() => setAddMode(false)} />}
    </div>
  );
}

export default ChatList;
