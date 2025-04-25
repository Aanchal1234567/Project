import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Users, AlertTriangle, Activity, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import Notecontext from "./Notecontext.jsx";

const SmartTrackingSystem = () => {
  const { LogedInUser, id } = useContext(Notecontext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [productivityScore, setProductivityScore] = useState(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/textscontent/${id}`);
        setTasks(response.data);
        calculateProductivityScore(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch task data');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTasks();
    }
  }, [id]);

  // Calculate productivity score based on multiple factors
  const calculateProductivityScore = (taskData) => {
    if (!taskData.length) return 0;

    const totalTasks = taskData.length;
    const completedTasks = taskData.filter(task => task.status === 'Completed').length;
    const onTimeTasks = taskData.filter(task => {
      const dueDate = new Date(task.dueDate);
      return task.status === 'Completed' && dueDate >= new Date();
    }).length;

    const completionRate = (completedTasks / totalTasks) * 100;
    const onTimeRate = (onTimeTasks / completedTasks) * 100;
    const highPriorityCompletionRate = (taskData.filter(task => 
      task.status === 'Completed' && task.priority === 'high'
    ).length / taskData.filter(task => task.priority === 'high').length) * 100;

    const score = (completionRate * 0.4) + (onTimeRate * 0.3) + (highPriorityCompletionRate * 0.3);
    setProductivityScore(Math.round(score));
  };

  // Get tasks grouped by time periods
  const getTimeBasedData = () => {
    const today = new Date();
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      if (timeRange === 'week') {
        return taskDate >= new Date(today - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === 'month') {
        return taskDate >= new Date(today.getFullYear(), today.getMonth(), 1);
      }
      return true;
    });

    return filteredTasks;
  };

  // Calculate trend data
  const getTrendData = () => {
    const statusCounts = {};
    getTimeBasedData().forEach(task => {
      const date = new Date(task.dueDate).toLocaleDateString();
      if (!statusCounts[date]) {
        statusCounts[date] = { date, completed: 0, pending: 0, inProgress: 0 };
      }
      if (task.status === 'Completed') statusCounts[date].completed++;
      else if (task.status === 'In Progress') statusCounts[date].inProgress++;
      else statusCounts[date].pending++;
    });

    return Object.values(statusCounts);
  };

  // Get team member performance data
  const getTeamPerformance = () => {
    const teamStats = {};
    tasks.forEach(task => {
      if (!teamStats[task.assignedTo]) {
        teamStats[task.assignedTo] = { 
          name: task.assignedTo,
          completed: 0,
          total: 0,
          onTime: 0 
        };
      }
      teamStats[task.assignedTo].total++;
      if (task.status === 'Completed') {
        teamStats[task.assignedTo].completed++;
        if (new Date(task.dueDate) >= new Date()) {
          teamStats[task.assignedTo].onTime++;
        }
      }
    });

    return Object.values(teamStats).map(member => ({
      ...member,
      efficiency: Math.round((member.completed / member.total) * 100)
    }));
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">{error}</div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Smart Task Analytics</h1>
        <select 
          className="bg-white border rounded-md p-2"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Productivity Score</p>
              <h3 className="text-2xl font-bold">{productivityScore}%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-bold">
                {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)}%
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Overdue Tasks</p>
              <h3 className="text-2xl font-bold">
                {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Active Team Members</p>
              <h3 className="text-2xl font-bold">
                {new Set(tasks.map(t => t.assignedTo)).size}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Task Completion Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed" />
                <Line type="monotone" dataKey="inProgress" stroke="#6366F1" name="In Progress" />
                <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTeamPerformance()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#6366F1" name="Efficiency Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Member Stats */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Team Member Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-Time Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getTeamPerformance().map((member, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.completed}/{member.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.onTime} tasks</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.efficiency}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmartTrackingSystem;