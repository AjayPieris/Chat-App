import React, { useCallback, useEffect, useState } from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/UserStore";
import { arrayRemove, arrayUnion, updateDoc, doc } from "firebase/firestore";
import SharedPhotos from "./shardPhotos"; // change to "./shardPhotos" if your filename differs
import assets from "../../assets/public/asset";

function Detail() {
  const {
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    recomputeBlockFlags,
    chatId,
  } = useChatStore();
  const { currentUser, updateBlockedLocal } = useUserStore();

  const [openSettings, setOpenSettings] = useState(false);
  const [openFiles, setOpenFiles] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(true);

  useEffect(() => {
    recomputeBlockFlags();
  }, [recomputeBlockFlags]);

  const handleBlock = useCallback(async () => {
    if (!user || !currentUser) return;
    if (isCurrentUserBlocked) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      updateBlockedLocal(user.id, !isReceiverBlocked);
      recomputeBlockFlags();
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  }, [
    user,
    currentUser,
    isReceiverBlocked,
    isCurrentUserBlocked,
    updateBlockedLocal,
    recomputeBlockFlags,
  ]);

  return (
    <div className="detail">
      {/* USER HEADER */}
      <div className="user">
        <img
          src={
            (typeof user?.avatar === "string"
              ? user.avatar
              : user?.avatar?.url) || assets.avatar
          }
          alt="avatar"
        />
        <div className="userText">
          <h2>{user?.username || "User"}</h2>
          <p>
            {isCurrentUserBlocked
              ? "They blocked you"
              : isReceiverBlocked
              ? "You blocked them"
              : "Online"}
          </p>
        </div>
      </div>

      <div className="info">
        <div className="sections">
          {/* SETTINGS */}
          <div className={`sectionCard ${openSettings ? "open" : ""}`}>
            <button
              className="sectionHeader"
              onClick={() => setOpenSettings((o) => !o)}
              aria-expanded={openSettings}
            >
              <span>Chat Settings</span>
              <img
                src={assets.arrowDown}
                alt="toggle"
                className={openSettings ? "arrow rotated" : "arrow"}
              />
            </button>
            <div
              className="sectionBody"
              style={{ height: openSettings ? "auto" : 0 }}
            >
              {openSettings && (
                <div className="settingsRows fadeIn">
                  <label className="settingRow">
                    <input type="checkbox" /> Mute notifications
                  </label>
                  <label className="settingRow">
                    <input type="checkbox" /> Pin conversation
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* SHARED FILES PLACEHOLDER */}
          <div className={`sectionCard ${openFiles ? "open" : ""}`}>
            <button
              className="sectionHeader"
              onClick={() => setOpenFiles((o) => !o)}
              aria-expanded={openFiles}
            >
              <span>Shared Files</span>
              <img
                src={assets.arrowDown}
                alt="toggle"
                className={openFiles ? "arrow rotated" : "arrow"}
              />
            </button>
            <div
              className="sectionBody"
              style={{ height: openFiles ? "auto" : 0 }}
            >
              {openFiles && (
                <div className="placeholder fadeIn">
                  <p>Files coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* SHARED PHOTOS (scrollable) */}
          <div className={`sectionCard photosWrap ${openPhotos ? "open" : ""}`}>
            <button
              className="sectionHeader sticky"
              onClick={() => setOpenPhotos((o) => !o)}
              aria-expanded={openPhotos}
            >
              <span>Shared Photos</span>
              <img
                src={assets.arrowDown}
                alt="toggle"
                className={openPhotos ? "arrow rotated" : "arrow"}
              />
            </button>
            {openPhotos && (
              <div className="photosBody fadeIn">
                <SharedPhotos chatId={chatId} />
              </div>
            )}
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="actionsBar">
          <button
            className="blockBtn"
            onClick={handleBlock}
            disabled={!user || !currentUser || isCurrentUserBlocked}
          >
            {isCurrentUserBlocked
              ? "YOU ARE BLOCKED"
              : isReceiverBlocked
              ? "UNBLOCK USER"
              : "BLOCK USER"}
          </button>
          <button
            className="logoutBtn"
            onClick={() => auth.signOut()}
            title="Sign Out"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detail;
