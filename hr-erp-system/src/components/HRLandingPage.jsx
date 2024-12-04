import React, { useState,useEffect } from 'react';
import { Users, BarChart2, Settings, Menu, X } from 'lucide-react';
import hr from '../assets/hr.jpg';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/features/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const HRLandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    const testLiveURL = async () => {
      try {
        const response = await fetch(
          'https://wastech-erp-system.onrender.com'
        );
        if (response.ok) {
          toast.success('Server is reachable!');
        } else {
          toast.error('Failed to reach the server');
        }
      } catch (error) {
        toast.error('Error connecting to the server');
      }
    };

    testLiveURL();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const NavBar = () => (
    <nav className='fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo and Role */}
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-blue-600'>
              HR⚡Systems
              {user && user.role === 'admin' && (
                <span className='ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                  Admin
                </span>
              )}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex space-x-8 items-center'>
            {user ? (
              <>
                <a
                  href='/'
                  className='text-gray-700 hover:text-blue-600 transition flex items-center gap-2'
                >
                  <Users size={20} /> Employees
                </a>
                <a
                  href='/'
                  className='text-gray-700 hover:text-blue-600 transition flex items-center gap-2'
                >
                  <BarChart2 size={20} /> Analytics
                </a>
                <a
                  href='/'
                  className='text-gray-700 hover:text-blue-600 transition flex items-center gap-2'
                >
                  <Settings size={20} /> Settings
                </a>
                <button
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          {user && (
            <div className='md:hidden'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='text-gray-700 hover:text-blue-600'
                aria-label='Toggle mobile menu'
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className='md:hidden absolute top-full left-0 w-full bg-white shadow-lg'>
          <div className='px-4 pt-2 pb-4 space-y-2'>
            <a
              href='/'
              className='block py-2 text-gray-700 hover:bg-blue-50 rounded'
            >
              Employees
            </a>
            <a
              href='/'
              className='block py-2 text-gray-700 hover:bg-blue-50 rounded'
            >
              Analytics
            </a>
            <a
              href='/'
              className='block py-2 text-gray-700 hover:bg-blue-50 rounded'
            >
              Settings
            </a>
            <button
              className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Login Button */}
      {!user && (
        <div className='md:hidden absolute top-full left-0 w-full bg-white shadow-lg'>
          <div className='px-4 pt-2 pb-4'>
            <button
              className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );

  const HeroSection = () => (
    <div className='relative pt-20 pb-16 bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center'>
        {/* Content */}
        <div className='space-y-6'>
          <h1 className='text-5xl font-extrabold text-gray-900 leading-tight'>
            Streamline Your <span className='text-blue-600'>HR Processes</span>
          </h1>
          <p className='text-xl text-gray-600 leading-relaxed'>
            {user
              ? `Welcome, ${
                  user.role === 'admin' ? 'Admin' : 'Employee'
                }! Manage your HR tasks efficiently.`
              : 'Empower your workforce with intelligent HR management. Centralize employee data, automate workflows, and gain powerful insights.'}
          </p>
          {!user && (
            <div className='flex space-x-4'>
              <button
                className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md'
                onClick={handleRegister}
              >
                Get Started
              </button>
              <button className='bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition shadow-md'>
                Learn More
              </button>
            </div>
          )}
        </div>

        {/* Illustration */}
        <div className='hidden md:block'>
          <div className='bg-blue-100 rounded-xl p-8 transform hover:scale-105 transition-transform duration-300'>
            <img
              src={hr}
              alt='HR Management Illustration'
              className='w-full h-[400px] object-cover rounded-lg shadow-xl'
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <NavBar />
      <HeroSection />
    </div>
  );
};

export default HRLandingPage;
