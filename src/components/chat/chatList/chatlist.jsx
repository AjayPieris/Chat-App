import React, { useEffect, useState } from 'react';
import './chatlist.css';
import AddUser from './addUser/addUser';
import { useUserStore } from '../../../lib/UserStore.js';
import { onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase.js';

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser?.id) return; // Wait until currentUser exists

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

      {chats.map((chat) => (
        <div className='item' key={chat.chatId}>
          <img src={chat.user?.avatar || "/default-avatar.png"} alt="User Avatar" />
          <div className='texts'>
            <span>{chat.user?.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser onClose={() => setAddMode(false)} />}
    </div>
  );
}

export default ChatList;
