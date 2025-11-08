import React from 'react'
import './userinfo.css'

function UserInfo() {
  return (
    <div className='userinfo'>
      <div className='user'>
        <img src='src\assets\public\avatar.png' alt=''/>
        <h2>Ajay</h2>
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
