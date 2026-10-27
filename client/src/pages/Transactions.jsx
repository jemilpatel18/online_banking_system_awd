import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: user._id }
        });
        setTransactions(response.data || []);
      } catch (err) {
        console.error('Error fetching transactions', err);
      }
    };

    fetchTransactions();
  }, [user, navigate, token]);

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>Transaction History</h2>
        <div className="card">
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={tx._id || index}>
                      <td>{new Date(tx.createdAt || tx.date).toLocaleString()}</td>
                      <td>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: tx.type === 'deposit' ? 'green' : tx.type === 'transfer' ? 'blue' : 'black' 
                        }}>
                          {tx.type ? tx.type.toUpperCase() : 'UNKNOWN'}
                        </span>
                      </td>
                      <td>₹{tx.amount}</td>
                      <td>{tx.description || '-'}</td>
                      <td>{tx.status || 'Completed'}</td>
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

export default Transactions;
