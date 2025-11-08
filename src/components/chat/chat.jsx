import React from 'react'
import './chat.css'

function chat() {
  return (
    <div className='chat'>
      <div className='chat'>
        <div className='top'>
          <div className='user'>
            <img src='src\assets\public\avatar.png'/>
            <div className="texts">
              <span>Vijay</span>
              <p>Lorem ipsum dolor </p>
            </div>
          </div>
          <div className='icons'>
            <img src='.\src\assets\public\phone.png' alt='' />
             <img src='.\src\assets\public\video.png' alt='' />
              <img src='.\src\assets\public\info.png' alt='' />

          </div>
        </div>
        <div className='center'></div>
        <div className="bottom">
          <div className='icons'></div>
          <input type='text' placeholder='Type a message'/>
          <div className='emoji'>
            <img src='.\src\assets\public\emoji.png'  alt=''/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default chat
