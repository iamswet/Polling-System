import React, { useState, useEffect } from 'react';
import './PollHistory.css';

interface PollHistoryItem {
  id: string;
  question: string;
  options: string[];
  results: { [key: string]: number };
  totalResponses: number;
  timeLimit: number;
  endTime: string;
}

const PollHistory: React.FC = () => {
  const [history, setHistory] = useState<PollHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPollHistory();
  }, []);

  const fetchPollHistory = async () => {
    try {
      const response = await fetch('/api/poll-history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching poll history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMaxVotes = (results: { [key: string]: number }) => {
    return Math.max(...Object.values(results));
  };

  const getPercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="poll-history">
        <div className="loading">
          <p>Loading poll history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-history">
      <h2>Poll History</h2>
      
      {history.length === 0 ? (
        <div className="no-history">
          <p>No polls have been completed yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((poll) => {
            const maxVotes = getMaxVotes(poll.results);
            
            return (
              <div key={poll.id} className="history-item">
                <div className="poll-header">
                  <h3>{poll.question}</h3>
                  <div className="poll-meta">
                    <span className="end-time">{formatDate(poll.endTime)}</span>
                    <span className="total-responses">
                      {poll.totalResponses} response{poll.totalResponses !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="results-summary">
                  {poll.options.map((option, index) => {
                    const votes = poll.results[option] || 0;
                    const percentage = getPercentage(votes, poll.totalResponses);
                    const isWinning = votes === maxVotes && maxVotes > 0;
                    
                    return (
                      <div key={index} className={`result-item ${isWinning ? 'winning' : ''}`}>
                        <div className="option-header">
                          <span className="option-text">{option}</span>
                          <span className="vote-count">
                            {votes} ({percentage}%)
                          </span>
                        </div>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar"
                            style={{ width: `${maxVotes > 0 ? (votes / maxVotes) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollHistory;