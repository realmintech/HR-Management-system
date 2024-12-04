import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-hot-toast';

const Trash = () => {
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch deleted employees
  useEffect(() => {
    const fetchDeletedEmployees = async () => {
      try {
        const response = await axiosInstance.get('/employees/deleted');
        setDeletedEmployees(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch deleted employees');
        console.error('Error fetching deleted employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedEmployees();
  }, []);

  const handleRestore = async (id) => {
    try {
      await axiosInstance.patch(`/employees/${id}/restore`);
      setDeletedEmployees(deletedEmployees.filter(emp => emp._id !== id));
      toast.success('Employee restored successfully');
    } catch (error) {
      toast.error('Failed to restore employee');
      console.error('Error restoring employee:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Deleted Employees</h2>
      {deletedEmployees.length === 0 ? (
        <p className="text-gray-500">No deleted employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deletedEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(employee.deleted.deletedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRestore(employee._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trash;