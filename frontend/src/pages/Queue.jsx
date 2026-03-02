import React, { useState, useRef } from "react";
import "./Lab.css";
import "./SortingLab.css";

const quizQuestions = [
  { question: "Which principle does a Queue follow?", options: ["LIFO", "FIFO", "Random", "Priority"], correct: 1 },
  { question: "What is the time complexity of enqueue in a simple array-based queue (amortized)?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 0 },
  { question: "What is the operation to remove from a queue?", options: ["push", "pop", "dequeue", "peek"], correct: 2 }
];

const QUEUE_SIZE = 8;

export default function QueueLab() {
  const [queue, setQueue] = useState([]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState(["Queue initialized."]);
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);
  const [warning, setWarning] = useState("");
  const [animating, setAnimating] = useState(false);
  const [animDuration, setAnimDuration] = useState(400);
  const inputRef = useRef();

  const enqueue = () => {
    if (!input.trim()) {
      setWarning("Please enter a value!");
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    if (queue.length >= QUEUE_SIZE) {
      setWarning("Queue Overflow! Cannot add more elements.");
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setQueue(prev => [...prev, input]);
      setLog(prev => [`ENQUEUE: ${input} added to queue`, ...prev].slice(0, 10));
      setInput("");
      setExperimentRun(true);
      setAnimating(false);
      inputRef.current && inputRef.current.focus();
      localStorage.setItem('vlab_last_experiment', JSON.stringify({ name: 'queue', time: Date.now() }));
    }, animDuration);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setWarning("Queue Underflow! Cannot remove from empty queue.");
      setLog(prev => [`DEQUEUE failed: Queue empty`, ...prev].slice(0, 10));
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      const val = queue[0];
      setQueue(prev => prev.slice(1));
      setLog(prev => [`DEQUEUE: ${val} removed from queue`, ...prev].slice(0, 10));
      setExperimentRun(true);
      setAnimating(false);
      localStorage.setItem('vlab_last_experiment', JSON.stringify({ name: 'queue', time: Date.now() }));
    }, animDuration);
  };

  const reset = () => {
    setQueue([]);
    setInput("");
    setLog(["Queue initialized."]);
    setWarning("");
    setAnimating(false);
  };

  const handleSpeedChange = (e) => {
    setAnimDuration(Number(e.target.value));
  };

  function handleQuizAnswer(i, v) {
    const a = [...quizAnswers];
    a[i] = v;
    setQuizAnswers(a);
  }

  function submitQuiz() {
    let s = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) s++;
    });
    setQuizScore(s);
    setQuizSubmitted(true);
    const scores = JSON.parse(localStorage.getItem('vlab_scores') || '[]');
    scores.push({ subject: 'DSA', experiment: 'queue', correct: s, total: quizQuestions.length, time: Date.now() });
    localStorage.setItem('vlab_scores', JSON.stringify(scores));
  }

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Queue Data Structure</h1>

      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize Queue operations (ENQUEUE and DEQUEUE) using an array-based implementation and study FIFO principle.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A Queue is a linear data structure that follows the FIFO (First In First Out) principle. Elements are added at the rear and removed from the front.
        </p>
        <p>
          <strong>Operations:</strong>
        </p>
        <ul>
          <li><strong>ENQUEUE:</strong> Add an element to the rear of the queue</li>
          <li><strong>DEQUEUE:</strong> Remove an element from the front of the queue</li>
          <li><strong>PEEK:</strong> View the front element without removing it</li>
          <li><strong>isEmpty:</strong> Check if the queue is empty</li>
          <li><strong>isFull:</strong> Check if the queue is full</li>
        </ul>
        <p>
          <strong>Time Complexity:</strong> All operations are O(1) for a circular queue
        </p>
        <p>
          <strong>Space Complexity:</strong> O(n) where n is the maximum queue size
        </p>
        <p>
          <strong>Real-World Applications:</strong> CPU scheduling, Print queue, Breadth-First Search, Customer service lines
        </p>
      </section>

      <section className="card experiment">
        <h2>Experiment - Interactive Simulation</h2>
        <form className="stack-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
          <label htmlFor="queue-input" className="stack-label">Enter Value:</label>
          <input
            id="queue-input"
            className="stack-input"
            type="text"
            placeholder="Enter a value to enqueue"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enqueue()}
            ref={inputRef}
            disabled={animating}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button type="button" className="stack-btn push-btn" onClick={enqueue} disabled={queue.length >= QUEUE_SIZE || animating}>
              ENQUEUE
            </button>
            <button type="button" className="stack-btn pop-btn" onClick={dequeue} disabled={queue.length === 0 || animating}>
              DEQUEUE
            </button>
            <button type="button" className="stack-btn reset-btn" onClick={reset} disabled={animating}>
              RESET
            </button>
          </div>
        </form>

        <div className="stack-speed-panel">
          <label htmlFor="queue-speed-slider" className="stack-label">Animation Speed:</label>
          <input
            id="queue-speed-slider"
            type="range"
            min="100"
            max="1000"
            value={animDuration}
            step="50"
            onChange={handleSpeedChange}
          />
          <span id="queue-speed-value">{animDuration}ms</span>
        </div>

        <div className="stack-edu-panel">
          <div className="stack-info">
            <span id="queue-size-info">Queue Size: {queue.length} / {QUEUE_SIZE}</span>
            <span id="queue-front-info">Front: {queue.length > 0 ? queue[0] : "Empty"}</span>
            <span id="queue-rear-info">Rear: {queue.length > 0 ? queue[queue.length - 1] : "Empty"}</span>
          </div>
          <div className="top-pointer">{queue.length === 0 ? "Queue is empty" : `Queue has ${queue.length} element(s)`}</div>
          {warning && <div className="stack-warning show">{warning}</div>}
          
          <section className="queue-container" aria-label="Queue Visualization">
            <div className="queue-label-front">FRONT</div>
            {queue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '1.1rem' }}>Queue is empty</div>
            ) : (
              <div className="queue-visualization">
                {queue.map((val, i) => (
                  <div
                    key={i}
                    className={`queue-block ${i === 0 ? 'front' : ''} ${i === queue.length - 1 ? 'rear' : ''}`}
                    style={{ transitionDuration: animDuration + "ms" }}
                  >
                    <div className="queue-value">{val}</div>
                    <div className="queue-index">Index {i}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="queue-label-rear">REAR</div>
          </section>

          <div className="stack-log-panel">
            <div className="stack-log-title">Operation Log</div>
            <ul id="queue-log-list" className="stack-log-list">
              {log.map((msg, idx) => (
                <li key={idx} style={{ fontSize: '0.95rem' }}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Quiz</h2>
        {!experimentRun ? (
          <p style={{ color: '#d1d5db' }}>Please run the experiment at least once before attempting the quiz.</p>
        ) : (
          <div>
            {quizQuestions.map((q, i) => (
              <div key={i} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#e5e7eb', fontSize: '1.05rem' }}>{i + 1}. {q.question}</strong>
                </div>
                <div style={{ marginLeft: 20 }}>
                  {q.options.map((opt, j) => (
                    <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer', color: '#d1d5db' }}>
                      <input
                        type="radio"
                        name={`q${i}`}
                        checked={quizAnswers[i] === j}
                        onChange={() => handleQuizAnswer(i, j)}
                        style={{ cursor: 'pointer' }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {!quizSubmitted ? (
              <button className="btn primary" onClick={submitQuiz} style={{ marginTop: 16, padding: '0.8rem 1.6rem', fontSize: '1rem' }}>
                Submit Quiz
              </button>
            ) : (
              <div style={{ marginTop: 16, padding: '1rem', background: 'rgba(56,189,248,0.1)', borderRadius: 8, borderLeft: '4px solid #38bdf8' }}>
                <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>Quiz Score: {quizScore} / {quizQuestions.length}</strong>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
