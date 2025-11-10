import React from 'react'
import './detail.css'

function detail() {
  return (
    <div className='detail'>
      <div className='user'>
        <img src='.\src\assets\public\avatar.png'/>
        <h2>John Doe</h2>
        <p>Lorem ipsum dolor sit.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src='./src/assets/public/arrowUp.png'/>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src='./src/assets/public/arrowUp.png'/>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src='./src/assets/public/arrowDown.png'/>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
              <img src='./src/assets/public/favicon.png'/>
              <span>favicon.png</span> 
            </div>
            <img src='.\src\assets\public\download.png'/>
          </div>
         </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
              <img src='./src/assets/public/favicon.png'/>
              <span>favicon.png</span> 
            </div>
            <img src='.\src\assets\public\download.png'/>
          </div>
         </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
              <img src='./src/assets/public/favicon.png'/>
              <span>favicon.png</span> 
            </div>
            <img src='.\src\assets\public\download.png'/>
          </div>
         </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
              <img src='./src/assets/public/favicon.png'/>
              <span>favicon.png</span> 
            </div>
            <img src='.\src\assets\public\download.png'/>
          </div>
         </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src='./src/assets/public/arrowUp.png'/>
          </div>
        </div>
        <button>Block User</button>
      </div>
    </div>
  )
}

export default detail
