import { useContext, useEffect } from "react"
import React from 'react'
import Notecontext from "./Notecontext"
import { 
  Calendar, 
  Users,
  Clock,
  Circle
} from 'lucide-react';

export default function Searched() {
    const {searchingitem, fetchTasks, textdata,id} = useContext(Notecontext);
    useEffect(() => {
      fetchTasks();
    }, [id]);
    
    return (
      <div className="grid gap-8 p-8 bg-gray-700" style={{marginTop:"60px"}}>
        {textdata.filter(task => task.status === searchingitem).map((task) => (
          <div 
            key={task._id}
            className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-50" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full transform -translate-x-12 translate-y-12" />

            <div className="relative p-6">
              {/* Status Indicator */}
              <div className="flex items-center gap-2 mb-6">
                <Circle className={`w-3 h-3 
                  ${task.status === 'Pending' ? 'text-yellow-500' :
                    task.status === 'In Progress' ? 'text-blue-500' :
                    'text-green-500'} animate-pulse`} 
                  fill="currentColor"
                />
                <span className="text-sm font-medium text-gray-600">{task.status}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                {task.title}
              </h3>

              {/* Priority Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold 
                  ${task.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                    task.priority === 'medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'}
                `}>
                  {task.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6 border-l-4 border-indigo-200 pl-4">
                {task.description}
              </p>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl">
                  <div className="flex items-center text-indigo-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold">Due Date</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl">
                  <div className="flex items-center text-purple-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold">Assigned To</span>
                  </div>
                  <p className="mt-2 text-gray-700">{task.assignedTo}</p>
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 text-sm rounded-xl font-medium hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            </div>
          </div>
        ))}
      </div>
    )
}