import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useDialog } from '../contexts/DialogContext';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const { showDialog } = useDialog();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    college: 'Vasavi College of Engineering (VCE), Hyderabad',
    year: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      await showDialog({
        type: 'warning',
        title: 'Password Mismatch',
        message: 'Passwords do not match'
      });
      return;
    }

    setLoading(true);

    try {
      const result = await api.register(formData);

      if (result.token) {
        // Store token in localStorage for persistence
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        onRegister(result.user);
      } else {
        await showDialog({
          type: 'error',
          title: 'Registration Failed',
          message: result.message || 'Registration failed'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      await showDialog({
        type: 'error',
        title: 'Registration Failed',
        message: 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative pt-24">

      <div className="relative z-10 glass-dark rounded-2xl p-8 w-full max-w-4xl mx-auto shadow-[0_0_50px_rgba(59,130,246,0.15)] animate-fade-in mt-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Join CampusUnstop</h2>
          <p className="text-gray-300">Create your account to start exploring events</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          {/* Left Column - Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Personal Information</h3>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                placeholder="your.email@college.edu"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                placeholder="+91 9876543210"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">College/University *</label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({...formData, college: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                placeholder="Your college name"
              />
            </div>
          </div>

          {/* Right Column - Academic Information & Password */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Academic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-purple-400 transition-colors">Year *</label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 [&>option]:bg-slate-800"
                >
                  <option value="">Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-purple-400 transition-colors">Branch *</label>
                <input
                  type="text"
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                  placeholder="CSE, ME, etc."
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-purple-400 transition-colors">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                placeholder="Create a strong password"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-purple-400 transition-colors">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 font-bold transition-all duration-300 border-b border-transparent hover:border-purple-400"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;