import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

const Auth = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Predefined credentials (cannot be changed)
  const predefinedEmail = 'demo@example.com';
  const predefinedPassword = 'password';

  // State for storing email and password
  const [email] = useState(predefinedEmail);
  const [password] = useState(predefinedPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    // Simulated authentication
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === predefinedEmail && password === predefinedPassword) {
        dispatch(
          loginSuccess({
            id: '1',
            name: 'Demo User',
            email: predefinedEmail,
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          })
        );
      } else {
        dispatch(loginFailure('Invalid credentials'));
      }
    } catch (error) {
      dispatch(loginFailure('An error occurred'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign in to your account</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                value={email}
                readOnly
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                readOnly
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
