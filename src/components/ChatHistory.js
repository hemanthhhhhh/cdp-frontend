import React from 'react';

function ChatHistory({ history = [], onClose }) {
  return (
    <div className="chat-history">
      <div className="chat-history-header">
        <h2>Chat History</h2>
        <button className="back-button" onClick={onClose}>Back</button>
      </div>
      {history.map((entry, index) => (
        <div key={index} className="history-entry">
          <h3>Question:</h3>
          <p>{entry.question}</p>
          <h3>Answer:</h3>
          <p>{entry.answer}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;