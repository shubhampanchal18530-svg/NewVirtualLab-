import React, { useEffect, useState } from 'react';
import './AIAnalytics.css';

// Mock anonymized analytics data
const mockAnalytics = {
  commonMistakes: [
    'Incorrect PMOS/NMOS sizing in DVLSI',
    'Missed edge cases in sorting algorithms',
    'Normalization errors in DBMS',
    'Incorrect filter design in DSP'
  ],
  weakTopics: [
    'Graph Algorithms',
    'CMOS Layout',
    'Transaction Management',
    'Fourier Transform'
  ],
  averageQuizScores: [
    { lab: 'DSA', score: 78 },
    { lab: 'DVLSI', score: 74 },
    { lab: 'DBMS', score: 82 },
    { lab: 'DSP', score: 69 }
  ]
};

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Replace with real API call if available
    setAnalytics(mockAnalytics);
  }, []);

  return (
    <div className="ai-analytics-page">
      <h1 className="analytics-title">AI Academic Analytics</h1>
      <div className="analytics-section">
        <h2>Common Mistakes</h2>
        <ul>
          {analytics?.commonMistakes.map((mistake, idx) => (
            <li key={idx}>{mistake}</li>
          ))}
        </ul>
      </div>
      <div className="analytics-section">
        <h2>Weak Topics</h2>
        <ul>
          {analytics?.weakTopics.map((topic, idx) => (
            <li key={idx}>{topic}</li>
          ))}
        </ul>
      </div>
      <div className="analytics-section">
        <h2>Average Quiz Scores</h2>
        <ul>
          {analytics?.averageQuizScores.map((lab, idx) => (
            <li key={idx}>{lab.lab}: {lab.score}%</li>
          ))}
        </ul>
      </div>
      <div className="analytics-note">
        <em>All data is anonymized and read-only. Used for academic insight only.</em>
      </div>
    </div>
  );
};

export default AIAnalytics;
