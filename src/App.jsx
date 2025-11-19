import React, { useState, useEffect, use } from "react";
import List from "./components/list/list.jsx";
import Detail from "./components/detail/detail.jsx";
import Chat from "./components/chat/chat.jsx";
import Login from "./components/login/login.jsx";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from './lib/firebase.js'
import { useUserStore } from "./lib/UserStore.js";


function App() {

  const {currentUser, fetchUser, isLoading} = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUser(user?.uid);
    });
    return () => {
      unSub();
    }
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
        { currentUser ? (
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
