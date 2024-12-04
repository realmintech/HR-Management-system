import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-hot-toast';
import { Eye, Pencil, Trash } from 'lucide-react'; 


const ROLES = ['employee'];
const STATUS_OPTIONS = ['active', 'inactive', 'on_leave'];
const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
];
const POSITION_OPTIONS = [
  'Manager',
  'Developer',
  'Analyst',
  'Intern',
  'Consultant',
];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10,
  });

  const [editMode, setEditMode] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null); // State for viewing employee details

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get(
          `/employees/all?page=${currentPage}&limit=10`
        );
        setEmployees(response.data.data);
        setPagination(response.data.pagination);
        setLoading(false);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch employees'
        );
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  const handleEdit = (employee) => {
    setEditMode(true);
    setEditEmployee(employee);
  };

  const handleView = (employee) => {
    setViewEmployee(employee); 
  };

  const handleSave = async () => {
    try {
      const updateData = {
        salary: editEmployee.salary,
        status: editEmployee.status,
        role: editEmployee.role,
        department: editEmployee.department,
        position: editEmployee.position,
      };

      const response = await axiosInstance.put(
        `/employees/${editEmployee._id}/update-status`,
        updateData
      );

      setEmployees(
        employees.map((emp) =>
          emp._id === editEmployee._id ? { ...emp, ...response.data.data } : emp
        )
      );

      toast.success('Employee updated successfully');
      setEditMode(false);
      setEditEmployee(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axiosInstance.delete(`/employees/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
        toast.success('Employee deleted successfully');
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to delete employee'
        );
      }
    }
  };

  const closeViewModal = () => {
    setViewEmployee(null); 
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-8xl mx-auto bg-white shadow-md rounded-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Employee List</h2>
          <div className='text-sm text-gray-500'>
            Total Employees: {pagination.total}
          </div>
        </div>

        {editMode && (
          <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md'>
              <h3 className='text-xl font-bold mb-4 text-gray-700'>
                Edit Employee
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Salary
                  </label>
                  <input
                    type='number'
                    value={editEmployee.salary}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        salary: parseFloat(e.target.value),
                      })
                    }
                    className='w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Role
                  </label>
                  <select
                    value={editEmployee.role}
                    onChange={(e) =>
                      setEditEmployee({ ...editEmployee, role: e.target.value })
                    }
                    className='w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500'
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Status
                  </label>
                  <select
                    value={editEmployee.status}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        status: e.target.value,
                      })
                    }
                    className='w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500'
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Department
                  </label>
                  <select
                    value={editEmployee.department}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        department: e.target.value,
                      })
                    }
                    className='w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500'
                  >
                    {DEPARTMENT_OPTIONS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Position
                  </label>
                  <select
                    value={editEmployee.position}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        position: e.target.value,
                      })
                    }
                    className='w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500'
                  >
                    {POSITION_OPTIONS.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='mt-4 flex space-x-4'>
                <button
                  onClick={handleSave}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className='bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {viewEmployee && (
          <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md'>
              <h3 className='text-xl font-bold mb-4 text-gray-700'>
                Employee Details
              </h3>
              <div className='space-y-4'>
                <p><strong>Name:</strong> {viewEmployee.user.name}</p>
                <p><strong>Email:</strong> {viewEmployee.user.email}</p>
                <p><strong>Department:</strong> {viewEmployee.department}</p>
                <p><strong>Salary:</strong> NGN {viewEmployee.salary.toLocaleString()}</p>
                <p><strong>Position:</strong> {viewEmployee.position}</p>
                <p><strong>Join Date:</strong> {new Date(viewEmployee.joinDate).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}</p>
                <p><strong>Status:</strong> {viewEmployee.status}</p>
              </div>
              <div className='mt-4 flex justify-end'>
                <button
                  onClick={closeViewModal}
                  className='bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Salary
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Position
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Join Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 text-sm text-gray-800'>
                    {employee.user.name}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-800'>
                    {employee.user.email}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-800'>
                    {employee.department}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-800'>
                    NGN {employee.salary.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-800'>
                    {employee.position}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-800'>
                    {new Date(employee.joinDate).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                        employee.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : employee.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className='px-2 py-4 flex space-x-2'>
                    <button
                      onClick={() => handleView(employee)} 
                      className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600'
                    >
                      <Eye />
                    </button>
                    <button
                      onClick={() => handleEdit(employee)}
                      className='bg-blue-500  text-white p-2 rounded-lg hover:bg-blue-600'
                    >
                      <Pencil />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600'
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mt-4 flex justify-end space-x-4'>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className={`px-4 py-2 rounded-lg text-sm ${
              currentPage === pagination.pages
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;