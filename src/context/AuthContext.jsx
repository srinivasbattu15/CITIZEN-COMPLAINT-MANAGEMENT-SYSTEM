import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ccms_user');
    return saved ? JSON.parse(saved) : {
      id: "usr-101",
      name: "Rajesh Kumar",
      email: "citizen@ccms.gov",
      role: "citizen",
      phone: "+91 9876543210"
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('ccms_token') || 'mock-token-usr-101');

  useEffect(() => {
    if (user) {
      localStorage.setItem('ccms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ccms_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ccms_token', token);
    } else {
      localStorage.removeItem('ccms_token');
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchRole = async (targetRole) => {
    try {
      const data = await api.switchDemoRole(targetRole);
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
