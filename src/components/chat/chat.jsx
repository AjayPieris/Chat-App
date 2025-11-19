import React, { useEffect, useState, useRef } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore.js";
import { useUserStore } from "../../lib/UserStore.js";
import { upload } from "../../lib/upload";  // <-- FIX


function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const [img, setImg] = useState({ file: null, url: null });

  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Listen Firestore chat
  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data() || {});
    });

    return () => unSub();
  }, [chatId]);

  const handleEmoji = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // No chat selected
  if (!chatId)
    return <div className="chat empty">Select a chat to start messaging</div>;

  // UPLOAD IMAGE (stub)
  const uploadImage = async (file) => {
  try {
    const url = await upload(file);
    return url;                      // CLOUDINARY IMAGE URL
  } catch (err) {
    console.log("Upload failed", err);
    return null;
  }
};

  // SEND MESSAGE FUNCTION
  const handleSend = async () => {
    if (!text.trim()) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await uploadImage(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      for (const uid of userIDs) {
        const userChatRef = doc(db, "userChats", uid);
        const snap = await getDoc(userChatRef);

        if (snap.exists()) {
          const data = snap.data();
          const chats = [...data.chats];

          const chatIndex = chats.findIndex((c) => c.chatId === chatId);
          if (chatIndex !== -1) {
            chats[chatIndex] = {
              ...chats[chatIndex],
              lastMessage: text,
              isSeen: uid === currentUser.id,
              updatedAt: Date.now(),
            };

            await updateDoc(userChatRef, { chats });
          }
        }
      }

      // reset input
      setText("");
      setImg({ file: null, url: null });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="chat">
      {/* TOP BAR */}
      <div className="top">
        <div className="user">
          <img src="src/assets/public/avatar.png" alt="avatar" />
          <div className="texts">
            <span>{user?.username || "User"}</span>
            <p>Online</p>
          </div>
        </div>

        <div className="icons">
          <img src="./src/assets/public/phone.png" alt="phone" />
          <img src="./src/assets/public/video.png" alt="video" />
          <img src="./src/assets/public/info.png" alt="info" />
        </div>
      </div>

      {/* CHAT CENTER */}
      <div className="center">
        {chat?.messages?.length > 0 ? (
          chat.messages.map((message, index) => (
            <div
              className={`message ${
                message.senderId === currentUser.id ? "own" : ""
              }`}
              key={index}
            >
              <div className="texts">
                {message.img && <img src={message.img} alt="message" />}
                <p>{message.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-msg">No messages yet...</p>
        )}

        {/* Image Preview */}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="preview" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* BOTTOM INPUT BAR */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./src/assets/public/img.png" alt="image" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./src/assets/public/camera.png" alt="camera" />
          <img src="./src/assets/public/mic.png" alt="mic" />
        </div>

        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="emoji">
          <img
            src="./src/assets/public/emoji.png"
            alt="emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
