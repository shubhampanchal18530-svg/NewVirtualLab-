import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentDialog from '../components/PaymentDialog';
import "./SortingLab.css";

const quizQuestions = {
  bubble: [
    {
      question: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 2
    },
    {
      question: "What is the space complexity of Bubble Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 3
    },
    {
      question: "In Bubble Sort, after each pass, which element is guaranteed to be in its correct position?",
      options: ["The smallest element", "The largest element", "A random element", "None"],
      correct: 1
    },
    {
      question: "How many comparisons are made in the first pass of Bubble Sort for an array of size n?",
      options: ["n", "n-1", "n-2", "n+1"],
      correct: 1
    },
    {
      question: "Bubble Sort is stable. What does this mean?",
      options: ["It uses constant space", "Equal elements maintain their relative order", "It sorts in place", "It is fast"],
      correct: 1
    },
    {
      question: "When is Bubble Sort most efficient?",
      options: ["When the array is already sorted", "When the array is in reverse order", "When elements are random", "Never"],
      correct: 0
    }
  ],
  selection: [
    {
      question: "What is the time complexity of Selection Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 2
    },
    {
      question: "What is the space complexity of Selection Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 3
    },
    {
      question: "In Selection Sort, how many swaps are performed in the worst case for an array of size n?",
      options: ["n", "n-1", "n-2", "Depends on input"],
      correct: 1
    },
    {
      question: "Selection Sort is stable. True or False?",
      options: ["True", "False"],
      correct: 1
    },
    {
      question: "What is the main advantage of Selection Sort over Bubble Sort?",
      options: ["Fewer comparisons", "Fewer swaps", "Better worst-case time", "It is stable"],
      correct: 1
    },
    {
      question: "In Selection Sort, the sorted subarray is built from:",
      options: ["Left to right", "Right to left", "Middle outwards", "Randomly"],
      correct: 0
    }
  ]
};

const problemBank = [
  {
    id: 1,
    algorithm: "bubble",
    description: "Write a function bubbleSort(arr) that sorts the given array in ascending order using Bubble Sort algorithm. The function should modify the array in place.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
      { input: [1, 2, 3], expected: [1, 2, 3] }
    ]
  },
  {
    id: 2,
    algorithm: "bubble",
    description: "Implement an optimized Bubble Sort that stops early if no swaps are made in a pass. Function: optimizedBubbleSort(arr)",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
      { input: [5, 1, 2, 3, 4], expected: [1, 2, 3, 4, 5] }
    ]
  },
  {
    id: 3,
    algorithm: "bubble",
    description: "Write a function that counts the number of swaps in Bubble Sort. Function: countSwaps(arr) - return the swap count.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 4 },
      { input: [1, 2, 3], expected: 0 },
      { input: [2, 1], expected: 1 }
    ]
  },
  {
    id: 4,
    algorithm: "bubble",
    description: "Implement Bubble Sort for descending order. Function: bubbleSortDesc(arr)",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [5, 4, 3, 1, 1] },
      { input: [1, 2, 3], expected: [3, 2, 1] }
    ]
  },
  {
    id: 5,
    algorithm: "bubble",
    description: "Write a function to check if an array is already sorted using Bubble Sort logic. Function: isSorted(arr) - return true or false.",
    tests: [
      { input: [1, 2, 3, 4, 5], expected: true },
      { input: [3, 1, 4, 1, 5], expected: false },
      { input: [5, 4, 3, 2, 1], expected: false }
    ]
  },
  {
    id: 6,
    algorithm: "selection",
    description: "Write a function selectionSort(arr) that sorts the given array in ascending order using Selection Sort algorithm. The function should modify the array in place.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
      { input: [1, 2, 3], expected: [1, 2, 3] }
    ]
  },
  {
    id: 7,
    algorithm: "selection",
    description: "Implement Selection Sort for descending order. Function: selectionSortDesc(arr) - modify the array in place to sort in descending order.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [5, 4, 3, 1, 1] },
      { input: [1, 2, 3], expected: [3, 2, 1] }
    ]
  },
  {
    id: 8,
    algorithm: "selection",
    description: "Write a function that counts the number of swaps performed during Selection Sort. Function: countSwapsSelection(arr) - return the total number of swaps needed.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 3 },
      { input: [1, 2, 3], expected: 0 },
      { input: [2, 1], expected: 1 }
    ]
  },
  {
    id: 9,
    algorithm: "selection",
    description: "Write a function to find the index of the minimum element in an array starting from a given position. Function: findMinIndex(arr, startIndex) - return the index of the smallest element from startIndex onwards.",
    tests: [
      { input: [[3, 1, 4, 1, 5], 0], expected: 1 },
      { input: [[5, 4, 3, 2, 1], 2], expected: 4 },
      { input: [[1, 2, 3], 0], expected: 0 }
    ]
  },
  {
    id: 10,
    algorithm: "selection",
    description: "Implement Selection Sort and return the number of passes performed. Function: selectionSortWithPasses(arr) - sort the array and return the number of passes (n-1 for array of size n).",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 4 },
      { input: [1, 2, 3], expected: 2 },
      { input: [2, 1], expected: 1 }
    ]
  }
];

function SortingLab() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  const [experimentsList, setExperimentsList] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState('');
  const [purchaseExpiry, setPurchaseExpiry] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [input, setInput] = useState("5, 2, 9, 1, 6");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [steps, setSteps] = useState([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [info, setInfo] = useState("");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const timer = useRef(null);

  function parseInput(text) {
    return text.split(/,|\s+/).map(Number).filter(n => !isNaN(n));
  }

  function generateSteps(a0) {
    const a = [...a0];
    const s = [];
    let comp = 0;
    let sw = 0;

    s.push({ array: [...a], j: null, info: "Initial array loaded. Ready to begin sorting.", i: null, minIndex: null, pass: 0 });

    if (selectedAlgorithm === "bubble") {
      for (let i = 0; i < a.length - 1; i++) {
        let swapped = false;
        const currentPass = i + 1;
        s.push({
          array: [...a],
          j: null,
          info: `Pass ${currentPass}: Starting bubble sort pass. Elements from index 0 to ${a.length - i - 1} will be compared.`,
          comp,
          sw,
          i: null,
          minIndex: null,
          pass: currentPass
        });

        for (let j = 0; j < a.length - i - 1; j++) {
          comp++;
          s.push({
            array: [...a],
            j,
            info: `Pass ${currentPass}: Comparing elements at positions ${j} and ${j + 1} (${a[j]} > ${a[j + 1]}?)`,
            comp,
            sw,
            i: null,
            minIndex: null,
            pass: currentPass
          });

          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            sw++;
            swapped = true;
            s.push({
              array: [...a],
              j,
              info: `Pass ${currentPass}: Elements swapped! ${a[j]} moved to position ${j}, ${a[j + 1]} moved to position ${j + 1}`,
              comp,
              sw,
              i: null,
              minIndex: null,
              pass: currentPass
            });
          } else {
            s.push({
              array: [...a],
              j,
              info: `Pass ${currentPass}: No swap needed. Elements are already in correct order.`,
              comp,
              sw,
              i: null,
              minIndex: null,
              pass: currentPass
            });
          }
        }

        s.push({
          array: [...a],
          j: null,
          info: `Pass ${currentPass} complete. Largest element (${a[a.length - i - 1]}) is now in its final position.`,
          comp,
          sw,
          i: null,
          minIndex: null,
          pass: currentPass
        });

        if (!swapped) {
          s.push({
            array: [...a],
            j: null,
            info: `Optimization: No swaps occurred in pass ${currentPass}. Array is already sorted!`,
            comp,
            sw,
            i: null,
            minIndex: null,
            pass: currentPass
          });
          break;
        }
      }

      s.push({
        array: [...a],
        j: null,
        info: `Bubble Sort complete! Array is now fully sorted.`,
        comp,
        sw,
        i: null,
        minIndex: null,
        pass: null
      });
    } else if (selectedAlgorithm === "selection") {
      let pass = 1;
      for (let i = 0; i < a.length - 1; i++) {
        let minIdx = i;
        s.push({
          array: [...a],
          i,
          j: null,
          minIndex: minIdx,
          info: `Pass ${pass}: Finding minimum element starting from position ${i} in the unsorted portion`,
          comp,
          sw,
          pass
        });
        for (let j = i + 1; j < a.length; j++) {
          comp++;
          s.push({
            array: [...a],
            i,
            j,
            minIndex: minIdx,
            info: `Pass ${pass}: Comparing element at position ${j} (${a[j]}) with current minimum at position ${minIdx} (${a[minIdx]})`,
            comp,
            sw,
            pass
          });
          if (a[j] < a[minIdx]) {
            minIdx = j;
            s.push({
              array: [...a],
              i,
              j,
              minIndex: minIdx,
              info: `Pass ${pass}: New minimum found! Element ${a[minIdx]} at position ${minIdx} is smaller than previous minimum`,
              comp,
              sw,
              pass
            });
          }
        }
        if (minIdx !== i) {
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          sw++;
          s.push({
            array: [...a],
            i,
            j: null,
            minIndex: minIdx,
            info: `Pass ${pass}: Swapping minimum element (${a[minIdx]}) from position ${minIdx} with element at position ${i} (${a[i]})`,
            comp,
            sw,
            pass
          });
        } else {
          s.push({
            array: [...a],
            i,
            j: null,
            minIndex: minIdx,
            info: `Pass ${pass}: No swap needed. Minimum element is already at position ${i}`,
            comp,
            sw,
            pass
          });
        }
        s.push({
          array: [...a],
          i: i + 1,
          j: null,
          minIndex: null,
          info: `Pass ${pass} completed`,
          comp,
          sw,
          pass
        });
        pass++;
      }
    }

    s.push({
      array: [...a],
      j: null,
      info: "Array is sorted",
      comp,
      sw,
      i: null,
      minIndex: null,
      pass: null
    });

    return s;
  }

  function start() {
    // Prevent running paid experiments without purchase
    if (selectedExp && selectedExp.requiresPayment && !hasAccess) {
      setPurchaseMsg('This experiment requires purchase. Please buy access to run it.');
      return;
    }
    const a = parseInput(input);
    if (a.length < 2) return;
    const s = generateSteps(a);
    setSteps(s);
    setIdx(0);
    setInfo(s[0]?.info || "Starting simulation...");
    setComparisons(s[0]?.comp || 0);
    setSwaps(s[0]?.sw || 0);
    setPlaying(true);
    setExperimentRun(true);
    
    // Track completed experiments
    // Persist per-user progress if available
    try {
      const currentUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (currentUser && currentUser.id) {
        const key = `vlab_progress_${currentUser.id}`;
        const prog = JSON.parse(localStorage.getItem(key) || '{}');
        prog.experiments = prog.experiments || [];
        if (!prog.experiments.includes(selectedAlgorithm)) {
          prog.experiments.push(selectedAlgorithm);
        }
        prog.lastExperimentRun = Date.now();
        localStorage.setItem(key, JSON.stringify(prog));
      } else {
        const completed = JSON.parse(localStorage.getItem('vlab_completed_experiments') || '[]');
        if (!completed.includes(selectedAlgorithm)) {
          completed.push(selectedAlgorithm);
          localStorage.setItem('vlab_completed_experiments', JSON.stringify(completed));
        }
      }
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  // Fetch experiments and check access for a sorting experiment
  useEffect(() => {
    const fetchExps = async () => {
      try {
        // First, seed the sorting experiment to ensure it exists with payment enabled
        try {
          const seedRes = await axios.post('http://localhost:5000/api/experiments/seed/sorting-experiment');
          console.log('✓ Seeded/updated sorting experiment:', seedRes.data.experiment);
        } catch (seedErr) {
          console.warn('Seed warning (non-critical):', seedErr.message);
        }

        // Then fetch all experiments
        const res = await axios.get('http://localhost:5000/api/experiments');
        const expList = res.data || [];
        console.log('Fetched experiments:', expList);
        setExperimentsList(expList);
        
        // Find the sorting experiment
        const sorting = expList.find(e => e.type === 'sorting');
        console.log('Found sorting experiment:', sorting);
        
        if (sorting) {
          console.log('Setting selected experiment, requiresPayment:', sorting.requiresPayment);
          setSelectedExp(sorting);
          // Check access after setting the experiment
          setTimeout(() => checkAccess(sorting._id), 300);
        } else {
          console.warn('No sorting experiment found in list');
        }
      } catch (e) {
        console.error('Error fetching experiments:', e);
      }
    };
    fetchExps();
  }, []);

  const checkAccess = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔐 Checking access for experiment:', id, 'Token exists:', !!token);
      
      const res = await axios.get(`http://localhost:5000/api/experiments/${id}/access`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      console.log('✓ Access check response:', res.data);
      console.log('Setting hasAccess to:', !!res.data.access);
      setHasAccess(!!res.data.access);
    } catch (e) {
      console.error('✗ Error checking access:', e.response?.data || e.message);
      setHasAccess(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedExp) return;
    if (!user) {
      setPurchaseMsg('Please login to purchase.');
      return;
    }
    setPurchaseLoading(true);
    setPurchaseMsg('');
    try {
      const res = await axios.post(`http://localhost:5000/api/experiments/${selectedExp._id}/purchase`, { confirmPayment: true });
      setHasAccess(true);
      setPurchaseExpiry(res.data.purchase?.expiryDate || res.data.expiryDate || null);
      setPurchaseMsg('Purchase successful');
    } catch (e) {
      setPurchaseMsg(e.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleGooglePayClick = () => {
    console.log('🔵 Pay button clicked');
    console.log('selectedExp:', selectedExp);
    console.log('user:', user);
    if (!selectedExp || !user) {
      console.log('❌ Missing selectedExp or user');
      setPurchaseMsg('Please login to purchase.');
      return;
    }
    console.log('✓ Setting showPaymentDialog to true');
    setShowPaymentDialog(true);
    setPurchaseMsg('');
  };

  const handleGooglePaySuccess = async () => {
    console.log('💳 Confirm Payment clicked');
    if (!selectedExp || !user) {
      console.log('❌ Missing selectedExp or user');
      setPurchaseMsg('Please login to purchase.');
      setShowPaymentDialog(false);
      return;
    }
    setPurchaseLoading(true);
    setPurchaseMsg('Processing payment...');
    try {
      // Generate a simulated Google Pay token
      const googlePayToken = `goog_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('🔐 Generated token:', googlePayToken);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('🔐 JWT token exists:', !!token);
      
      console.log('📤 Sending payment request to backend...');
      const res = await axios.post(`http://localhost:5000/api/experiments/${selectedExp._id}/purchase`, {
        googlePayToken: googlePayToken
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✓ Payment successful:', res.data);
      setHasAccess(true);
      setPurchaseExpiry(res.data.expiryDate || null);
      
      // Store payment details for receipt
      const paymentData = {
        experimentTitle: selectedExp.title,
        amount: selectedExp.price || 1,
        currency: 'INR',
        duration: res.data.durationDays || 30,
        expiryDate: new Date(res.data.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        orderId: res.data.purchase?.orderId || `order_${Date.now()}`,
        transactionId: googlePayToken.substring(0, 15) + '...',
        purchaseDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      
      setPaymentDetails(paymentData);
      setPurchaseMsg('✓ Payment successful!');
      setShowPaymentDialog(false);
      setShowPaymentReceipt(true);
    } catch (e) {
      console.error('❌ Payment error:', e);
      const errorMsg = e.response?.data?.message || 'Payment failed. Please try again.';
      setPurchaseMsg('✗ ' + errorMsg);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setPurchaseMsg('');
  };

  const closePaymentReceipt = () => {
    setShowPaymentReceipt(false);
    setPaymentDetails(null);
  };

  function pause() {
    setPlaying(false);
    clearInterval(timer.current);
  }

  function reset() {
    setPlaying(false);
    clearInterval(timer.current);
    setSteps([]);
    setIdx(0);
    setInfo("");
    setComparisons(0);
    setSwaps(0);
  }

  function nextStep() {
    if (idx < steps.length - 1) {
      const nextIdx = idx + 1;
      const nextStep = steps[nextIdx];
      setIdx(nextIdx);
      setInfo(nextStep.info);
      setComparisons(nextStep.comp);
      setSwaps(nextStep.sw);
    }
  }

  function prevStep() {
    if (idx > 0) {
      const prevIdx = idx - 1;
      const prevStep = steps[prevIdx];
      setIdx(prevIdx);
      setInfo(prevStep.info);
      setComparisons(prevStep.comp);
      setSwaps(prevStep.sw);
    }
  }

  function handleQuizAnswer(index, answer) {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = answer;
    setQuizAnswers(newAnswers);
  }

  function submitQuiz() {
    let score = 0;
    quizQuestions[selectedAlgorithm].forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Store quiz result (also per-user)
    const quizResult = { correct: score, total: quizQuestions[selectedAlgorithm].length, algorithm: selectedAlgorithm, timestamp: Date.now() };
    try {
      const currentUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (currentUser && currentUser.id) {
        const key = `vlab_progress_${currentUser.id}`;
        const prog = JSON.parse(localStorage.getItem(key) || '{}');
        prog.quizzes = prog.quizzes || [];
        prog.quizzes.push(quizResult);
        localStorage.setItem(key, JSON.stringify(prog));
      } else {
        const existingScores = JSON.parse(localStorage.getItem('vlab_scores') || '[]');
        existingScores.push(quizResult);
        localStorage.setItem('vlab_scores', JSON.stringify(existingScores));
      }
    } catch (e) {
      console.error('Error saving quiz result:', e);
    }
    
    // Set flag for AI to show stats
    localStorage.setItem('vlab_last_quiz_completion', Date.now().toString());
  }

  function redoQuiz() {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  function exportQuiz() {
    // Create printable quiz report (only quiz results, not coding section)
    const questions = quizQuestions[selectedAlgorithm] || [];
    // Use real user data
    const studentDetails = user ? {
      name: user.name,
      email: user.email,
      studentId: user.id,
      lab: selectedAlgorithm === 'bubble' ? 'Bubble Sort Lab' : 'Selection Sort Lab'
    } : {
      name: 'Unknown',
      email: 'unknown@example.com',
      studentId: 'N/A',
      lab: selectedAlgorithm === 'bubble' ? 'Bubble Sort Lab' : 'Selection Sort Lab'
    };
    const html = `
      <html>
        <head>
          <title>Sorting Quiz Results</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111 }
            h1 { color: #22223b }
            .student-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .q { margin-bottom: 12px }
            .correct { color: #2b8a3e; font-weight: 700 }
            .wrong { color: #b71c1c; font-weight: 700 }
          </style>
        </head>
        <body>
          <h1>Sorting Quiz Results - ${selectedAlgorithm}</h1>
          
          <div class="student-info">
            <h2>Student Information</h2>
            <p><strong>Name:</strong> ${studentDetails.name}</p>
            <p><strong>Email:</strong> ${studentDetails.email}</p>
            <p><strong>Student ID:</strong> ${studentDetails.studentId}</p>
            <p><strong>Lab:</strong> ${studentDetails.lab}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Score:</strong> ${quizScore} / ${questions.length}</p>
          </div>
          
          <hr />
          <h2>Quiz Answers</h2>
          ${questions.map((q, i) => {
            const userAnswer = quizAnswers[i];
            const correct = q.correct;
            return (`<div class="q"><div><strong>${i + 1}. ${q.question}</strong></div>
              <div>User Answer: <span class="${userAnswer === correct ? 'correct' : 'wrong'}">${userAnswer !== null ? q.options[userAnswer] : 'No answer'}</span></div>
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
      a.download = 'sorting-quiz-results.html';
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
    const filteredProblems = problemBank.filter(p => p.algorithm === selectedAlgorithm);
    const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
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
      const funcMatch = problem.description.match(/Function:\s*(\w+)/);
      const funcName = funcMatch ? funcMatch[1] : null;

      if (!funcName) {
        setResults(prev => ({ ...prev, [problemId]: "Incorrect Output" }));
        return;
      }

      let allCorrect = true;
      const actualResults = [];

      for (const test of problem.tests) {
        let result;

        // Create function that executes the student's code and calls their function
        if (problem.id === 9) {
          // findMinIndex(arr, startIndex) - returns index
          const func = new Function('arr', 'startIndex', code + '; return ' + funcName + '(arr, startIndex);');
          result = func(test.input[0], test.input[1]);
        } else if (problem.id === 10) {
          // selectionSortWithPasses(arr) - returns number of passes
          const func = new Function('arr', code + '; return ' + funcName + '(arr);');
          result = func([...test.input]);
        } else if ([3, 5, 8].includes(problem.id)) {
          // Functions that return values: countSwaps, isSorted, countSwapsSelection
          const func = new Function('arr', code + '; return ' + funcName + '(arr);');
          result = func([...test.input]);
        } else {
          // Functions that modify array in place: bubbleSort, optimizedBubbleSort, bubbleSortDesc, selectionSort, selectionSortDesc
          const func = new Function('arr', code + '; ' + funcName + '(arr); return arr;');
          result = func([...test.input]);
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

      // Track coding practice attempts
      if (allCorrect) {
        const practice = JSON.parse(localStorage.getItem('vlab_practice') || '{}');
        practice[selectedAlgorithm] = (practice[selectedAlgorithm] || 0) + 1;
        localStorage.setItem('vlab_practice', JSON.stringify(practice));
      }
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
      algorithm: selectedAlgorithm
    };
    localStorage.setItem('vlab_code_analysis', JSON.stringify(analysisData));
    
    // Open AI assistant if not already open
    // Since AI assistant is always present, it will detect the change
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
      algorithm: selectedAlgorithm,
      action: 'correct'
    };
    localStorage.setItem('vlab_code_correction', JSON.stringify(correctionData));
    
    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  }

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions[selectedAlgorithm].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [selectedAlgorithm]);

  // Update AI Assistant context
  useEffect(() => {
    localStorage.setItem('vlab_current_algorithm', selectedAlgorithm);
  }, [selectedAlgorithm]);

  // Handle automatic stepping through simulation
  useEffect(() => {
    if (playing && steps.length > 0) {
      timer.current = setInterval(() => {
        setIdx(prevIdx => {
          if (prevIdx >= steps.length - 1) {
            setPlaying(false);
            clearInterval(timer.current);
            return prevIdx;
          }
          const nextIdx = prevIdx + 1;
          const nextStep = steps[nextIdx];
          if (nextStep) {
            setInfo(nextStep.info);
            setComparisons(nextStep.comp);
            setSwaps(nextStep.sw);
          }
          return nextIdx;
        });
      }, speed);
    } else {
      clearInterval(timer.current);
    }

    return () => clearInterval(timer.current);
  }, [playing, steps, speed]);

  const current = steps[idx] || {};
  const highlight = current.j;

  const algorithmNames = {
    bubble: "Bubble Sort",
    selection: "Selection Sort"
  };

  if (loading) {
    return <div className="lab-page"><p>Loading...</p></div>;
  }

  if (!user) {
    return <div className="lab-page"><p>Please log in to access the lab.</p></div>;
  }

  // Show locked experiment view if payment is required but not paid
  if (selectedExp && selectedExp.requiresPayment && !hasAccess) {
    return (
      <>
        <div className="lab-page">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '50px',
              borderRadius: '15px',
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              {/* Lock Icon */}
              <div style={{ fontSize: 80, marginBottom: 20, color: '#d1495a' }}>
                🔒
              </div>

              {/* Title */}
              <h1 style={{ margin: '0 0 20px 0', color: '#333', fontSize: 32 }}>
                Experiment Locked
              </h1>

              {/* Experiment Name */}
              <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>
                <strong>{selectedExp.title}</strong>
              </p>

              {/* Info Box */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: 30,
                borderLeft: '4px solid #2980b9'
              }}>
                <p style={{ margin: '10px 0', color: '#333' }}>
                  <strong>To access this experiment, you need to purchase a subscription</strong>
                </p>
                <p style={{ margin: '10px 0', color: '#666', fontSize: 14 }}>
                  Get <strong>{selectedExp.defaultDurationDays || 30} days</strong> of full access for just <strong>₹{selectedExp.price || 1}</strong>
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 30, textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, marginBottom: 15, color: '#333' }}>What You'll Get:</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '8px 0', color: '#555', borderBottom: '1px solid #eee' }}>
                    ✓ Full access to {selectedExp.title}
                  </li>
                  <li style={{ padding: '8px 0', color: '#555', borderBottom: '1px solid #eee' }}>
                    ✓ Step-by-step visualizations
                  </li>
                  <li style={{ padding: '8px 0', color: '#555', borderBottom: '1px solid #eee' }}>
                    ✓ Interactive quizzes and practice problems
                  </li>
                  <li style={{ padding: '8px 0', color: '#555' }}>
                    ✓ Valid for {selectedExp.defaultDurationDays || 30} days from purchase
                  </li>
                </ul>
              </div>

              {/* Price Card */}
              <div style={{
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: 30
              }}>
                <p style={{ margin: 0, fontSize: 14 }}>Subscription Price</p>
                <p style={{ margin: '10px 0 0 0', fontSize: 42, fontWeight: 'bold' }}>
                  ₹{selectedExp.price || 1}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: 12, opacity: 0.9 }}>
                  for {selectedExp.defaultDurationDays || 30} days access
                </p>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleGooglePayClick}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '15px 30px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  backgroundColor: '#2980b9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: 15,
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1f618d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2980b9'}
              >
                💳 Pay with Google Pay
              </button>

              {/* Info Text */}
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
                Payment is secure and encrypted. You'll get instant access after payment.
              </p>
            </div>
          </div>
        </div>
        { /* keep payment dialog code below, even when locked */ }
        {showPaymentDialog && (
          <PaymentDialog
            selectedExp={selectedExp}
            user={user}
            onSuccess={() => {
              setHasAccess(true);
              setPurchaseMsg('✓ Payment verified! Access granted.');
            }}
            onClose={() => {
              setShowPaymentDialog(false);
              setPurchaseMsg('');
            }}
            isLoading={purchaseLoading}
            setLoading={setPurchaseLoading}
            setMessage={setPurchaseMsg}
          />
        )}
      </>
    );
  }

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – {algorithmNames[selectedAlgorithm]}</h1>

      <section className="card">
        <h2>Algorithm Selection</h2>
        <select value={selectedAlgorithm} onChange={e => setSelectedAlgorithm(e.target.value)} style={{ color: "#000000" }}>
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
        </select>
      </section>

      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize {algorithmNames[selectedAlgorithm]} through step-by-step
          comparisons and swaps.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        {selectedAlgorithm === "bubble" ? (
          <>
            <p>
              Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.
            </p>
            <p>
              <strong>Algorithm:</strong>
            </p>
            <ol>
              <li>Start from the first element, compare it with the next one.</li>
              <li>If the first element is greater than the second, swap them.</li>
              <li>Move to the next pair and repeat the comparison and swap if necessary.</li>
              <li>After each pass, the largest element "bubbles" to the end.</li>
              <li>Repeat the process for the remaining unsorted elements.</li>
            </ol>
            <p>
              <strong>Time Complexity:</strong> O(n²) in worst and average case, O(n) in best case (when already sorted).
            </p>
            <p>
              <strong>Space Complexity:</strong> O(1) as it sorts in place.
            </p>
          </>
        ) : (
          <>
            <p>
              Selection Sort is a simple sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly selects the smallest (or largest) element from the unsorted sublist and moves it to the sorted sublist.
            </p>
            <p>
              <strong>Algorithm:</strong>
            </p>
            <ol>
              <li>Find the minimum element in the unsorted array.</li>
              <li>Swap it with the first element of the unsorted array.</li>
              <li>Move the boundary between sorted and unsorted arrays one element to the right.</li>
              <li>Repeat until the entire array is sorted.</li>
            </ol>
            <p>
              <strong>Time Complexity:</strong> O(n²) in all cases.
            </p>
            <p>
              <strong>Space Complexity:</strong> O(1) as it sorts in place.
            </p>
          </>
        )}
      </section>

      <section className="card experiment">
        <h2>Experiment</h2>

        <div className="controls">
          <div>
            <label>Input Array</label>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ color: "#ffffff" }}
            />
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={start} disabled={selectedExp && selectedExp.requiresPayment && !hasAccess}>Start</button>
            <button className="btn secondary" onClick={pause}>Pause</button>
            <button className="btn danger" onClick={reset}>Reset</button>
            <button className="btn secondary" onClick={prevStep} disabled={idx === 0 || steps.length === 0}>Previous</button>
            <button className="btn secondary" onClick={nextStep} disabled={idx >= steps.length - 1 || steps.length === 0}>Next</button>
          </div>
        </div>

        {/* Purchase / Access UI */}
        <div style={{ marginTop: 12 }}>
          {selectedExp ? (
            selectedExp.requiresPayment ? (
              <div>
                <p>
                  Access for: <strong>{selectedExp.title}</strong> — Price: <strong>₹{selectedExp.price || 1} INR</strong>
                </p>
                {hasAccess ? (
                  <p>Access granted{purchaseExpiry ? ` until ${new Date(purchaseExpiry).toLocaleString()}` : ''}.</p>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ marginBottom: 10, fontSize: 14 }}>
                      <strong>Pay ₹{selectedExp.price || 1} via Google Pay</strong>
                    </p>
                    <button
                      className="btn primary"
                      onClick={handleGooglePayClick}
                      disabled={purchaseLoading}
                      style={{ marginBottom: 10, padding: '10px 20px', fontSize: 14 }}
                    >
                      💳 Pay with Google Pay
                    </button>
                    {purchaseMsg && (
                      <p style={{ 
                        color: purchaseMsg.includes('✓') ? 'green' : 'red', 
                        marginTop: 10,
                        fontSize: 13
                      }}>
                        {purchaseMsg}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p>This experiment is free to use.</p>
            )
          ) : (
            <p>No sorting experiment found on the server.</p>
          )}
        </div>

        <div className="stats">
          <span>Comparisons: <b>{comparisons}</b></span>
          <span>Swaps: <b>{swaps}</b></span>
          {current.pass && <span>Pass: <b>{current.pass}</b></span>}
          <span>Step: <b>{idx}</b> / {steps.length - 1}</span>
        </div>

        <div className="info-box">
          {info || "Click Start to begin the experiment"}
        </div>

        <div className="workspace">
          {(current.array || []).map((v, i) => {
            let className = "cell";
            if (selectedAlgorithm === "selection") {
              if (i === current.i) className += " current-i";
              if (i === current.j) className += " scanning-j";
              if (i === current.minIndex) className += " min-index";
            } else {
              if (i === highlight || i === highlight + 1) className += " active";
            }
            return (
              <div key={i} className={className}>
                {v}
              </div>
            );
          })}
        </div>

        <div className="speed">
          <label>Animation Speed: {speed} ms</label>
          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          />
        </div>
      </section>

      <section className="card">
        <h2>Quiz</h2>
        {!experimentRun ? (
          <p>Please run the experiment at least once before attempting the quiz.</p>
        ) : (
          <div>
            {quizQuestions[selectedAlgorithm].map((q, i) => (
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
                <p><strong>Experiment:</strong> {algorithmNames[selectedAlgorithm]} SimuLab: Virtual Lab</p>
                <p><strong>Date/Time:</strong> {new Date().toLocaleString()}</p>
                <p>Score: {quizScore} / {quizQuestions[selectedAlgorithm].length}</p>
                <button className="btn secondary" onClick={redoQuiz}>Redo Quiz</button>
                <button className="btn primary" onClick={exportQuiz}>Export Results</button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Coding Practice</h2>
        <p>Test your understanding by implementing sorting algorithms. Write your code manually without hints.</p>
        <button className="btn primary" onClick={generateProblems}>Generate Problems</button>
        {currentProblems.map((problem, index) => (
          <div key={problem.id} className="coding-problem">
            <h3>Problem {index + 1}</h3>
            <p>{problem.description}</p>
            <textarea
              value={codes[problem.id] || ""}
              onChange={e => handleCodeChange(problem.id, e.target.value)}
              placeholder="Write your code here..."
              rows={10}
              style={{ width: '100%', fontFamily: 'monospace', color: '#000000' }}
            />
            <button className="btn secondary" onClick={() => runCode(problem.id)}>Run Code</button>
            <button className="btn info" onClick={() => analyzeCode(problem.id)}>Analyze Code</button>
            <button className="btn success" onClick={() => correctCode(problem.id)}>Correct Code</button>
            {results[problem.id] && <p className="result">{results[problem.id]}</p>}
          </div>
        ))}
      </section>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <PaymentDialog
          selectedExp={selectedExp}
          user={user}
          onSuccess={() => {
            setHasAccess(true);
            setPurchaseMsg('✓ Payment verified! Access granted.');
          }}
          onClose={() => {
            setShowPaymentDialog(false);
            setPurchaseMsg('');
          }}
          isLoading={purchaseLoading}
          setLoading={setPurchaseLoading}
          setMessage={setPurchaseMsg}
        />
      )}

      {/* Payment Receipt Modal */}
      {showPaymentReceipt && paymentDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '100%',
            color: '#000',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            {/* Success Header */}
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ fontSize: 50, color: '#27ae60', marginBottom: 10 }}>✓</div>
              <h2 style={{ margin: 0, color: '#27ae60' }}>Payment Successful!</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: 14 }}>Your subscription is now active</p>
            </div>

            {/* Receipt Details */}
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: 25,
              border: '1px solid #e9ecef'
            }}>
              {/* Experiment */}
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #dee2e6' }}>
                <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 12 }}>EXPERIMENT</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                  {paymentDetails.experimentTitle}
                </p>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Amount Paid</span>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: '#27ae60' }}>
                  ₹{paymentDetails.amount} {paymentDetails.currency}
                </span>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Subscription Duration</span>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{paymentDetails.duration} days</span>
              </div>

              {/* Access Until */}
              <div style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Access Until</span>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#2980b9' }}>
                  {paymentDetails.expiryDate}
                </span>
              </div>
            </div>

            {/* Transaction Info */}
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: 25,
              fontSize: 12,
              color: '#666',
              lineHeight: '1.8'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Order ID:</strong> {paymentDetails.orderId}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Transaction ID:</strong> {paymentDetails.transactionId}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Purchase Date:</strong> {paymentDetails.purchaseDate}
              </p>
            </div>

            {/* Security & Privacy Section */}
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: 25,
              borderLeft: '4px solid #27ae60'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#27ae60', fontSize: 13 }}>🔒 Security & Privacy</h4>
              <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: 11, color: '#555', lineHeight: '1.6' }}>
                <li>✓ Encrypted Payment: All transactions are protected by SSL/TLS encryption</li>
                <li>✓ Data Protection: Your personal data is securely stored and never shared</li>
                <li>✓ Verification: You can verify this receipt using your Order ID</li>
                <li>✓ Non-transferable: This subscription is exclusively for the registered user</li>
                <li>✓ Support: Report any unauthorized access at support@virtuallab.com</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn success"
                onClick={closePaymentReceipt}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px',
                  fontSize: 14,
                  fontWeight: 'bold',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Start Learning
              </button>
              <button
                className="btn secondary"
                onClick={closePaymentReceipt}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px',
                  fontSize: 14,
                  fontWeight: 'bold',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Download Receipt
              </button>
            </div>

            {/* Renewal Info */}
            <div style={{
              marginTop: 20,
              padding: '12px',
              backgroundColor: '#fff3cd',
              borderRadius: '5px',
              fontSize: 12,
              color: '#856404',
              borderLeft: '4px solid #ffc107'
            }}>
              <strong>Note:</strong> After {paymentDetails.duration} days, you'll need to renew your subscription to continue accessing this experiment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SortingLab;