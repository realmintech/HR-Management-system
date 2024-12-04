import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  User,
  Mail,
  Badge,
  Building2,
  Briefcase,
  Calendar,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axios';

const PersonalDetails = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get('/employees/profile', {
          params: {
            user: user?.user?._id,
          },
        });
        setEmployeeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error(
          error.response?.data?.message || 'Failed to fetch employee details'
        );
        setLoading(false);
      }
    };

    if (user?.user?._id) {
      fetchEmployeeData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className='text-center p-8'>
        <div className='bg-yellow-50 p-4 rounded-lg'>
          <p className='text-yellow-700'>No employee data available</p>
        </div>
      </div>
    );
  }

  const detailsItems = [
    {
      icon: <User className='text-blue-500' />,
      label: 'Full Name',
      value: employeeData?.user?.name,
    },
    {
      icon: <Mail className='text-green-500' />,
      label: 'Email',
      value: employeeData?.user?.email,
    },
    {
      icon: <Badge className='text-purple-500' />,
      label: 'Employee ID',
      value: employeeData._id,
    },
    {
      icon: <Building2 className='text-teal-500' />,
      label: 'Department',
      value: employeeData.department,
    },
    {
      icon: <Briefcase className='text-orange-500' />,
      label: 'Position',
      value: employeeData.position,
    },
    {
      icon: <DollarSign className='text-yellow-500' />,
      label: 'Salary',
      value: employeeData.salary ? `$${employeeData.salary}` : 'Not provided',
    },
    {
      icon: employeeData.status === 'Active' ? (
        <CheckCircle className='text-green-500' />
      ) : (
        <XCircle className='text-red-500' />
      ),
      label: 'Status',
      value: employeeData.status || 'Unknown',
    },
    {
      icon: <Calendar className='text-red-500' />,
      label: 'Join Date',
      value: employeeData.joinDate
        ? new Date(employeeData.joinDate).toLocaleDateString()
        : 'Not provided',
    },
    {
      icon: <Phone className='text-indigo-500' />,
      label: 'Phone',
      value: employeeData.phone,
    },
    {
      icon: <MapPin className='text-pink-500' />,
      label: 'Address',
      value: employeeData.address,
    },
  ];

  return (
    <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
      {/* Profile Header */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6'>
        <div className='flex items-center space-x-6'>
          <img
            src={
              employeeData.profilePicture ||
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg'
            }
            alt={employeeData.name}
            className='w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
          <div>
            <h2 className='text-3xl font-bold'>{employeeData?.user?.name}</h2>
            <p className='text-sm opacity-80'>
              {employeeData.position || 'Position not set'}
            </p>
          </div>
        </div>
      </div>

      <div className='p-6 grid md:grid-cols-2 gap-6'>
        {detailsItems.map((item, index) => (
          <div
            key={index}
            className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 hover:shadow-md'
          >
            <div className='p-3 bg-white rounded-full shadow-md'>
              {item.icon}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-gray-500'>{item.label}</p>
              <p className='text-lg font-semibold text-gray-800 truncate'>
                {item.value || 'Not provided'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalDetails;
