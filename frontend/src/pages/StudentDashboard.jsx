import React from 'react';
import './StudentDashboard.css';

// Mock data for demonstration
const mockLabs = [
  {
    name: 'DSA',
    completedExperiments: 7,
    totalExperiments: 10,
    quizScores: [85, 90, 78],
    weakTopics: ['Graph Algorithms', 'Dynamic Programming'],
  },
  {
    name: 'DVLSI',
    completedExperiments: 5,
    totalExperiments: 8,
    quizScores: [88, 75, 80],
    weakTopics: ['CMOS Layout', 'Timing Analysis'],
  },
  {
    name: 'DBMS',
    completedExperiments: 6,
    totalExperiments: 9,
    quizScores: [92, 85, 89],
    weakTopics: ['Normalization', 'Transaction Management'],
  },
  {
    name: 'DSP',
    completedExperiments: 4,
    totalExperiments: 7,
    quizScores: [80, 70, 75],
    weakTopics: ['Fourier Transform', 'Filter Design'],
  },
];

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <div className="labs-list">
        {mockLabs.map((lab) => (
          <div className="lab-card" key={lab.name}>
            <h2 className="lab-name">{lab.name} Lab</h2>
            <div className="progress-section">
              <span>Completed Experiments: {lab.completedExperiments} / {lab.totalExperiments}</span>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(lab.completedExperiments / lab.totalExperiments) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="quiz-section">
              <span>Quiz Scores:</span>
              <ul>
                {lab.quizScores.map((score, idx) => (
                  <li key={idx}>Experiment {idx + 1}: {score}%</li>
                ))}
              </ul>
            </div>
            <div className="weak-topics-section">
              <span>AI-Identified Weak Topics:</span>
              <ul>
                {lab.weakTopics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
