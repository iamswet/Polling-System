import React from 'react';
import { PollResults as PollResultsType } from '../types';
import './PollResults.css';

interface PollResultsProps {
  results: PollResultsType;
  isTeacher: boolean;
  pollId: string;
}

const PollResults: React.FC<PollResultsProps> = ({ results, isTeacher, pollId }) => {
  const totalResponses = results.totalResponses;
  const maxVotes = Math.max(...Object.values(results.results));

  const getPercentage = (votes: number) => {
    return totalResponses > 0 ? Math.round((votes / totalResponses) * 100) : 0;
  };

  const getBarWidth = (votes: number) => {
    return maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
  };

  return (
    <div className="poll-results">
      <div className="results-header">
        <h3>Poll Results</h3>
        <div className="results-stats">
          <span className="total-responses">
            Total Responses: {totalResponses}
          </span>
          {results.timeRemaining > 0 && (
            <span className="time-remaining">
              Time Remaining: {Math.floor(results.timeRemaining / 60)}:{(results.timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      <div className="results-content">
        {results.options.map((option, index) => {
          const votes = results.results[option] || 0;
          const percentage = getPercentage(votes);
          const barWidth = getBarWidth(votes);
          const isWinning = votes === maxVotes && maxVotes > 0;

          return (
            <div key={index} className={`result-item ${isWinning ? 'winning' : ''}`}>
              <div className="option-header">
                <span className="option-text">{option}</span>
                <span className="vote-count">
                  {votes} vote{votes !== 1 ? 's' : ''} ({percentage}%)
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalResponses === 0 && (
        <div className="no-responses">
          <p>No responses yet. Waiting for students to answer...</p>
        </div>
      )}

      {isTeacher && (
        <div className="teacher-actions">
          <p className="poll-id-display">
            <strong>Poll ID:</strong> <code>{pollId}</code>
          </p>
          <p className="share-instruction">
            Share this ID with your students so they can join the poll.
          </p>
        </div>
      )}
    </div>
  );
};

export default PollResults;