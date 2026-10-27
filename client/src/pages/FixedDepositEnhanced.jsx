import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function FixedDepositEnhanced() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [fdRate, setFdRate] = useState(0);
  const [fds, setFds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const rateRes = await api.get('/api/fd-rate');
        setFdRate(rateRes.data.fdInterestRate ?? 0);

        const fdRes = await api.get('/api/fd', {
          params: { userId: user._id }
        });
        setFds(fdRes.data || []);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      console.log('Submitting FD request:', {
        userId: user._id,
        amount: Number(amount),
        duration: Number(duration)
      });

      const response = await api.post('/api/fd', {
        userId: user._id,
        amount: Number(amount),
        duration: Number(duration)
      });

      console.log('FD response:', response.data);

      setMessage('Fixed Deposit opened successfully!');

      if (response.data.newBalance !== undefined) {
        const updatedUser = { ...user, balance: response.data.newBalance };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setFds([...fds, response.data.fd]);
      } else {
        setFds([...fds, response.data.fd]);
      }

      setAmount('');
      setDuration('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to open FD');
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>Fixed Deposits</h2>
        <div className="card form-container">
          <h3>Open New FD</h3>
          <p>Current Interest Rate: <strong>{fdRate}%</strong> per annum</p>
          <p>Available Balance: <strong>₹{user?.balance || 0}</strong></p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" min="1000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Duration (Years)</label>
              <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>

            {amount && duration && (
              <div style={{ margin: '15px 0', padding: '10px', background: '#f5f7fa', borderRadius: '5px' }}>
                <p>Estimated Interest: <strong>₹{((Number(amount) * fdRate * Number(duration)) / 100).toFixed(2)}</strong></p>
                <p>Estimated Maturity Amount: <strong>₹{(Number(amount) + (Number(amount) * fdRate * Number(duration)) / 100).toFixed(2)}</strong></p>
                <p style={{ fontSize: '12px', color: '#666' }}>* Actual maturity amount may vary based on bank policies</p>
              </div>
            )}

            <button type="submit" className="btn btn-warning">Open FD</button>
          </form>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <h3>My Fixed Deposits</h3>
          {fds.length === 0 ? (
            <p>You don't have any fixed deposits yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Rate</th>
                    <th>Duration (Yrs)</th>
                    <th>Interest</th>
                    <th>Maturity Amount</th>
                    <th>Maturity Date</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fds.map((fd, index) => (
                    <tr key={index}>
                      <td>₹{fd.amount}</td>
                      <td>{fd.interestRate}%</td>
                      <td>{fd.duration}</td>
                      <td>₹{fd.interest}</td>
                      <td>₹{fd.maturityAmount}</td>
                      <td>{fd.maturityDate ? new Date(fd.maturityDate).toLocaleDateString() : '-'}</td>
                      <td>{fd.status || 'Active'}</td>
                      <td>{new Date(fd.createdAt || fd.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FixedDepositEnhanced;
