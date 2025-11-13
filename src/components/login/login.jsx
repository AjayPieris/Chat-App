import React, { useState } from 'react'
import assets from '../../assets/public/asset'
import { ToastContainer, toast } from 'react-toastify'
import './login.css'

function login() {

  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })

  const handleAvatar = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    // Revoke previous object URL to avoid memory leaks
    setAvatar(prev => {
      if (prev.url) URL.revokeObjectURL(prev.url)
      return {
        file,
        url: URL.createObjectURL(file)
      }
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    toast.success("Hello")
  }

  return (
    <>
      <div className='login'>
        <div className="item">
          <h2>Welcome back,</h2>
          <form onSubmit={handleLogin}>
            <input type='text' placeholder='Email' name='email' />
            <input type='password' placeholder='password' name='password' />
            <button>Sign In</button>
          </form>
        </div>
        <div className="separator"></div>
        <div className="item">
          <h2>Create an Account,</h2>
          <form>
            <label htmlFor='file'>
              {/* Use the chosen image preview if available */}
              <img src={avatar.url || assets.avatar} alt='' />
              Upload an image
            </label>
            {/* Accept only images and trigger preview on change */}
            <input
              type='file'
              id='file'
              accept='image/*'
              style={{ display: 'none' }}
              onChange={handleAvatar}
            />
            <input type='text' placeholder='Username' name='username' />
            <input type='text' placeholder='Email' name='email' />
            <input type='password' placeholder='password' name='password' />
            <button>Sign Up</button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </>
  )
}

export default login