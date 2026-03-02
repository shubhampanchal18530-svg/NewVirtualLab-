import React, { useState } from "react";
import "./Lab.css";

const quizQuestions = [
  { question: "What is the primary advantage of a linked list over array?", options: ["Random access", "Dynamic size", "Lower memory", "Faster indexing"], correct: 1 },
  { question: "In a singly linked list, insertion at head is", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 0 },
  { question: "Which pointer does a node in singly linked list commonly have?", options: ["prev", "next", "parent", "child"], correct: 1 }
];

function NodeView({ value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="pill">{value}</div>
      <div style={{ width: 24, textAlign: 'center' }}>→</div>
    </div>
  );
}

export default function LinkedListLab() {
  const [nodes, setNodes] = useState([]);
  const [input, setInput] = useState("");
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const addHead = () => {
    if (!input.trim()) return;
    setNodes(prev => [input, ...prev]);
    setInput("");
    localStorage.setItem('vlab_last_experiment', JSON.stringify({ name: 'linked-list', time: Date.now() }));
  };

  const removeHead = () => {
    setNodes(prev => prev.slice(1));
  };

  function handleQuizAnswer(i, v) { const a = [...quizAnswers]; a[i] = v; setQuizAnswers(a); }

  function submitQuiz() {
    let s = 0; quizQuestions.forEach((q, i) => { if (quizAnswers[i] === q.correct) s++; });
    setQuizScore(s); setQuizSubmitted(true);
    const scores = JSON.parse(localStorage.getItem('vlab_scores') || '[]');
    scores.push({ subject: 'DSA', experiment: 'linked-list', correct: s, total: quizQuestions.length, time: Date.now() });
    localStorage.setItem('vlab_scores', JSON.stringify(scores));
  }

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">Linked List Experiment</h1>
        <p className="lab-desc">Simple singly linked list operations: insert/remove at head, and visualize nodes.</p>
      </div>

      <div className="lab-controls">
        <label className="lab-label">Value: <input className="lab-input" value={input} onChange={e => setInput(e.target.value)} /></label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn primary" onClick={addHead}>Insert at Head</button>
          <button className="btn secondary" onClick={removeHead}>Remove Head</button>
        </div>
      </div>

      <div className="lab-output" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {nodes.length === 0 ? <span className="muted">(empty)</span> : nodes.map((v, i) => <NodeView key={i} value={v} />)}
        </div>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Quick Quiz</h3>
        {quizQuestions.map((q, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div><strong>{i + 1}. {q.question}</strong></div>
            <div style={{ marginTop: 6 }}>
              {q.options.map((opt, j) => (
                <label key={j} style={{ display: 'block' }}>
                  <input type="radio" name={`q${i}`} checked={quizAnswers[i] === j} onChange={() => handleQuizAnswer(i, j)} /> {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        {!quizSubmitted ? <button className="btn primary" onClick={submitQuiz}>Submit Quiz</button> : <div>Score: {quizScore} / {quizQuestions.length}</div>}
      </section>
    </div>
  );
}
