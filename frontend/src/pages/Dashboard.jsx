import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Briefcase, CheckSquare, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        // Fetch projects
        const projRes = await axios.get('/api/projects', config);
        setProjects(projRes.data);
        
        // Fetch tasks for all projects
        let allTasks = [];
        for (let p of projRes.data) {
          const taskRes = await axios.get(`/api/tasks/project/${p._id}`, config);
          allTasks = [...allTasks, ...taskRes.data];
        }
        setTasks(allTasks);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex-center" style={{height: '60vh'}}><div className="glow-text">Loading...</div></div>;

  const myTasks = tasks.filter(t => t.assignee?._id === user.id || t.assignee === user.id);
  const doneTasks = myTasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = myTasks.filter(t => t.status === 'To Do').length;

  // Overdue tasks (due date passed and not done)
  const overdueTasks = myTasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done'
  );

  const totalTasks = myTasks.length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const statusChartData = [
    { name: 'To Do', count: todoTasks, color: '#94a3b8' },
    { name: 'In Progress', count: inProgressTasks, color: '#f59e0b' },
    { name: 'Done', count: doneTasks, color: '#10b981' }
  ];

  // Priority distribution
  const highPriority = myTasks.filter(t => t.priority === 'High').length;
  const mediumPriority = myTasks.filter(t => t.priority === 'Medium').length;
  const lowPriority = myTasks.filter(t => t.priority === 'Low').length;

  const priorityChartData = [
    { name: 'High', count: highPriority, color: '#ef4444' },
    { name: 'Medium', count: mediumPriority, color: '#f59e0b' },
    { name: 'Low', count: lowPriority, color: '#10b981' }
  ];

  // Tasks per user (across all projects)
  const userTaskMap = {};
  tasks.forEach(t => {
    const assigneeName = t.assignee?.username || 'Unassigned';
    if (!userTaskMap[assigneeName]) userTaskMap[assigneeName] = 0;
    userTaskMap[assigneeName]++;
  });
  const tasksPerUser = Object.entries(userTaskMap).map(([name, count]) => ({ name, count }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p style={{ margin: 0, fontWeight: 600 }}>{`${payload[0].payload.name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const CHART_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="glow-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hello, {user.username}! 👋</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here is your overview for today.</p>

        {/* Top Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <Link to="/projects" className="glass-card glow-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{projects.length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Active Projects</div>
            </div>
          </Link>
          
          <div className="glass-card glow-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
              <CheckSquare size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{doneTasks}</div>
              <div style={{ color: 'var(--text-muted)' }}>Tasks Completed</div>
            </div>
          </div>
          
          <div className="glass-card glow-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--warning)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{inProgressTasks}</div>
              <div style={{ color: 'var(--text-muted)' }}>In Progress</div>
            </div>
          </div>

          <div className="glass-card glow-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{overdueTasks.length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Overdue</div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Progress Tracker */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Overall Progress</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Completion Rate</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{progressPercentage}%</span>
            </div>
            <div className="progress-container" style={{ height: '12px', marginBottom: '2rem' }}>
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalTasks}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Assigned</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalTasks - doneTasks}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Remaining</div>
              </div>
            </div>
          </div>

          {/* Task Status Chart */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Tasks by Status</h2>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Priority Distribution */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Tasks by Priority</h2>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tasks Per User */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Tasks Per User</h2>
            {tasksPerUser.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '3rem' }}>No tasks assigned yet</div>
            ) : (
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksPerUser} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {tasksPerUser.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Overdue Tasks Section */}
        {overdueTasks.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Overdue Tasks
            </h2>
            <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '2rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              {overdueTasks.map((task, index) => (
                <div key={task._id} style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: index !== overdueTasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{task.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()} • {task.priority} Priority
                    </div>
                  </div>
                  <span className={`badge badge-${task.status.replace(' ', '').toLowerCase()}`}>{task.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent Tasks */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Recent Tasks</h2>
        {myTasks.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>You don't have any assigned tasks yet.</p>
          </div>
        ) : (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            {myTasks.slice(0, 5).map((task, index) => (
              <div key={task._id} className="glow-card" style={{
                padding: '1.25rem 1.5rem',
                borderBottom: index !== Math.min(myTasks.length, 5) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.3s',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{task.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span>Project: {projects.find(p => p._id === task.project)?.name || 'Unknown'}</span>
                    {task.priority && <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>{task.priority}</span>}
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div>
                  <span className={`badge badge-${task.status.replace(' ', '').toLowerCase()}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
