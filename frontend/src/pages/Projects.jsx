import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, ArrowRight } from 'lucide-react';

const Projects = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', members: [] });

  useEffect(() => {
    fetchProjects();
    if (user.role === 'Admin') fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/projects/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setShowModal(false);
      setFormData({ name: '', description: '', members: [] });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMemberChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, members: value });
  };

  if (loading) return <div className="flex-center" style={{height: '60vh'}}>Loading...</div>;

  return (
    <div className="container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Projects</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid-3">
        {projects.map((project, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            key={project._id}
          >
            <Link to={`/projects/${project._id}`} className="glass-card" style={{ display: 'block', padding: '1.5rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {project.description}
              </p>
              <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Users size={16} /> {project.members.length} members
                </div>
                <ArrowRight size={18} style={{ color: 'var(--primary)' }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Project Name</label>
                <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea className="input-field" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Members (Hold Ctrl/Cmd to select multiple)</label>
                <select multiple className="input-field" style={{ height: '100px' }} onChange={handleMemberChange}>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
