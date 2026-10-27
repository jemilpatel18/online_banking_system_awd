import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function BankingSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', tenure: '', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [myApplications, setMyApplications] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }
    fetchSchemes();
    fetchMyApplications();
  }, [user, navigate]);

  const fetchSchemes = async () => {
    try {
      const response = await api.get('/api/schemes');
      setSchemes(response.data || []);
    } catch (err) {
      console.error('Error fetching schemes', err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await api.get('/api/schemes/applications/my');
      setMyApplications(response.data || []);
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
  };

  const handleCloseDetails = () => {
    setSelectedScheme(null);
  };

  const handleApplyClick = (scheme) => {
    setSelectedScheme(scheme);
    setShowApplyModal(true);
    setMessage('');
    setError('');
    setFormData({ amount: '', tenure: '', notes: '' });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/api/schemes/apply', {
        schemeId: selectedScheme._id,
        amount: Number(formData.amount),
        tenure: formData.tenure,
        notes: formData.notes
      });

      setMessage('Application submitted successfully!');
      setShowApplyModal(false);
      fetchMyApplications();
      setFormData({ amount: '', tenure: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  const hasApplied = (schemeId) => {
    return myApplications.some(app => app.scheme._id === schemeId);
  };

  const regularSchemes = schemes.filter(s => s.type === 'regular');
  const festivalSchemes = schemes.filter(s => s.type === 'festival');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'Upcoming': return '#ffc107';
      case 'Expired': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>Banking Schemes</h2>

        {/* Regular Banking Schemes */}
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' }}>
            🏦 Regular Banking Schemes
          </h3>
          {regularSchemes.length === 0 ? (
            <p>No regular schemes available at the moment.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {regularSchemes.map(scheme => (
                <div key={scheme._id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '2rem', marginRight: '10px' }}>{scheme.icon || '📋'}</span>
                    <div>
                      <h4 style={{ margin: 0 }}>{scheme.name}</h4>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: getStatusColor(scheme.status),
                        color: '#fff'
                      }}>
                        {scheme.status}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{scheme.description}</p>
                  {scheme.interestRate && (
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#007bff' }}>
                      Interest Rate: {scheme.interestRate}% p.a.
                    </p>
                  )}
                  {scheme.tenure && (
                    <p style={{ fontSize: '14px' }}>Tenure: {scheme.tenure}</p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                      onClick={() => handleViewDetails(scheme)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px' }}
                    >
                      View Details
                    </button>
                    {!hasApplied(scheme._id) && scheme.status === 'Active' && (
                      <button
                        onClick={() => handleApplyClick(scheme)}
                        className="btn btn-success"
                        style={{ flex: 1, padding: '8px' }}
                      >
                        Apply Now
                      </button>
                    )}
                    {hasApplied(scheme._id) && (
                      <button
                        disabled
                        className="btn"
                        style={{ flex: 1, padding: '8px', backgroundColor: '#6c757d', color: '#fff' }}
                      >
                        Applied
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Festival Special Schemes */}
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #ff6b6b', paddingBottom: '10px', marginBottom: '20px' }}>
            🎉 Festival Special Offers
          </h3>
          {festivalSchemes.length === 0 ? (
            <p>No festival schemes available at the moment.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {festivalSchemes.map(scheme => (
                <div key={scheme._id} style={{
                  border: '2px solid #ff6b6b',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fff5f5',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '2rem', marginRight: '10px' }}>{scheme.icon || '🎊'}</span>
                    <div>
                      <h4 style={{ margin: 0, color: '#ff6b6b' }}>{scheme.name}</h4>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: getStatusColor(scheme.status),
                        color: '#fff'
                      }}>
                        {scheme.status}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{scheme.description}</p>
                  {scheme.interestRate && (
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6b6b' }}>
                      Special Interest Rate: {scheme.interestRate}% p.a.
                    </p>
                  )}
                  {scheme.tenure && (
                    <p style={{ fontSize: '14px' }}>Tenure: {scheme.tenure}</p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                      onClick={() => handleViewDetails(scheme)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px' }}
                    >
                      View Details
                    </button>
                    {!hasApplied(scheme._id) && scheme.status === 'Active' && (
                      <button
                        onClick={() => handleApplyClick(scheme)}
                        className="btn btn-success"
                        style={{ flex: 1, padding: '8px', backgroundColor: '#ff6b6b', border: 'none' }}
                      >
                        Apply Now
                      </button>
                    )}
                    {hasApplied(scheme._id) && (
                      <button
                        disabled
                        className="btn"
                        style={{ flex: 1, padding: '8px', backgroundColor: '#6c757d', color: '#fff' }}
                      >
                        Applied
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Applications */}
        <div className="card">
          <h3>My Applications</h3>
          {myApplications.length === 0 ? (
            <p>You haven't applied for any schemes yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Scheme Name</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Tenure</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myApplications.map(app => (
                    <tr key={app._id}>
                      <td>{app.scheme?.name || 'N/A'}</td>
                      <td>{app.scheme?.type || 'N/A'}</td>
                      <td>₹{app.amount || 0}</td>
                      <td>{app.tenure || '-'}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: app.status === 'Approved' ? '#28a745' :
                                           app.status === 'Pending' ? '#ffc107' :
                                           app.status === 'Rejected' ? '#dc3545' : '#6c757d',
                          color: '#fff',
                          fontSize: '12px'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && !showApplyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: selectedScheme.type === 'festival' ? '#ff6b6b' : '#007bff' }}>
              {selectedScheme.icon} {selectedScheme.name}
            </h3>
            <p><strong>Type:</strong> {selectedScheme.type === 'regular' ? 'Regular Banking Scheme' : 'Festival Special Offer'}</p>
            <p><strong>Description:</strong> {selectedScheme.description}</p>
            <p><strong>Benefits:</strong> {selectedScheme.benefits}</p>
            <p><strong>Eligibility:</strong> {selectedScheme.eligibility}</p>
            {selectedScheme.interestRate && <p><strong>Interest Rate:</strong> {selectedScheme.interestRate}% p.a. (Demo value)</p>}
            {selectedScheme.tenure && <p><strong>Tenure:</strong> {selectedScheme.tenure}</p>}
            {selectedScheme.minAmount && <p><strong>Minimum Amount:</strong> ₹{selectedScheme.minAmount}</p>}
            {selectedScheme.maxAmount && <p><strong>Maximum Amount:</strong> ₹{selectedScheme.maxAmount}</p>}
            {selectedScheme.startDate && <p><strong>Start Date:</strong> {new Date(selectedScheme.startDate).toLocaleDateString()}</p>}
            {selectedScheme.endDate && <p><strong>End Date:</strong> {new Date(selectedScheme.endDate).toLocaleDateString()}</p>}
            <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
              * Interest rates and rewards shown are demo values unless verified against official product terms.
            </p>
            <button
              onClick={handleCloseDetails}
              className="btn btn-primary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedScheme && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3>Apply for {selectedScheme.name}</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  min={selectedScheme.minAmount || 1}
                  max={selectedScheme.maxAmount}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                {selectedScheme.minAmount && <small>Min: ₹{selectedScheme.minAmount}</small>}
                {selectedScheme.maxAmount && <small> | Max: ₹{selectedScheme.maxAmount}</small>}
              </div>
              <div className="form-group">
                <label>Tenure</label>
                <input
                  type="text"
                  value={formData.tenure}
                  onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                  placeholder="e.g., 1 year, 6 months"
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BankingSchemes;
