import React, {  useEffect, useState } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';

function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleEmoji = (emojiData, event) => {
    setText(prev => prev + emojiData.emoji);
  };

  const endRef = React.useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className='chat'>
      {/* Top Bar */}
      <div className='top'>
        <div className='user'>
          <img src='src/assets/public/avatar.png' alt='avatar' />
          <div className="texts">
            <span>Vijay</span>
            <p>Lorem ipsum dolor</p>
          </div>
        </div>
        <div className='icons'>
          <img src='./src/assets/public/phone.png' alt='phone' />
          <img src='./src/assets/public/video.png' alt='video' />
          <img src='./src/assets/public/info.png' alt='info' />
        </div>
      </div>

      {/* Messages */}
      <div className='center'>
        <div className='message own'>
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora,
              natus voluptates saepe delectus dolore accusantium aperiam dolorum
              veniam quos obcaecati dicta eaque dignissimos qui nihil tempore sint,
              est cum inventore!
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='./src/assets/public/avatar.png' alt='avatar' />
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora,
              natus voluptates saepe delectus dolore accusantium aperiam dolorum
              veniam quos obcaecati dicta eaque dignissimos qui nihil tempore sint,
              est cum inventore!
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message own'>
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora,
              natus voluptates saepe delectus dolore accusantium aperiam dolorum
              veniam quos obcaecati dicta eaque dignissimos qui nihil tempore sint,
              est cum inventore!
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='./src/assets/public/avatar.png' alt='avatar' />
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora,
              natus voluptates saepe delectus dolore accusantium aperiam dolorum
              veniam quos obcaecati dicta eaque dignissimos qui nihil tempore sint,
              est cum inventore!
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message own'>
          <div className='texts'>
            <img src='./src/assets/public/favicon.png'/>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora,
              natus voluptates saepe delectus dolore accusantium aperiam dolorum
              veniam quos obcaecati dicta eaque dignissimos qui nihil tempore sint,
              est cum inventore!
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='./src/assets/public/avatar.png' alt='avatar' />
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora,
              natus voluptates saepe delectus dolore accusantium aperiam dolorum
              veniam quos obcaecati dicta eaque dignissimos qui nihil tempore sint,
              est cum inventore!
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div ref={endRef} />
      </div>

      {/* Bottom Input Bar */}
      <div className='bottom'>
        <div className='icons'>
          <img src='./src/assets/public/img.png' alt='image' />
          <img src='./src/assets/public/camera.png' alt='camera' />
          <img src='./src/assets/public/mic.png' alt='mic' />
        </div>

        <input
          type='text'
          placeholder='Type a message'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className='emoji'>
          <img
            src='./src/assets/public/emoji.png'
            alt='emoji'
            onClick={() => setOpen(prev => !prev)}
          />
          {open && (
            <div className='picker'>
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className='sendButton'>Send</button>
      </div>
    </div>
  );
}

export default Chat;
