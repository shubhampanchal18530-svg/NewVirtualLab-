import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore persisted login if available so user stays logged in across
    // page refreshes or if backend is temporarily offline.
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      // If backend unreachable, try local users stored in localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem('vlab_local_users') || '[]');
        const found = localUsers.find(u => u.email === email && u.password === password);
        if (found) {
          const token = `local-token-${found.id}`;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({ id: found.id, name: found.name, email: found.email }));
          setUser({ id: found.id, name: found.name, email: found.email });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return { success: true };
        }
      } catch (e) {}
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      // If backend is unreachable or registration disabled, fall back to local registration
      try {
        const localUsers = JSON.parse(localStorage.getItem('vlab_local_users') || '[]');
        if (localUsers.find(u => u.email === email)) {
          return { success: false, message: 'User already exists (local)' };
        }
        const id = `local_${Date.now()}`;
        const newUser = { id, name, email, password };
        localUsers.push(newUser);
        localStorage.setItem('vlab_local_users', JSON.stringify(localUsers));
        const token = `local-token-${id}`;
        const user = { id, name, email };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      } catch (e) {
        return { success: false, message: error.response?.data?.message || 'Registration failed' };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};