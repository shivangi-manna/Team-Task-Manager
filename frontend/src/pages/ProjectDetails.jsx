import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

const priorityColors = {
  'High': 'var(--danger)',
  'Medium': 'var(--warning)',
  'Low': 'var(--success)',
};

const ProjectDetails = ({ user }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium', assignee: '', dueDate: '' });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      
      const pRes = await axios.get('/api/projects', config);
      const currentProject = pRes.data.find(p => p._id === id);
      setProject(currentProject);

      const tRes = await axios.get(`/api/tasks/project/${id}`, config);
      setTasks(tRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...formData, project: id }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'To Do', priority: 'Medium', assignee: '', dueDate: '' });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex-center" style={{height: '60vh'}}>Loading...</div>;
  if (!project) return <div className="flex-center" style={{height: '60vh'}}>Project not found</div>;

  const columns = ['To Do', 'In Progress', 'Done'];
  const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {columns.map((col) => (
          <div key={col} className="glass-panel" style={{ padding: '1.5rem', minHeight: '60vh', background: 'rgba(15,23,42,0.4)' }}>
            <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {col}
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === col).map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={task._id} 
                  className="glass-card" 
                  style={{ padding: '1.25rem', borderLeft: `3px solid ${priorityColors[task.priority] || 'var(--primary)'}` }}
                >
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem' }}>{task.title}</h4>
                    {user.role === 'Admin' && (
                      <button onClick={() => deleteTask(task._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{task.description}</p>
                  
                  {/* Priority & Assignee */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority], fontSize: '0.75rem' }}>
                      {task.priority}
                    </span>
                    {isOverdue(task) && (
                      <span className="badge" style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} /> Overdue
                      </span>
                    )}
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {task.assignee ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                          {task.assignee.username.charAt(0).toUpperCase()}
                        </div>
                        {task.assignee.username}
                      </span>
                    ) : <span>Unassigned</span>}
                    
                    {task.dueDate && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isOverdue(task) ? 'var(--danger)' : 'var(--text-muted)' }}>
                        <Clock size={13} /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {col !== 'To Do' && <button onClick={() => updateTaskStatus(task._id, 'To Do')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }}>To Do</button>}
                    {col !== 'In Progress' && <button onClick={() => updateTaskStatus(task._id, 'In Progress')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }}>Start</button>}
                    {col !== 'Done' && <button onClick={() => updateTaskStatus(task._id, 'Done')} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }}><CheckCircle size={13}/> Done</button>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Task Title *</label>
                <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea className="input-field" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Priority</label>
                  <select className="input-field" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Due Date</label>
                  <input type="date" className="input-field" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Assignee</label>
                <select className="input-field" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members.map(m => (
                    <option key={m._id} value={m._id}>{m.username}</option>
                  ))}
                  {project.owner && !project.members.find(m => m._id === project.owner._id) && (
                    <option value={project.owner._id}>{project.owner.username} (Owner)</option>
                  )}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Task</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
