import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Client-side validations
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const alphanumericRegex = /^[a-zA-Z0-9_]+$/;

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!alphanumericRegex.test(username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else {
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        errors.password = 'Password must contain at least one letter and one number';
      }
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await register(username, email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      // Wait 2 seconds and redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

      <div className="relative w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-4">
            <UserPlus className="w-6 h-6 text-brand-400" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-sm text-dark-400 mt-2">
            Register to join and start uploading images
          </p>
        </div>

        {/* Global Success Banner */}
        {isSuccess && (
          <div className="flex items-start gap-2.5 p-4 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-355">Registration Successful!</p>
              <p className="text-xs text-emerald-400/80 mt-0.5">Redirecting you to login page...</p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && !isSuccess && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationErrors.username) {
                      setValidationErrors((prev) => ({ ...prev, username: null }));
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-900/50 border rounded-xl text-white text-sm outline-none placeholder-dark-600 transition-all focus:bg-dark-900 ${
                    validationErrors.username 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-dark-800 focus:border-brand-500/50'
                  }`}
                  placeholder="alex_developer"
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.username && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.username}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({ ...prev, email: null }));
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-900/50 border rounded-xl text-white text-sm outline-none placeholder-dark-600 transition-all focus:bg-dark-900 ${
                    validationErrors.email 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-dark-800 focus:border-brand-500/50'
                  }`}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-900/50 border rounded-xl text-white text-sm outline-none placeholder-dark-600 transition-all focus:bg-dark-900 ${
                    validationErrors.password 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-dark-800 focus:border-brand-500/50'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors((prev) => ({ ...prev, confirmPassword: null }));
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-900/50 border rounded-xl text-white text-sm outline-none placeholder-dark-600 transition-all focus:bg-dark-900 ${
                    validationErrors.confirmPassword 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-dark-800 focus:border-brand-500/50'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Link */}
        {!isSuccess && (
          <div className="text-center mt-6 text-sm">
            <span className="text-dark-400">Already have an account? </span>
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
