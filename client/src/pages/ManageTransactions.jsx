import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function ManageTransactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions', err);
      }
    };

    fetchTransactions();
  }, [currentUser, navigate, token]);

  return (
    <>
      <Navbar />
      <Sidebar role="admin" />
      <div className="main-content">
        <h2>Manage Transactions</h2>
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id}>
                    <td>{tx._id.substring(0, 8)}...</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: tx.type === 'deposit' ? 'green' : tx.type === 'transfer' ? 'blue' : 'black' 
                      }}>
                        {tx.type ? tx.type.toUpperCase() : ''}
                      </span>
                    </td>
                    <td>₹{tx.amount}</td>
                    <td>{tx.sender || '-'}</td>
                    <td>{tx.receiver || '-'}</td>
                    <td>{new Date(tx.createdAt || tx.date).toLocaleString()}</td>
                    <td>{tx.status || 'Completed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageTransactions;
