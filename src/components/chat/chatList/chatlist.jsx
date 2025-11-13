import React, { useState } from 'react'
import './chatlist.css'
import AddUser from './addUser/addUser'

function ChatList() {

  const [addMode, setAddMode] = useState(false)

  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchbar'>
          <img src='./src/assets/public/search.png'/>
          <input type='text' placeholder='search' />
        </div>
        <img src={ addMode ? "./src/assets/public/plus.png" : "./src/assets/public/minus.png" }className='add'
        onClick={()=>setAddMode((prev)=>!prev)}
        />
      </div>
      <div className='item'>
        <img src='./src/assets/public/avatar.png'
 alt='avatar'/>
        <div className='texts'>
          <span>Vijay</span>
          <p>Hello</p>
        </div>
       </div>
       <div className='item'>
        <img src='./src/assets/public/avatar.png'
 alt='avatar'/>
        <div className='texts'>
          <span>Vijay</span>
          <p>Hello</p>
        </div>
       </div>
       <div className='item'>
        <img src='./src/assets/public/avatar.png'
 alt='avatar'/>
        <div className='texts'>
          <span>Vijay</span>
          <p>Hello</p>
        </div>
       </div>
       <div className='item'>
        <img src='./src/assets/public/avatar.png'
 alt='avatar'/>
        <div className='texts'>
          <span>Vijay</span>
          <p>Hello</p>
        </div>
       </div>
       {addMode && <AddUser onClose={() => setAddMode(false)} />}
    </div>
  )
}

export default ChatList
