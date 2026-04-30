import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-panel"
      style={{
        margin: '1rem auto',
        maxWidth: '1200px',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '1rem',
        zIndex: 100
      }}
    >
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{color: 'white', fontSize: '1rem'}}>T</span>
        </div>
        TaskFlow
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{
          color: location.pathname === '/' ? 'white' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s'
        }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/projects" style={{
          color: location.pathname.includes('/projects') ? 'white' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s'
        }}>
          <FolderKanban size={18} /> Projects
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600 }}>{user.username}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.role}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
          <LogOut size={16} />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
