import React, { useState } from "react";
import assets from "../../assets/public/asset";
import { ToastContainer, toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUserStore } from "../../lib/UserStore.js";



import "./login.css";
import { upload } from "../../lib/upload";


function login() {

  const { fetchUser } = useUserStore();

  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });


  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Revoke previous object URL to avoid memory leaks
    setAvatar((prev) => {
      if (prev.url) URL.revokeObjectURL(prev.url);
      return {
        file,
        url: URL.createObjectURL(file),
      };
    });
  };
  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.target);
  const { username, email, password } = Object.fromEntries(formData);

  try {
    // 🔍 1. Check if username already exists
    const userRef = collection(db, "users");
    const q = query(userRef, where("username_lower", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast.error("Username already taken!");
      setLoading(false);
      return; // ❌ stop register process here
    }

    // 🔥 2. Create auth user
     const res = await createUserWithEmailAndPassword(auth, email, password);
      fetchUser(res.user.uid);

    // 🔥 3. Avatar required
    if (!avatar.file) {
      toast.error("Please upload an avatar");
      return;
    }

    const imgurl = await upload(avatar.file);

    // 🔥 4. Save user in Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      username,
      username_lower: username.toLowerCase(), // needed for search
      email,
      avatar: imgurl,
      id: res.user.uid,
      blocked: [],
    });


    // 🔥 5. Create empty chat list
    await setDoc(doc(db, "userchats", res.user.uid), {
      chats: [],
    });

    toast.success("Account created successfully!");
  } catch (err) {
    console.log(err);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { email, password } = Object.fromEntries(new FormData(e.target));
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="login">
        <div className="item">
          <h2>Welcome back,</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="password" name="password" />
            <button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
          </form>
        </div>
        <div className="separator"></div>
        <div className="item">
          <h2>Create an Account,</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="file">
              {/* Use the chosen image preview if available */}
              <img src={avatar.url || assets.avatar} alt="" />
              Upload an image
            </label>
            {/* Accept only images and trigger preview on change */}
            <input
              type="file"
              id="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input type="text" placeholder="Username" name="username" />
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="password" name="password" />
            <button disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </>
  );
}

export default login;
