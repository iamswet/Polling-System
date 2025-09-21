import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearPoll } from '../store/slices/pollSlice';
import socketService from '../services/socketService';
import PollResults from './PollResults';
import ChatPopup from './ChatPopup';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const { studentName, pollResults, pollId, showChat } = useSelector((state: RootState) => state.poll);
  const dispatch = useDispatch();
  const [pollIdInput, setPollIdInput] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (pollResults) {
      setTimeRemaining(pollResults.timeRemaining);
    }
  }, [pollResults]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setHasAnswered(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleJoinPoll = () => {
    if (pollIdInput.trim()) {
      socketService.joinPoll(pollIdInput.trim(), studentName || '');
    } else {
      alert('Please enter a poll ID');
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer && pollId) {
      socketService.submitAnswer(pollId, selectedAnswer);
      setHasAnswered(true);
    }
  };

  const handleNewPoll = () => {
    dispatch(clearPoll());
    setPollIdInput('');
    setSelectedAnswer('');
    setHasAnswered(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-info">
          <span className="student-name">Welcome, {studentName}!</span>
          <div className="header-actions">
            <button 
              onClick={() => dispatch({ type: 'poll/toggleChat' })} 
              className="chat-toggle-btn"
            >
              💬 Chat
            </button>
            <button onClick={() => dispatch(clearPoll())} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {!pollId && (
          <div className="join-poll-section">
            <h2>Join a Poll</h2>
            <p>Enter the poll ID provided by your teacher</p>
            <div className="join-form">
              <input
                type="text"
                value={pollIdInput}
                onChange={(e) => setPollIdInput(e.target.value)}
                placeholder="Enter Poll ID"
                className="poll-id-input"
              />
              <button onClick={handleJoinPoll} className="join-btn">
                Join Poll
              </button>
            </div>
          </div>
        )}

        {pollId && pollResults && (
          <div className="poll-section">
            <div className="poll-header">
              <h2>Poll Question</h2>
              {timeRemaining > 0 && (
                <div className="timer">
                  Time Remaining: {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            <div className="question">
              <h3>{pollResults.question}</h3>
            </div>

            {!hasAnswered && timeRemaining > 0 && (
              <div className="answer-options">
                <h4>Select your answer:</h4>
                <div className="options-grid">
                  {pollResults.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(option)}
                      className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="submit-answer-btn"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {(hasAnswered || timeRemaining === 0) && (
              <div className="results-section">
                <h4>Poll Results</h4>
                <PollResults 
                  results={pollResults} 
                  isTeacher={false}
                  pollId={pollId}
                />
                <button onClick={handleNewPoll} className="new-poll-btn">
                  Join Another Poll
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showChat && <ChatPopup isTeacher={false} />}
    </div>
  );
};

export default StudentDashboard;