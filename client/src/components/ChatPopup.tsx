import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addChatMessage, toggleChat } from '../store/slices/pollSlice';
import socketService from '../services/socketService';
import './ChatPopup.css';

interface ChatPopupProps {
  isTeacher: boolean;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ isTeacher }) => {
  const { chatMessages, studentName, showChat } = useSelector((state: RootState) => state.poll);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const sender = isTeacher ? 'Teacher' : (studentName || 'Student');
      socketService.sendChatMessage(message.trim(), sender, isTeacher);
      setMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!showChat) return null;

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3>Chat</h3>
        <button 
          onClick={() => dispatch(toggleChat())} 
          className="close-chat-btn"
        >
          ×
        </button>
      </div>
      
      <div className="chat-messages">
        {chatMessages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.isTeacher ? 'teacher-message' : 'student-message'}`}
            >
              <div className="message-header">
                <span className="sender-name">{msg.sender}</span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPopup;