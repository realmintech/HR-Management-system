import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/authSlice';
import PersonalDetails from './PersonalDetails';
import UpdateProfile from './UpdateProfile';
import { User, Pencil, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'update', label: 'Update Profile', icon: Pencil },
  ];

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <aside className='w-72 bg-white shadow-lg flex flex-col'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold text-blue-600'>HR ERP</h2>
          <p className='text-sm text-gray-500 mt-1'>Employee Dashboard</p>
        </div>

        <nav className='mt-8 '>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center px-6 py-4 text-left font-medium transition-colors rounded-md ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className='w-5 h-5 mr-3' />
              {label}
            </button>
          ))}
        </nav>

        <div className='p-4 border-t'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors'
          >
            <LogOut className='w-5 h-5 mr-3' />
            Logout
          </button>
        </div>
      </aside>

      <main className='flex-1 p-8'>
        <section className='bg-white rounded-lg shadow-md p-6'>
          {activeTab === 'personal' && <PersonalDetails />}
          {activeTab === 'update' && <UpdateProfile />}
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
