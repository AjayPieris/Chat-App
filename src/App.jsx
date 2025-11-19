import React, { useState, useEffect } from "react";
import List from "./components/list/list.jsx";
import Detail from "./components/detail/detail.jsx";
import Chat from "./components/chat/chat.jsx";
import Login from "./components/login/login.jsx";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from './lib/firebase.js'


function App() {
  const [user, setUser] = useState(false);

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user)
    });
    return () => {
      unSub();
    }
  }, []);

  return (
    <div className="container">
        { user ? (
          <>
          <List />
          <Chat />
          <Detail />
          </>
        ) : (
          <Login />
        )}
          
    </div>
  );
}

export default App;
