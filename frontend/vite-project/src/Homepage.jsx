import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from "react"
import Notecontext from "./Notecontext.jsx"


import { 
  Plus, 
  Check, 
  Calendar, 
  ChevronRight, 
  BarChart2, 
  Clock 
} from 'lucide-react';


const HomePage = () => {
  // const [isLoading, setIsLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [textdata, setTextdata] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Product Mockup', status: 'In Progress', dueDate: 'Tomorrow' },
    { id: 2, title: 'Team Meeting', status: 'Pending', dueDate: 'Wednesday' },
    { id: 3, title: 'Code Review', status: 'Completed', dueDate: 'Last Week' }
  ]);
  


  const {searchingitem, setSearchingitem,LogedInUser,fetchTasks,id,textdata, setTextdata,error, setError,isLoading, setIsLoading} = useContext(Notecontext);
  let contextData = useContext(Notecontext)
  textdata.map((e)=>{
    if
    (e.status=='Pending'){
    console.log(e.status)}
  })
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  // const id = LogedInUser?._id;
      
        useEffect(() => {
          if (id) {
            fetchTasks();
          }
        }, [id]);

      useEffect(()=>{
        console.log(searchingitem)
      },[searchingitem])

      const tochangeserach=(value)=>{
        setSearchingitem(value)
      }
      const getUpcomingTasks = () => {
        const today = new Date();
        return textdata
          .filter(task => new Date(task.dueDate) >= today)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 6); // Show only next 6 upcoming tasks
      };

      // const fetchTasks = async () => {
      //   try {
      //     setIsLoading(true);
      //     setError(null);
      //     const response = await axios.get(`http://localhost:5500/textscontent/${id}`);
          
      //     if (response.data && Array.isArray(response.data)) {
      //       setTextdata(response.data);
      //     } else if (response.data && Array.isArray(response.data.texts)) {
      //       setTextdata(response.data.texts);
      //     } else {
      //       setTextdata([]);
      //     }
      //   } catch (error) {
      //     console.error("Error fetching tasks:", error);
      //     setError("Failed to fetch tasks. Please try again later.");
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };

  return (
    <div className="min-h-screen bg-gray-50 p-6"style={{marginTop:"70px"}}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Track and manage your tasks</p>
          </div>
          <Link to="/Createtask" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition">
            <Plus className="mr-2" size={20} /> Create Task
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart2 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{textdata.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{textdata.filter(task => task.status ==="Completed" ).length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{textdata.filter(task => task.status ==="Pending").length}</p>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Active Tasks</h2>
            <Link to="./Task" className="text-blue-500 flex items-center">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          {tasks.map(task => (
            <div 
              key={task.id} 
              className="p-4 border-b last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">Due {task.dueDate}</p>
              </div>
              <Link to="./Searched" onClick={()=>{tochangeserach(task.status);}} className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <ChevronRight className="text-gray-400" />
              </Link>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {getUpcomingTasks().slice(0, 3).map(task => (
                <div key={task.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{task.title}</p>
                    <p className="text-sm text-gray-500">Due {task.dueDate}</p>
                  </div>
                  <Calendar className="text-blue-500" size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-50 text-blue-600 py-3 rounded-lg hover:bg-blue-100 transition flex items-center justify-center">
                <BarChart2 className="mr-2" size={20} /> Analytics
              </button>
              <Link to="/SmartTrackingSystem" className="bg-green-50 text-green-600 py-3 rounded-lg hover:bg-green-100 transition flex items-center justify-center">
                <Calendar className="mr-2" size={20} /> Reports
              </Link>
              <Link to="/" className="bg-purple-50 text-purple-600 py-3 rounded-lg hover:bg-purple-100 transition flex items-center justify-center">
                <Clock className="mr-2" size={20} /> Share
              </Link>
              <button className="bg-orange-50 text-orange-600 py-3 rounded-lg hover:bg-orange-100 transition flex items-center justify-center">
                <Plus className="mr-2" size={20} /> New Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;