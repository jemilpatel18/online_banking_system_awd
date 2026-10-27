import { NavLink } from 'react-router-dom';

function Sidebar({ role }) {
  if (role === 'admin') {
    return (
      <div className="sidebar">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/users">Manage Users</NavLink>
        <NavLink to="/admin/transactions">Manage Transactions</NavLink>
        <NavLink to="/admin/fds">Manage FDs</NavLink>
        <NavLink to="/admin/schemes">Manage Schemes</NavLink>
        <NavLink to="/admin/fd-settings">FD Rate Settings</NavLink>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <NavLink to="/dashboard" end>Dashboard</NavLink>
      <NavLink to="/deposit">Deposit</NavLink>
      <NavLink to="/transfer">Transfer</NavLink>
      <NavLink to="/fixed-deposit">Fixed Deposit</NavLink>
      <NavLink to="/schemes">Banking Schemes</NavLink>
      <NavLink to="/transactions">Transactions</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </div>
  );
}

export default Sidebar;
