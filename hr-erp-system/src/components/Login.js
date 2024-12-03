import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, reset } from '../redux/features/authSlice';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: sessionStorage.getItem('rememberedEmail') || '',
    password: '',
    rememberMe: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      toast.success('Login successful');
      if (isSuccess && user) {
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = formData;

    // Save email if remember me is checked
    if (rememberMe) {
      sessionStorage.setItem('rememberedEmail', email); // Use sessionStorage
    } else {
      sessionStorage.removeItem('rememberedEmail'); // Clear if not remembered
    }

    dispatch(loginUser({ email, password, rememberMe }));
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4'>
      <Toaster position='top-right' />

      <div className='w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden'>
        <div className='p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-800'>Welcome Back</h2>
            <p className='text-gray-500 mt-2'>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label className='block text-gray-600 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Enter your email'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-600 mb-2'>Password</label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Enter your password'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                    required
                  />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    name='rememberMe'
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className='mr-2 rounded focus:ring-purple-500'
                  />
                  <span className='text-gray-600'>Remember me</span>
                </label>
                <a href='/' className='text-purple-600 hover:underline'>
                  Forgot password?
                </a>
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center'
              >
                Sign In
                <ArrowRight className='ml-2' />
              </button>
            </div>
          </form>

          <div className='text-center mt-6'>
            <p className='text-gray-600'>
              Don't have an account?
              <a
                href='/register'
                className='text-purple-600 ml-1 hover:underline'
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;