import React, { useState } from 'react';
import './CreatePollForm.css';

interface CreatePollFormProps {
  onSubmit: (data: { question: string; options: string[]; timeLimit: number }) => void;
  onCancel: () => void;
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ onSubmit, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(option => option.trim() !== '');
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    onSubmit({
      question: question.trim(),
      options: validOptions,
      timeLimit
    });
  };

  return (
    <div className="create-poll-form">
      <h2>Create New Poll</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question..."
            className="question-input"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label>Answer Options</label>
          {options.map((option, index) => (
            <div key={index} className="option-input-group">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="option-input"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="add-option-btn"
            >
              + Add Option
            </button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (seconds)</label>
          <select
            id="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="time-limit-select"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
            <option value={180}>180 seconds</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Create Poll
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePollForm;