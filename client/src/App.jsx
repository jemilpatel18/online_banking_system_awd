import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UserDashboard from './pages/UserDashboardEnhanced.jsx';
import Deposit from './pages/Deposit.jsx';
import Transfer from './pages/Transfer.jsx';
import FixedDeposit from './pages/FixedDepositEnhanced.jsx';
import Transactions from './pages/Transactions.jsx';
import Profile from './pages/Profile.jsx';
import BankingSchemes from './pages/BankingSchemes.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManageUsers from './pages/AdminManageUsers.jsx';
import ManageTransactions from './pages/ManageTransactions.jsx';
import ManageFDs from './pages/ManageFDs.jsx';
import FDSettings from './pages/AdminFDSettings.jsx';
import AdminManageSchemes from './pages/AdminManageSchemes.jsx';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/fixed-deposit" element={<FixedDeposit />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/schemes" element={<BankingSchemes />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/transactions" element={<ManageTransactions />} />
        <Route path="/admin/fds" element={<ManageFDs />} />
        <Route path="/admin/fd-settings" element={<FDSettings />} />
        <Route path="/admin/schemes" element={<AdminManageSchemes />} />
      </Routes>
    </div>
  );
}

export default App;
