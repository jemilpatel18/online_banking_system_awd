import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="public-layout">
      <Navbar />
      <div className="hero">
        <h1>Welcome to APEX BANK</h1>
        <p>Your Trusted Banking Partner</p>
        <div className="actions">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-success">Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
