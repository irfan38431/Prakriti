import React from "react";

interface ChatBoxProps {
  messages: any[]; // Assuming messages is an array of chat messages
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <div key={index} className="message">
          <p>{message.sender}: {message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;