import React, { useState, useEffect } from 'react';
import { PieChart, Users, LogOut, Trash2 } from 'lucide-react';
import Analytics from './Analytics';
import EmployeeList from './EmployeeList';
import Trash from './Trash';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/authSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axios';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analyticsData, setAnalyticsData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get('/employees/analytics');
        setAnalyticsData(response.data);
      } catch (error) {
        toast.error('Failed to fetch analytics data');
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-72 bg-white shadow-lg flex flex-col'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Admin Panel</h2>
        </div>
        <nav className='mt-6'>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full px-6 py-3 flex items-center ${
              activeTab === 'analytics'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <PieChart className='w-5 h-5 mr-3' />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full px-6 py-3 flex items-center ${
              activeTab === 'employees'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Users className='w-5 h-5 mr-3' />
            Employees
          </button>

          <button
            onClick={() => setActiveTab('trash')}
            className={`w-full px-6 py-3 flex items-center ${
              activeTab === 'trash'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Trash2 className='w-5 h-5 mr-3' />
            Trash
          </button>
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

      {/* Main Content */}
      <main className='flex-1 p-8'>
        {activeTab === 'analytics' && analyticsData && (
          <Analytics
            totalEmployees={analyticsData.totalEmployees}
            departmentCounts={analyticsData.departmentCounts}
            newHiresThisMonth={analyticsData.newHiresThisMonth}
          />
        )}
        {activeTab === 'employees' && <EmployeeList />}
        {activeTab === 'trash' && <Trash />}
      </main>
    </div>
  );
}

export default AdminDashboard;
