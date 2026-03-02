import React, { useRef, useState } from "react";
import "./StackArray.css";

const STACK_SIZE = 5;

const quizQuestions = [
  {
    question: "What is the time complexity of PUSH operation in an array-based stack?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  },
  {
    question: "What is the time complexity of POP operation in an array-based stack?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  },
  {
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correct: 1
  },
  {
    question: "What happens when you try to PUSH to a full stack?",
    options: ["Stack Underflow", "Stack Overflow", "Nothing", "Stack Reset"],
    correct: 1
  },
  {
    question: "What happens when you try to POP from an empty stack?",
    options: ["Stack Underflow", "Stack Overflow", "Nothing", "Stack Reset"],
    correct: 0
  },
  {
    question: "In an array-based stack, where is the top element stored?",
    options: ["Index 0", "Last occupied index", "Middle of array", "Random index"],
    correct: 1
  }
];

const problemBank = [
  {
    id: 1,
    description: "Write a function push(stack, value) that adds a value to the stack. Return the updated stack. Assume stack is an array.",
    tests: [
      { input: [[1, 2], 3], expected: [1, 2, 3] },
      { input: [[], 5], expected: [5] }
    ]
  },
  {
    id: 2,
    description: "Write a function pop(stack) that removes and returns the top element from the stack. Return [updatedStack, poppedValue].",
    tests: [
      { input: [[1, 2, 3]], expected: [[1, 2], 3] },
      { input: [[5]], expected: [[], 5] }
    ]
  },
  {
    id: 3,
    description: "Write a function isEmpty(stack) that checks if the stack is empty. Return true or false.",
    tests: [
      { input: [[]], expected: true },
      { input: [[1, 2]], expected: false }
    ]
  },
  {
    id: 4,
    description: "Write a function peek(stack) that returns the top element without removing it.",
    tests: [
      { input: [[1, 2, 3]], expected: 3 },
      { input: [[5]], expected: 5 }
    ]
  },
  {
    id: 5,
    description: "Write a function reverseStack(stack) that reverses the elements in the stack using only stack operations.",
    tests: [
      { input: [[1, 2, 3]], expected: [3, 2, 1] },
      { input: [[5, 4]], expected: [4, 5] }
    ]
  }
];

export default function StackArray() {
  const [stack, setStack] = useState(Array(STACK_SIZE).fill(undefined));
  const [top, setTop] = useState(-1);
  const [input, setInput] = useState("");
  const [log, setLog] = useState(["Stack initialized."]);
  const [warning, setWarning] = useState("");
  const [animDuration, setAnimDuration] = useState(400);
  const [animating, setAnimating] = useState(false);
  const [popIndex, setPopIndex] = useState(null);
  const [experimentRun, setExperimentRun] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const inputRef = useRef();

  function showWarning(msg) {
    setWarning(msg);
    setTimeout(() => setWarning(""), 1800);
  }

  function logOperation(msg) {
    setLog((prev) => [msg, ...prev.slice(0, 7)]);
  }

  function handlePush() {
    if (top >= STACK_SIZE - 1) {
      showWarning("Stack Overflow!");
      logOperation("PUSH failed: Stack Overflow!");
      return;
    }
    if (!input.trim()) {
      showWarning("Please enter a value.");
      return;
    }
    const newStack = [...stack];
    newStack[top + 1] = input;
    setStack(newStack);
    setTop(top + 1);
    logOperation(`PUSH: Inserted "${input}" at index ${top + 1}`);
    setInput("");
    inputRef.current && inputRef.current.focus();
    setAnimating(true);
    setTimeout(() => setAnimating(false), animDuration + 10);
    setExperimentRun(true);
  }

  function handlePop() {
    if (top < 0) {
      showWarning("Stack Underflow!");
      logOperation("POP failed: Stack Underflow!");
      return;
    }
    setPopIndex(top);
    setTimeout(() => {
      const newStack = [...stack];
      const popped = newStack[top];
      newStack[top] = undefined;
      setStack(newStack);
      logOperation(`POP: Removed "${popped}" from index ${top}`);
      setTop(top - 1);
      setPopIndex(null);
    }, animDuration);
    setExperimentRun(true);
  }

  function handleReset() {
    setStack(Array(STACK_SIZE).fill(undefined));
    setTop(-1);
    setLog((prev) => ["Stack reset.", ...prev.slice(0, 7)]);
    setWarning("");
    setPopIndex(null);
  }

  function handleSpeedChange(e) {
    setAnimDuration(Number(e.target.value));
  }

  function handleQuizAnswer(index, answer) {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = answer;
    setQuizAnswers(newAnswers);
  }

  function submitQuiz() {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  }

  function redoQuiz() {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  function exportQuiz() {
    // Create printable quiz report (only quiz results, not coding section)
    const html = `
      <html>
        <head>
          <title>Stack Quiz Results</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111 }
            h1 { color: #22223b }
            .q { margin-bottom: 12px }
            .correct { color: #2b8a3e; font-weight: 700 }
            .wrong { color: #b71c1c; font-weight: 700 }
          </style>
        </head>
        <body>
          <h1>Stack Quiz Results</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Score:</strong> ${quizScore} / ${quizQuestions.length}</p>
          <hr />
          ${quizQuestions.map((q, i) => {
            const user = quizAnswers[i];
            const correct = q.correct;
            return (`<div class="q"><div><strong>${i + 1}. ${q.question}</strong></div>
              <div>User Answer: <span class="${user === correct ? 'correct' : 'wrong'}">${user !== null ? q.options[user] : 'No answer'}</span></div>
              <div>Correct Answer: <span class="correct">${q.options[correct]}</span></div></div>`);
          }).join('')}
        </body>
      </html>`;

    // Open a new window synchronously (better chance to avoid popup blockers)
    const w = window.open('', '_blank');
    if (w) {
      try {
        w.document.open();
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); /* w.close(); */ }, 300);
        return;
      } catch (e) {
        // fallthrough to download fallback
      }
    }

    // Fallback: trigger download of the HTML file so user can open/print it manually
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stack-quiz-results.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Popup blocked: quiz report downloaded. Open the downloaded file to print.');
    } catch (err) {
      alert('Unable to open or download the quiz report. Please allow popups and try again.');
    }
  }

  function generateProblems() {
    const shuffled = [...problemBank].sort(() => 0.5 - Math.random());
    setCurrentProblems(shuffled.slice(0, 3));
    setCodes({});
    setResults({});
  }

  function handleCodeChange(problemId, code) {
    setCodes(prev => ({ ...prev, [problemId]: code }));
  }

  function runCode(problemId) {
    const problem = currentProblems.find(p => p.id === problemId);
    const code = codes[problemId];
    if (!code) {
      setResults(prev => ({ ...prev, [problemId]: "Please enter code" }));
      return;
    }
    try {
      // Extract function name from description
      const funcMatch = problem.description.match(/function\s+(\w+)/);
      const funcName = funcMatch ? funcMatch[1] : null;

      if (!funcName) {
        setResults(prev => ({ ...prev, [problemId]: "Incorrect Output" }));
        return;
      }

      let allCorrect = true;
      const actualResults = [];
      
      for (const test of problem.tests) {
        let result;
        if (test.input.length === 2) {
          // push: stack, value
          const func = new Function('stack', 'value', code + '; return ' + funcName + '(stack, value);');
          result = func([...test.input[0]], test.input[1]);
        } else {
          // pop, isEmpty, peek, reverseStack: stack
          const func = new Function('stack', code + '; return ' + funcName + '(stack);');
          result = func([...test.input[0]]);
        }
        
        actualResults.push(result);
        
        if (JSON.stringify(result) !== JSON.stringify(test.expected)) {
          allCorrect = false;
          break;
        }
      }
      setResults(prev => ({ 
        ...prev, 
        [problemId]: allCorrect 
          ? `Correct! Your outputs: ${actualResults.map(result => JSON.stringify(result)).join(', ')}`
          : "Incorrect Output" 
      }));
    } catch (e) {
      setResults(prev => ({ ...prev, [problemId]: "Incorrect Output" }));
    }
  }

  function analyzeCode(problemId) {
    const code = codes[problemId];
    if (!code) {
      alert("Please enter code to analyze");
      return;
    }
    
    // Store code analysis request in localStorage
    const analysisData = {
      code: code,
      problemId: problemId,
      algorithm: 'stack'
    };
    localStorage.setItem('vlab_code_analysis', JSON.stringify(analysisData));
    
    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  }

  function correctCode(problemId) {
    const code = codes[problemId];
    if (!code) {
      alert("Please enter code to correct");
      return;
    }
    
    // Store code correction request in localStorage
    const correctionData = {
      code: code,
      problemId: problemId,
      algorithm: 'stack',
      action: 'correct'
    };
    localStorage.setItem('vlab_code_correction', JSON.stringify(correctionData));
    
    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  }

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Stack Data Structure</h1>

      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize Stack operations using an array implementation.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A Stack is a linear data structure that follows the LIFO (Last In First Out) principle. Elements are added and removed from the same end, called the top.
        </p>
        <p>
          <strong>Operations:</strong>
        </p>
        <ul>
          <li><strong>PUSH:</strong> Add an element to the top of the stack</li>
          <li><strong>POP:</strong> Remove the top element from the stack</li>
          <li><strong>PEEK:</strong> View the top element without removing it</li>
          <li><strong>isEmpty:</strong> Check if the stack is empty</li>
        </ul>
        <p>
          <strong>Time Complexity:</strong> All operations are O(1)
        </p>
        <p>
          <strong>Space Complexity:</strong> O(n) where n is the maximum stack size
        </p>
      </section>

      <section className="card experiment">
        <h2>Experiment</h2>
        <form className="stack-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
          <label htmlFor="stack-input" className="stack-label">Enter Value:</label>
          <input
            id="stack-input"
            className="stack-input"
            type="text"
            name="value"
            placeholder="Value"
            value={input}
            onChange={e => setInput(e.target.value)}
            ref={inputRef}
          />
          <button
            type="button"
            className="stack-btn push-btn"
            onClick={handlePush}
            disabled={top >= STACK_SIZE - 1 || animating}
          >PUSH</button>
          <button
            type="button"
            className="stack-btn pop-btn"
            onClick={handlePop}
            disabled={top < 0 || animating}
          >POP</button>
          <button
            type="button"
            className="stack-btn reset-btn"
            onClick={handleReset}
          >RESET</button>
        </form>
        <div className="stack-speed-panel">
          <label htmlFor="stack-speed-slider" className="stack-label">Animation Speed:</label>
          <input
            id="stack-speed-slider"
            type="range"
            min="100"
            max="1000"
            value={animDuration}
            step="50"
            onChange={handleSpeedChange}
          />
          <span id="stack-speed-value">{animDuration}ms</span>
        </div>
        <div className="stack-edu-panel">
          <div className="stack-info">
            <span id="stack-size-info">Stack Size: {top + 1}</span>
            <span id="stack-top-info">Top Index: {top}</span>
          </div>
          <div className="top-pointer">{top === -1 ? "Top: -1 (Stack Empty)" : `Top: ${top}`}</div>
          {warning && <div className="stack-warning show">{warning}</div>}
          <section className="stack-container" aria-label="Stack Visualization">
            {stack.map((val, i) =>
              val !== undefined ? (
                <div
                  key={i}
                  className={
                    "stack-block" +
                    (i === top ? " top" : "") +
                    (animating && i === top ? " push-anim push-anim-active" : "") +
                    (popIndex === i ? " pop-anim" : "")
                  }
                  style={{ transitionDuration: animDuration + "ms" }}
                >
                  {val}
                </div>
              ) : null
            )}
          </section>
          <div className="stack-log-panel">
            <div className="stack-log-title">Operation Log</div>
            <ul id="stack-log-list" className="stack-log-list">
              {log.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Quiz</h2>
        {!experimentRun ? (
          <p>Please perform some stack operations before attempting the quiz.</p>
        ) : (
          <div>
            {quizQuestions.map((q, i) => (
              <div key={i} className="quiz-question">
                <p><strong>{i + 1}. {q.question}</strong></p>
                {q.options.map((opt, j) => (
                  <label key={j} className={`quiz-option ${quizSubmitted ? (j === q.correct ? 'correct' : (quizAnswers[i] === j ? 'wrong' : '')) : ''}`}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      checked={quizAnswers[i] === j}
                      onChange={() => handleQuizAnswer(i, j)}
                      disabled={quizSubmitted}
                    />
                    {opt}
                    {quizSubmitted && j === q.correct && quizAnswers[i] !== j && <span> (Correct)</span>}
                  </label>
                ))}
              </div>
            ))}
            {!quizSubmitted ? (
              <button className="btn primary" onClick={submitQuiz} disabled={quizAnswers.includes(null)}>Submit Quiz</button>
            ) : (
              <div>
                <p><strong>Experiment:</strong> Stack Data Structure SimuLab: Virtual Lab</p>
                <p><strong>Date/Time:</strong> {new Date().toLocaleString()}</p>
                <p>Score: {quizScore} / {quizQuestions.length}</p>
                <button className="btn secondary" onClick={redoQuiz}>Redo Quiz</button>
                <button className="btn primary" onClick={exportQuiz}>Export Results</button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Coding Practice</h2>
        <p>Test your understanding by implementing stack operations. Write your code manually without hints.</p>
        <button className="btn primary" onClick={generateProblems}>Generate Problems</button>
        {currentProblems.map(problem => (
          <div key={problem.id} className="coding-problem">
            <h3>Problem {problem.id}</h3>
            <p>{problem.description}</p>
            <textarea
              value={codes[problem.id] || ""}
              onChange={e => handleCodeChange(problem.id, e.target.value)}
              placeholder="Write your code here..."
              rows={8}
              style={{ width: '100%', fontFamily: 'monospace', color: '#000000' }}
            />
            <button className="btn secondary" onClick={() => runCode(problem.id)}>Run Code</button>
            <button className="btn info" onClick={() => analyzeCode(problem.id)}>Analyze Code</button>
            <button className="btn success" onClick={() => correctCode(problem.id)}>Correct Code</button>
            {results[problem.id] && <p className="result">{results[problem.id]}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}
