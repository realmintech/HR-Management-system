import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Building2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, reset } from '../redux/features/authSlice';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // department: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, message, navigate, dispatch]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500'></div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4'>
      <Toaster position='top-right' />
      <div className='w-full max-w-md bg-white shadow-1xl rounded-2xl overflow-hidden'>
        <div className='p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-800'>Create Account</h2>
            <p className='text-gray-500 mt-2'>Join our platform</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label className='block text-gray-600 mb-2'>Full Name</label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Enter your full name'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
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
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
                    required
                  />
                </div>
              </div>

{/*               <div>
                <label className='block text-gray-600 mb-2'>Department</label>
                <div className='relative'>
                  <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <select
                    name='department'
                    value={formData.department}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
                    required
                  >
                    <option value=''>Select Department</option>
                    <option value='Engineering'>Engineering</option>
                    <option value='Human Resources'>Human Resources</option>
                    <option value='Finance'>Finance</option>
                    <option value='marketing'>Marketing</option>
                    <option value='Sales'>Sales</option>
                  </select>
                </div>
              </div> */}

{/*               <div>
                <label className='block text-gray-600 mb-2'>Position</label>
                <div className='relative'>
                  <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <select
                    name='department'
                    value={formData.position}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all'
                    required
                  >
                    <option value=''>Select Department</option>
                    <option value='Manager'>Manager</option>
                    <option value='Developer'>Developer</option>
                    <option value='Analyst'>Analyst</option>
                    <option value='Intern'>Intern</option>
                    <option value='Consultant'>Consultant</option>
                  </select>
                </div>
              </div> */}

              <div>
                <label className='block text-gray-600 mb-2'>Password</label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Create a strong password'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-purple-600 transition-all'
                    required
                  />
                </div>
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition-all'
              >
                Create Account
              </button>
            </div>
          </form>

          <div className='text-center mt-6'>
            <p className='text-gray-600'>
              Already have an account?
              <a
                href='./login'
                className='text-purple-600 ml-1 hover:underline'
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
