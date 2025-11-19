import React from 'react'
import './userinfo.css'
import { useUserStore } from '../../../lib/UserStore.js';

function UserInfo() {
  const { currentUser } = useUserStore();
  return (
    <div className='userinfo'>
      <div className='user'>
        <img src={currentUser.avatar} alt='avatar'/>
        <h2>{currentUser.username}</h2>
      </div>
      <div className='icons'>
        <img src='src\assets\public\more.png'/>
        <img src='src\assets\public\video.png'/>
        <img src='src\assets\public\edit.png' />
      </div>
    </div>
  )
}

export default UserInfo
