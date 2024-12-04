import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../utils/axios';
import { useSelector } from 'react-redux';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
];

const POSITIONS = ['Manager', 'Developer', 'Analyst', 'Intern', 'Consultant'];

const STATUSES = ['active', 'inactive', 'on_leave'];

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergency_contact: '',
    salary: '',
    emergency_phone: '',
    department: '',
    position: '',
    status: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        const { user, employee } = response.data.data;

        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: employee?.phone || '',
          address: employee?.address || '',
          emergency_contact: employee?.emergency_contact || '',
          emergency_phone: employee?.emergency_phone || '',
          department: employee?.department || '',
          position: employee?.position || '',
          salary: employee?.salary || 0,
          status: employee?.status || 'Active',
        });
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put('/auth/profile', formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg p-8 mt-6'>
      <Toaster position='top-right' />
      <h2 className='text-4xl font-bold text-blue-700 mb-6 text-center'>
        Update Profile
      </h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Input Fields */}
          {['name', 'email', 'phone', 'address'].map((field) => (
            <div key={field} className='col-span-1'>
              <label
                htmlFor={field}
                className='block text-sm font-medium text-gray-700 capitalize'
              >
                {field.replace('_', ' ')}
              </label>
              <input
                id={field}
                type='text'
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          ))}

          {[
            { name: 'department', options: DEPARTMENTS, label: 'Department' },
            {
              name: 'position',
              options: POSITIONS,
              label: 'Position',
              disabled: !formData.department,
            },
            { name: 'status', options: STATUSES, label: 'Status' },
          ].map(({ name, options, label, disabled }) => (
            <div key={name} className='col-span-1'>
              <label
                htmlFor={name}
                className='block text-sm font-medium text-gray-700'
              >
                {label}
              </label>
              <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={disabled}
                className={`mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm ${
                  disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
                } focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value=''>{`Select ${label}`}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className='mt-8 text-center'>
          <button
            type='submit'
            disabled={loading}
            className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } rounded-md shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
