import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsTeacher, setStudentName } from '../store/slices/pollSlice';
import './RoleSelector.css';

const RoleSelector: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const dispatch = useDispatch();

  const handleTeacherLogin = () => {
    dispatch(setIsTeacher(true));
  };

  const handleStudentLogin = () => {
    if (studentName.trim()) {
      dispatch(setStudentName(studentName.trim()));
    } else {
      alert('Please enter your name');
    }
  };

  return (
    <div className="role-selector">
      <div className="role-container">
        <h1>Real-time Polling System</h1>
        <p>Choose your role to continue</p>
        
        <div className="role-options">
          <div className="role-card teacher-card">
            <h2>Teacher</h2>
            <p>Create and manage polls</p>
            <button onClick={handleTeacherLogin} className="role-button teacher-button">
              Enter as Teacher
            </button>
          </div>
          
          <div className="role-card student-card">
            <h2>Student</h2>
            <p>Answer poll questions</p>
            <div className="student-input">
              <input
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="name-input"
              />
              <button 
                onClick={handleStudentLogin} 
                className="role-button student-button"
                disabled={!studentName.trim()}
              >
                Enter as Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;