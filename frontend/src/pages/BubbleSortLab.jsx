import React, { useState, useRef } from "react";
import API from "../API/api";
import "./StackArray.css";

const THEORY = `
Bubble Sort is a simple comparison-based sorting algorithm.
It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
This process is repeated until the list is sorted.

- Time Complexity: O(n^2) worst/average, O(n) best (already sorted)
- Space Complexity: O(1) (in-place)
- Stable: Yes
`;

function getBubbleSortSteps(arr) {
  let steps = [];
  let a = arr.slice();
  let highlights = [];
  function record(i, j, swapped) {
    steps.push({ arr: a.slice(), i, j, swapped });
  }
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      record(j, j + 1, false);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        record(j, j + 1, true);
      }
    }
  }
  record(-1, -1, false); // Final state
  return steps;
}

export default function BubbleSortLab() {
  const [input, setInput] = useState("5, 2, 9, 1, 6");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [animationType, setAnimationType] = useState('3d');
  const timer = useRef();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizFeedback, setQuizFeedback] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("function bubbleSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}");
  const [codeResult, setCodeResult] = useState("");

  function handleStart() {
    let arr = input.split(/\s|,/).map(Number).filter(x => !isNaN(x));
    if (arr.length < 2) return;
    let s = getBubbleSortSteps(arr);
    setSteps(s);
    setStepIdx(0);
    setPlaying(true);
    timer.current = setInterval(() => {
      setStepIdx(idx => {
        if (idx + 1 >= s.length) {
          clearInterval(timer.current);
          setPlaying(false);
          return idx;
        }
        return idx + 1;
      });
    }, speed);
  }

  function handlePause() {
    setPlaying(false);
    clearInterval(timer.current);
  }

  function handleReset() {
    setPlaying(false);
    clearInterval(timer.current);
    setStepIdx(0);
  }

  function handleSpeedChange(e) {
    setSpeed(Number(e.target.value));
  }

  function handleQuizSubmit(e) {
    e.preventDefault();
    if (quizAnswer.trim() === "O(n^2)") {
      setQuizFeedback("Correct! Bubble Sort is O(n^2) in the worst case.");
    } else {
      setQuizFeedback("Try again. Hint: It's quadratic time complexity.");
    }
  }

  function handleCodeRun() {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("arr", code + "; return bubbleSort(arr);");
      let arr = input.split(/\s|,/).map(Number).filter(x => !isNaN(x));
      const result = fn(arr);
      setCodeResult("Output: [" + result.join(", ") + "]");
    } catch (e) {
      setCodeResult("Error: " + e.message);
    }
  }

  const curr = steps[stepIdx] || { arr: input.split(/\s|,/).map(Number).filter(x => !isNaN(x)), i: -1, j: -1, swapped: false };
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  return (
    <div className="stack-main" style={{paddingTop: 32, maxWidth: 800, margin: '0 auto'}}>
      <h1 className="stack-heading">Bubble Sort Experiment</h1>
      <div style={{background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(44,44,84,0.07)', padding: '1.5rem 2rem', marginBottom: 24}}>
        <h2 style={{fontSize: '1.2rem', fontWeight: 700, color: '#111', marginBottom: 8}}>Theory</h2>
        <pre style={{whiteSpace: 'pre-wrap', fontSize: '1rem', color: '#111', background: 'none', border: 'none', margin: 0}}>{THEORY}</pre>
      </div>
      <form className="stack-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <label className="stack-label">Array:</label>
        <input
          className="stack-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={playing}
        />
        <button type="button" className="stack-btn push-btn" onClick={handleStart} disabled={playing || curr.arr.length < 2}>Start</button>
        <button type="button" className="stack-btn pop-btn" onClick={handlePause} disabled={!playing}>Pause</button>
        <button type="button" className="stack-btn reset-btn" onClick={handleReset}>Reset</button>
      </form>
      <div className="stack-speed-panel">
        <label className="stack-label" style={{color: '#111'}}>Animation Speed:</label>
        <input
          type="range"
          min="100"
          max="1500"
          value={speed}
          step="50"
          onChange={handleSpeedChange}
          disabled={playing}
        />
        <span style={{color: '#111'}}>{speed}ms</span>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12}}>
          <label className="stack-label" style={{color: '#111', marginRight: 6}}>Animation:</label>
          <select value={animationType} onChange={e => setAnimationType(e.target.value)} disabled={playing} style={{padding: '6px 8px', borderRadius: 6}}>
            <option value="3d">3D Pulse</option>
            <option value="flip">Flip</option>
            <option value="bounce">Bounce</option>
            <option value="fade">Fade Slide</option>
          </select>
        </div>
      </div>
      <div className="stack-edu-panel" style={{maxWidth: 600}}>
        <div className="stack-info" style={{justifyContent: 'center', marginBottom: 18, color: '#111'}}>
          <span>Step: {steps.length ? stepIdx + 1 : 0} / {steps.length}</span>
        </div>
        <div className={`stack-container bubble-sort-container anim-${animationType} ${curr.i >= 0 || curr.j >= 0 ? 'wave-active' : ''} ${stepIdx === steps.length - 1 && steps.length > 1 ? 'sort-complete' : ''}`} style={{minHeight: 80, minWidth: 320, flexDirection: 'row', justifyContent: 'center', background: '#1a2233', boxShadow: '0 2px 16px rgba(0,0,0,0.10)'}}>
          {curr.arr.map((val, i) => {
            let barClass = "bar-3d";
            if (curr.i === i || curr.j === i) {
              barClass += curr.swapped ? " bar-swap" : " bar-active";
            } else if (stepIdx === steps.length - 1 && steps.length > 1) {
              barClass += " bar-completed";
            }
            return (
              <div
                key={i}
                className={`stack-block ${barClass} block-${animationType}`}
                style={{
                  width: 48,
                  minHeight: 48,
                  margin: '0 8px',
                  background: curr.i === i || curr.j === i ? (curr.swapped ? '#43e97b' : '#7b2ff2') : '#e0c3fc',
                  color: '#111',
                  fontWeight: 700,
                  fontSize: 20,
                  border: curr.i === i || curr.j === i ? '2.5px solid #fff' : '2.5px solid #e0c3fc',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <span>{val}</span>
                {curr.swapped && (curr.i === i || curr.j === i) && (
                  <>
                    <div className="particle-2"></div>
                    <div className="particle-3"></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Submission panel: show when experiment completed */}
      {steps.length > 1 && stepIdx === steps.length - 1 && !submitted && (
        <div style={{marginTop: 18, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center'}}>
          <button
            className="stack-btn push-btn"
            onClick={async () => {
              try {
                setSubmitting(true);
                // simple payload: input, steps performed, timestamp
                const payload = {
                  experiment: 'bubble-sort',
                  input: input,
                  stepsCount: steps.length,
                  completedAt: new Date().toISOString(),
                };
                // attempt server submit; if backend unimplemented, fallback to localStorage
                try {
                  const res = await API.post('/submissions', payload);
                  setSubmitMessage(res.data?.message || 'Submitted successfully');
                } catch (e) {
                  // fallback store locally
                  const local = JSON.parse(localStorage.getItem('vlab_submissions') || '[]');
                  local.push(payload);
                  localStorage.setItem('vlab_submissions', JSON.stringify(local));
                  setSubmitMessage('Saved locally (server unavailable)');
                }
                setSubmitted(true);
              } catch (err) {
                setSubmitMessage('Submission failed');
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Experiment'}
          </button>
          {submitMessage && <div style={{color: submitted ? '#43e97b' : '#e63946', fontWeight: 700}}>{submitMessage}</div>}
        </div>
      )}
      <div style={{marginTop: 32, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(44,44,84,0.07)', padding: '1.5rem 2rem'}}>
        <h2 style={{fontSize: '1.2rem', fontWeight: 700, color: '#111', marginBottom: 8}}>Quiz</h2>
        <form onSubmit={handleQuizSubmit} style={{display: 'flex', alignItems: 'center', gap: 12, color: '#111'}}>
          <span>What is the worst-case time complexity of Bubble Sort?</span>
          <input
            type="text"
            value={quizAnswer}
            onChange={e => setQuizAnswer(e.target.value)}
            className="stack-input"
            style={{width: 120, color: '#111'}}
          />
          <button className="stack-btn push-btn" type="submit">Submit</button>
        </form>
        {quizFeedback && <div style={{marginTop: 8, color: quizFeedback.startsWith('Correct') ? '#43e97b' : '#e63946', fontWeight: 600}}>{quizFeedback}</div>}
      </div>
      <div style={{marginTop: 32, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(44,44,84,0.07)', padding: '1.5rem 2rem'}}>
        <h2 style={{fontSize: '1.2rem', fontWeight: 700, color: '#111', marginBottom: 8}}>Coding Practice</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={8}
            style={{fontFamily: 'monospace', fontSize: 15, borderRadius: 8, border: '1.5px solid #9a8c98', padding: 10, background: '#f7f7fa', color: '#111'}}
          />
          <button className="stack-btn push-btn" style={{alignSelf: 'flex-start'}} onClick={handleCodeRun}>Run Code</button>
          {codeResult && <div style={{marginTop: 8, color: codeResult.startsWith('Error') ? '#e63946' : '#43e97b', fontWeight: 600}}>{codeResult}</div>}
        </div>
      </div>
    </div>
  );
}
