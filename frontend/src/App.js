import StackArray from "./pages/StackArray.jsx";
import SortingLab from "./pages/SortingLab.jsx";
import DSALabIndex from "./pages/DSALabIndex.jsx";
import QueueLab from "./pages/Queue.jsx";
import LinkedListLab from "./pages/LinkedList.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Pages
import Dashboard from "./pages/Dashboard.jsx";


// Lab Pages
// ...existing code...

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function getPerformance() {
  // Quiz scores
  let quizScores = {};
  try {
    const scores = JSON.parse(localStorage.getItem('vlab_scores') || '[]');
    if (scores.length) {
      // Aggregate by subject if available
      quizScores.DSA = Math.round((scores[scores.length-1].correct / scores[scores.length-1].total) * 100);
    }
  } catch {}
  // Coding practice (simulate)
  let codingPractice = {};
  try {
    const practice = JSON.parse(localStorage.getItem('vlab_practice') || '{}');
    codingPractice = practice;
  } catch {}
  // Completed experiments (simulate)
  let completedExperiments = [];
  try {
    completedExperiments = JSON.parse(localStorage.getItem('vlab_completed_experiments') || '[]');
  } catch {}
  return { quizScores, codingPractice, completedExperiments };
}


function AppContent() {
  const location = useLocation();
  const performance = getPerformance();
  // Read Institute Mode from environment variable
  const instituteMode = process.env.REACT_APP_INSTITUTE_MODE === 'true';

  // Extract current page and algorithm from URL/path
  const getCurrentContext = () => {
    const path = location.pathname;
    if (path.includes('/labs/dsa')) {
      return { page: 'labs/dsa', algorithm: null }; // Will be determined by component state
    }
    if (path.includes('/labs/stack')) {
      return { page: 'labs/stack', algorithm: null };
    }
    if (path === '/') {
      return { page: 'home', algorithm: null };
    }
    return { page: path.substring(1), algorithm: null };
  };

  const { page } = getCurrentContext();

  return (
    <>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home instituteMode={instituteMode} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 🔒 Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard instituteMode={instituteMode} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><div /></ProtectedRoute>} />

        {/* Stack Array Lab Route */}
        <Route path="/labs/stack" element={<ProtectedRoute><StackArray /></ProtectedRoute>} />
        {/* DSA Lab index and experiments */}
        <Route path="/labs/dsa" element={<ProtectedRoute><DSALabIndex /></ProtectedRoute>} />
        <Route path="/labs/dsa/sorting" element={<ProtectedRoute><SortingLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/queue" element={<ProtectedRoute><QueueLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/linked-list" element={<ProtectedRoute><LinkedListLab /></ProtectedRoute>} />
        {/* 🚫 Fallback Route (optional) */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
      </Routes>

      {/* AI Assistant - Available on all pages */}
      <AIAssistant currentPage={page} instituteMode={instituteMode} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
