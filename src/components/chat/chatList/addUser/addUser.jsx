import React from 'react';
import ReactDOM from 'react-dom';
import './addUser.css';
import assets from '../../../../assets/public/asset';

function AddUser({ onClose }) {
  const content = (
    <div className="addUser-overlay" role="dialog" aria-modal="true">
      <div className="addUser-card">
        <div className="addUser-header">
          <h3>Add user</h3>
          <button
            type="button"
            className="addUser-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="username" name="username" />
          <button type="submit">Search</button>
        </form>

        <div className="user">
          <div className="detail">
            <img src={assets.avatar} alt="User Avatar" />
            <span>John Doe</span>
          </div>
          <button type="button">Add User</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

export default AddUser;