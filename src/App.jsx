import React, { useState } from "react";
import List from "./components/list/list.jsx";
import Detail from "./components/detail/detail.jsx";
import Chat from "./components/chat/chat.jsx";
import Login from "./components/login/login.jsx";
import Notification from "./components/notification/Notification.jsx";

function App() {
  const [user, setUser] = useState(false);

  return (
    <div className="container">
      {user ? (
        <>
          <List />
          <Chat />
          <Detail />
          <Notification />
        </>
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  );
}

export default App;
