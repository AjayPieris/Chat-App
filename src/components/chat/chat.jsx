import React, { useEffect, useState, useRef, useCallback } from "react";
import "./chat.css";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/UserStore";
import { upload } from "../../lib/upload";
import assets from "../../public/asset";

function Chat() {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const [img, setImg] = useState({ file: null, url: null });

  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    recomputeBlockFlags,
  } = useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);

  // Old-style emoji look: TWITTER (Twemoji) or NATIVE
  const EMOJI_STYLE = EmojiStyle.TWITTER;

  const handleEmoji = (emojiData) => {
    setText((prev) => prev + (emojiData?.emoji || ""));
    setOpenEmoji(false);
  };

  // Auto scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Listen to the chat document
  useEffect(() => {
    if (!chatId) {
      setChat(null);
      return;
    }
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data() || { messages: [] });
    });
    return () => unSub();
  }, [chatId]);

  const uploadImage = async (file) => {
    try {
      return await upload(file); // may return string URL or an object with { url, ... }
    } catch (err) {
      console.log("Upload failed", err);
      return null;
    }
  };

  const handleSend = useCallback(async () => {
    if (!text.trim()) return;
    if (isCurrentUserBlocked || isReceiverBlocked) return;

    let uploadedImg = null;

    try {
      if (img.file) {
        uploadedImg = await uploadImage(img.file);
      }

      const messageObj = {
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
      };

      // Support both string URL and object payload from upload()
      if (uploadedImg) {
        messageObj.img = uploadedImg.url ? uploadedImg : uploadedImg;
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(messageObj),
      });

      // Update chat previews in userChats for both users
      const userIDs = [currentUser.id, user.id];
      for (const uid of userIDs) {
        const userChatRef = doc(db, "userChats", uid);
        const snap = await getDoc(userChatRef);
        if (snap.exists()) {
          const data = snap.data();
          const chats = [...(data.chats || [])];
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

      setText("");
      setImg({ file: null, url: null });
      recomputeBlockFlags();
    } catch (err) {
      console.log(err);
    }
  }, [
    text,
    img,
    chatId,
    currentUser?.id,
    user?.id,
    isCurrentUserBlocked,
    isReceiverBlocked,
    recomputeBlockFlags,
  ]);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const removePreview = () =>
    setImg({
      file: null,
      url: null,
    });

  if (!chatId) {
    return (
      <div className="chat empty">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  const isBlocked = isCurrentUserBlocked || isReceiverBlocked;

  return (
    <div className={`chat ${isBlocked ? "blocked" : ""}`}>
      {/* TOP BAR */}
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "/default-avatar.png"} alt="avatar" />
          <div className="texts">
            <span>{user?.username || "User"}</span>
            <p>
              {isCurrentUserBlocked
                ? "You are blocked by this user"
                : isReceiverBlocked
                ? "You blocked this user"
                : "Online"}
            </p>
          </div>
        </div>
        <div className="icons">
          <img src={assets.phone} alt="phone" />
          <img src="./src/assets/public/video.png" alt="video" />
          <img src="./src/assets/public/info.png" alt="info" />
        </div>
      </div>

      {/* CHAT CENTER */}
      <div className="center">
        {chat?.messages?.length > 0 ? (
          chat.messages.map((message, index) => {
            const own = message.senderId === currentUser.id;
            const imgSrc =
              typeof message.img === "string"
                ? message.img
                : message.img?.url;
            return (
              <div className={`message ${own ? "own" : ""}`} key={index}>
                <div className="texts">
                  {imgSrc && <img src={imgSrc} alt="message" />}
                  <p>{message.text}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-msg">No messages yet...</p>
        )}

        {/* Image Preview */}
        {img.url && (
          <div className="message own preview">
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
            onChange={handleImg}
            disabled={isBlocked}
          />
          <img src="./src/assets/public/camera.png" alt="camera" />
          <img src="./src/assets/public/mic.png" alt="mic" />
        </div>

        <div className="inputWrap">
          <input
            type="text"
            placeholder={
              isCurrentUserBlocked
                ? "You are blocked by this user"
                : isReceiverBlocked
                ? "You blocked this user"
                : "Type a message"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isBlocked}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="emoji">
            <img
              src="./src/assets/public/emoji.png"
              alt="emoji"
              onClick={() => setOpenEmoji((prev) => !prev)}
            />
            {openEmoji && (
              <div className="picker">
                <EmojiPicker
                  onEmojiClick={handleEmoji}
                  emojiStyle={EMOJI_STYLE}
                  theme={Theme.DARK}
                  lazyLoadEmojis
                  searchDisabled={true}
                  skinTonesDisabled={false}
                  autoFocusSearch={false}
                />
              </div>
            )}
          </div>
        </div>

        <button
          className="sendButton"
          onClick={handleSend}
          disabled={!text.trim() || isBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;