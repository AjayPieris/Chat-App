import React from 'react'
import './list.css'
import UserInfo from './userInfo/userinfo.jsx'
import ChatList from '../chat/chatList/chatlist.jsx'

function List() {
  return (
    <div className='list'>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default List
