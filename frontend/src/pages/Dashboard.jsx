import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, CheckSquare, Clock, AlertCircle } from 'lucide-react';

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
        const projRes = await axios.get('http://localhost:5000/api/projects', config);
        setProjects(projRes.data);
        
        // Fetch tasks for all projects (simplified for dashboard)
        let allTasks = [];
        for (let p of projRes.data) {
          const taskRes = await axios.get(`http://localhost:5000/api/tasks/project/${p._id}`, config);
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

  if (loading) return <div className="flex-center" style={{height: '60vh'}}>Loading...</div>;

  const myTasks = tasks.filter(t => t.assignee?._id === user.id || t.assignee === user.id);
  const doneTasks = myTasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = myTasks.filter(t => t.status === 'To Do').length;

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hello, {user.username}! 👋</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here is your overview for today.</p>

        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{projects.length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Active Projects</div>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
              <CheckSquare size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{doneTasks}</div>
              <div style={{ color: 'var(--text-muted)' }}>Tasks Completed</div>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--warning)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{inProgressTasks}</div>
              <div style={{ color: 'var(--text-muted)' }}>In Progress</div>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Tasks</h2>
        {myTasks.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>You don't have any assigned tasks yet.</p>
          </div>
        ) : (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            {myTasks.map((task, index) => (
              <div key={task._id} style={{
                padding: '1.5rem',
                borderBottom: index !== myTasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{task.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Project: {projects.find(p => p._id === task.project)?.name || 'Unknown'}
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
