import React from "react";
import "./userinfo.css";
import { useUserStore } from "../../../lib/UserStore.js";
import assets from "../../../assets/public/asset.js";

function UserInfo() {
  const { currentUser } = useUserStore();
  return (
    <div className="userinfo">
      <div className="user">
        <img
          src={
            (typeof currentUser?.avatar === "string"
              ? currentUser.avatar
              : currentUser?.avatar?.url) || assets.avatar
          }
          alt="avatar"
        />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src={assets.more} alt="more" />
        <img src={assets.video} alt="video" />
        <img src={assets.edit} alt="edit" />
      </div>
    </div>
  );
}

export default UserInfo;
