import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearPoll } from '../store/slices/pollSlice';
import socketService from '../services/socketService';
import CreatePollForm from './CreatePollForm';
import PollResults from './PollResults';
import ChatPopup from './ChatPopup';
import PollHistory from './PollHistory';
import './TeacherDashboard.css';

const TeacherDashboard: React.FC = () => {
  const { currentPoll, pollResults, pollId, showChat } = useSelector((state: RootState) => state.poll);
  const dispatch = useDispatch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleCreatePoll = (pollData: { question: string; options: string[]; timeLimit: number }) => {
    socketService.createPoll(pollData);
    setShowCreateForm(false);
  };

  const handleStartPoll = () => {
    if (pollId) {
      socketService.startPoll(pollId);
    }
  };

  const handleEndPoll = () => {
    if (pollId) {
      socketService.endPoll(pollId);
    }
  };

  const handleNewPoll = () => {
    dispatch(clearPoll());
    setShowCreateForm(true);
  };

  const canAskNewQuestion = () => {
    if (!currentPoll) return true;
    if (!pollResults) return true;
    return pollResults.totalResponses === 0 || pollResults.timeRemaining === 0;
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="history-toggle-btn"
          >
            📊 History
          </button>
          <button 
            onClick={() => dispatch({ type: 'poll/toggleChat' })} 
            className="chat-toggle-btn"
          >
            💬 Chat
          </button>
          <button onClick={() => dispatch(setIsTeacher(false))} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {!currentPoll && !showCreateForm && (
          <div className="welcome-section">
            <h2>Welcome to the Polling System</h2>
            <p>Create a new poll to get started</p>
            <button onClick={() => setShowCreateForm(true)} className="create-poll-btn">
              Create New Poll
            </button>
          </div>
        )}

        {showCreateForm && (
          <CreatePollForm 
            onSubmit={handleCreatePoll}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {currentPoll && (
          <div className="poll-management">
            <div className="poll-info">
              <h2>Current Poll</h2>
              <p><strong>Question:</strong> {currentPoll.question}</p>
              <p><strong>Options:</strong> {currentPoll.options.join(', ')}</p>
              <p><strong>Time Limit:</strong> {currentPoll.timeLimit} seconds</p>
              <p><strong>Poll ID:</strong> <code>{pollId}</code></p>
            </div>

            <div className="poll-controls">
              {!currentPoll.isActive && (
                <button onClick={handleStartPoll} className="start-poll-btn">
                  Start Poll
                </button>
              )}
              
              {currentPoll.isActive && (
                <button onClick={handleEndPoll} className="end-poll-btn">
                  End Poll
                </button>
              )}

              {canAskNewQuestion() && (
                <button onClick={handleNewPoll} className="new-poll-btn">
                  Create New Poll
                </button>
              )}
            </div>

            {pollResults && (
              <PollResults 
                results={pollResults} 
                isTeacher={true}
                pollId={pollId || ''}
              />
            )}
          </div>
        )}

        {showHistory && <PollHistory />}
      </div>

      {showChat && <ChatPopup isTeacher={true} />}
    </div>
  );
};

export default TeacherDashboard;