import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    deposits: 0,
    transfers: 0,
    fds: 0
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const usersRes = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        const txsRes = await axios.get('/api/transactions', { headers: { Authorization: `Bearer ${token}` } });
        const fdsRes = await axios.get('/api/fd', { headers: { Authorization: `Bearer ${token}` } });
        
        const deposits = txsRes.data.filter(tx => tx.type === 'Deposit').length;
        const transfers = txsRes.data.filter(tx => tx.type === 'Transfer').length;

        setStats({
          users: usersRes.data.filter(u => u.role === 'user').length || usersRes.data.length,
          deposits,
          transfers,
          fds: fdsRes.data.length
        });
      } catch (err) {
        console.error('Error fetching admin stats', err);
      }
    };

    fetchStats();
  }, [user, navigate, token]);

  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <Sidebar role="admin" />
      <div className="main-content">
        <h2>Admin Dashboard</h2>
        
        <div className="dashboard-grid">
          <DashboardCard title="Total Users" value={stats.users} icon="👥" />
          <DashboardCard title="Total Deposits" value={stats.deposits} icon="📥" />
          <DashboardCard title="Total Transfers" value={stats.transfers} icon="💸" />
          <DashboardCard title="Total FDs" value={stats.fds} icon="🔒" />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
