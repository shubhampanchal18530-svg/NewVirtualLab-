import React, { useState, useEffect } from 'react';
import './FacultyPanel.css';

// Mock API fetch
const fetchSubmissions = async () => {
  // Replace with real API call
  return [
    {
      _id: '1',
      userId: 'student1',
      labName: 'DVLSI',
      experimentName: 'CMOS Inverter',
      quizScore: 85,
      designFile: 'design1.png',
      aiFeedback: 'Improve PMOS sizing.',
      status: 'submitted',
      createdAt: '2026-01-11',
      remarks: ''
    },
    {
      _id: '2',
      userId: 'student2',
      labName: 'DSA',
      experimentName: 'Sorting',
      quizScore: 90,
      designFile: 'design2.jpg',
      aiFeedback: 'Good use of merge sort.',
      status: 'evaluated',
      createdAt: '2026-01-10',
      remarks: 'Well done.'
    }
  ];
};

const FacultyPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [editingRemark, setEditingRemark] = useState({});

  useEffect(() => {
    fetchSubmissions().then(setSubmissions);
  }, []);

  const handleRemarkChange = (id, value) => {
    setEditingRemark({ ...editingRemark, [id]: value });
  };

  const handleRemarkSave = (id) => {
    setSubmissions(submissions.map(sub =>
      sub._id === id ? { ...sub, remarks: editingRemark[id] || '' } : sub
    ));
    setEditingRemark({ ...editingRemark, [id]: '' });
  };

  return (
    <div className="faculty-panel">
      <h1 className="panel-title">Faculty Panel</h1>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Lab</th>
            <th>Experiment</th>
            <th>Quiz Score</th>
            <th>Design File</th>
            <th>AI Feedback</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(sub => (
            <tr key={sub._id}>
              <td>{sub.userId}</td>
              <td>{sub.labName}</td>
              <td>{sub.experimentName}</td>
              <td>{sub.quizScore}</td>
              <td>
                <a href={sub.designFile} target="_blank" rel="noopener noreferrer">View</a>
              </td>
              <td>{sub.aiFeedback}</td>
              <td>{sub.status}</td>
              <td>{sub.createdAt}</td>
              <td>
                <input
                  type="text"
                  value={editingRemark[sub._id] !== undefined ? editingRemark[sub._id] : sub.remarks}
                  onChange={e => handleRemarkChange(sub._id, e.target.value)}
                  className="remark-input"
                />
                <button onClick={() => handleRemarkSave(sub._id)} className="remark-save-btn">Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyPanel;
