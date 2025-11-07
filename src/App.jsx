import React from 'react'
import List from './components/list/list.jsx'
import Detail from './components/detail/detail.jsx'
import Chat from './components/chat/chat.jsx'


function App() {
  return (
    <div className='container'>
      <List />
      <Chat />
      <Detail />
    </div>
  )
}

export default App
