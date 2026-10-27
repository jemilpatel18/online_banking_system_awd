import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';

function UserDashboard() {
  const [fdRate, setFdRate] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const rateRes = await axios.get('/api/fd-rate');
        const currentRate = rateRes.data.fdInterestRate ?? 15;
        setFdRate(currentRate);
        localStorage.setItem('fdRate', String(currentRate));

        const txRes = await axios.get('/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTxCount(txRes.data.length || 0);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      }
    };

    fetchData();
  }, [user, navigate, token]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>Welcome, {user.fullName || user.name}!</h2>
        
        <div className="dashboard-grid">
          <DashboardCard title="Account Number" value={user.accountNumber || 'N/A'} icon="🏦" />
          <DashboardCard title="Current Balance" value={`₹${user.balance || 0}`} icon="💰" />
          <DashboardCard title="FD Interest Rate" value={`${fdRate}%`} icon="📈" />
          <DashboardCard title="Total Transactions" value={txCount} icon="🧾" />
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/deposit" className="btn btn-primary">Deposit Money</Link>
            <Link to="/transfer" className="btn btn-success">Transfer Funds</Link>
            <Link to="/fixed-deposit" className="btn btn-warning">Open Fixed Deposit</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
