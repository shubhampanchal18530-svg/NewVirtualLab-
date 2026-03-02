import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Optionally disable registration via environment flag
    const registrationDisabled = process.env.REACT_APP_DISABLE_REGISTRATION === 'true';
    if (registrationDisabled) {
      setError('Registration has been disabled by the administrator. Please contact your instructor.');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Account 🚀</h2>
        <p className="auth-subtitle">Join SimuLab: Virtual Lab and start experimenting</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          <button type="submit" className="auth-button">Sign Up</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
