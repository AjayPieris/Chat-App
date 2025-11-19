import React, { useEffect, useState } from 'react'
import './chatlist.css'
import AddUser from './addUser/addUser'
import { useUserStore } from '../../../lib/UserStore.js';
import { onSnapshot } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase.js';

function ChatList() {

  const [addMode, setAddMode] = useState(false)

  const [chats, setChats] = useState([])

  const { currentUser } = useUserStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id ), async(res) => {
      const items = res.data().chats;

      const promises = items.map( async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();
        return { ...item, user };
      }
      );
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt));
    });
    return () => {
      unSub();
    } 
  }, [currentUser.id]);



  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchbar'>
          <img src='./src/assets/public/search.png'/>
          <input type='text' placeholder='search' />
        </div>
        <img src={ addMode ? "./src/assets/public/plus.png" : "./src/assets/public/minus.png" }className='add'
        onClick={()=>setAddMode((prev)=>!prev)}
        />
      </div>
      {chats.map((chat) => (
      <div className='item' key={chat.chatId}>
        <img src='./src/assets/public/avatar.png'
 alt='avatar'/>
        <div className='texts'>
          <span>Vijay</span>
          <p>{chat.lastMessage}</p>
        </div>
       </div>
     )) }
       {addMode && <AddUser onClose={() => setAddMode(false)} />}
    </div>
  )
}

export default ChatList
