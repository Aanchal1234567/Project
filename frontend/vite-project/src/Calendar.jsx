import React, { useState, useContext, useEffect } from 'react';
import Notecontext from "./Notecontext";
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users, Tag } from 'lucide-react';
import axios from 'axios';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { searchingitem,textdata,LogedInUser,setTextdata,fetchTasks,id,isLoading, setIsLoading,error, setError } = useContext(Notecontext);
  // const [isLoading, setIsLoading] = useState(true);
  //   const [error, setError] = useState(null);
  // const id = LogedInUser?._id;
  useEffect(() => {
            if (id) {
              fetchTasks();
            }
          }, [id]);
               

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  // Function to get tasks for a specific day
  const getTasksForDay = (day) => {
    return textdata.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === day &&
             taskDate.getMonth() === currentDate.getMonth() &&
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  // Function to get priority color classes
  const getPriorityClasses = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 hover:bg-red-200';
      case 'medium':
        return 'bg-amber-100 hover:bg-amber-200';
      case 'low':
        return 'bg-emerald-100 hover:bg-emerald-200';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  // Function to format time from date string
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return "Time not set";
    }
  };

  // Function to get upcoming tasks
  const getUpcomingTasks = () => {
    const today = new Date();
    return textdata
      .filter(task => new Date(task.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6); // Show only next 6 upcoming tasks
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8" style={{marginTop:"65px"}}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <CalendarIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Task Calendar</h1>
          </div>
          <Link to="/Createtask" className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Add Task
          </Link>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-4">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {days.map((day) => (
            <div key={day} className="p-4 text-center text-gray-600 font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {[...Array(firstDayOfMonth)].map((_, index) => (
            <div key={`empty-${index}`} className="min-h-32 p-2 border-b border-r" />
          ))}
          
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const isToday = day === new Date().getDate() && 
                           currentDate.getMonth() === new Date().getMonth() &&
                           currentDate.getFullYear() === new Date().getFullYear();
            const dayTasks = getTasksForDay(day);
            
            return (
              <div key={day} className="min-h-32 p-2 border-b border-r relative group hover:bg-gray-50 transition-colors">
                <div className={`
                  inline-flex w-8 h-8 items-center justify-center rounded-full
                  ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}
                `}>
                  {day}
                </div>

                {/* Tasks for the day */}
                <div className="mt-2 space-y-1">
                  {dayTasks.map((task) => (
                    <div 
                      key={task._id}
                      className={`
                        p-2 rounded-lg cursor-pointer transform transition-all duration-200
                        hover:scale-105 hover:shadow-md
                        ${getPriorityClasses(task.priority)}
                      `}
                    >
                      <div className="text-sm font-medium mb-1">{task.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {formatTime(task.dueDate)}
                        {task.assignedTo && (
                          <>
                            <Users className="w-3 h-3 ml-2" />
                            {task.assignedTo}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Summary Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getUpcomingTasks().map((task) => (
              <div 
                key={task._id}
                className="p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{task.title}</h4>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${task.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'}
                  `}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(task.dueDate)}
                  </div>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {task.assignedTo}
                    </div>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {task.tags[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}