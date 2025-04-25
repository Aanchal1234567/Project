// Frontend: Task.jsx
import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Tag, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import axios from 'axios';
import { useContext } from "react"
import Notecontext from "./Notecontext.jsx"

const Task = () => {
  const { LogedInUser,fetchTasks,id,isLoading, setIsLoading,error, setError,textdata, setTextdata } = useContext(Notecontext);
  // const [textdata, setTextdata] = useState([]);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState("");
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  
  // const id = LogedInUser?._id;

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    if (id) {
      fetchTasks();
    }
    const storedData = localStorage.getItem("textdata");
    setTextdata(storedData ? JSON.parse(storedData) : []);
  }, [id]);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5500/textscontent/${taskId}`);
      setTextdata(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setMessage("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("Error deleting task. Please try again.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5500/textscontent/${editingTask._id}`, editingTask);
      setTextdata(prevTasks => 
        prevTasks.map(task => task._id === editingTask._id ? response.data : task)
      );
      setMessage("Task updated successfully!");
      setTimeout(() => {
        setMessage("");
        setIsEditModalOpen(false);
        setEditingTask(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating task:", error);
      setMessage("Error updating task. Please try again.");
    }
  };

  const handleTagToggle = (tag) => {
    setEditingTask(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const renderTaskCard = (task) => (
    <div 
      key={task._id}
      className="bg-white rounded-xl border-l-4 border-indigo-500 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
            ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
              task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'}
          `}>
            {task.priority}
          </span>
        </div>

        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
            ${task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'}
          `}>
            {task.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            {task.assignedTo}
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-2xl">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-xl font-bold">Edit Task</h2>
        </div>

        {message && (
          <div className="m-4 p-4 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateTask} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={editingTask?.title || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={editingTask?.description || ''}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={editingTask?.dueDate?.split('T')[0] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                name="priority"
                value={editingTask?.priority || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={editingTask?.status || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                name="assignedTo"
                value={editingTask?.assignedTo || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select Team Member</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Design", "Development", "Marketing", "Research"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm
                    ${editingTask?.tags?.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : textdata.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No tasks found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textdata.map(renderTaskCard)}
          </div>
        )}

        {isEditModalOpen && renderEditModal()}
      </div>
    </div>
  );
};

export default Task;

