import './Navbar.css';

function Navbar({ farmer, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🌾 AURA</h2>
        </div>
        
        <div className="navbar-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/predictions">Predictions</a>
          <a href="/alerts">Alerts</a>
          <a href="/certifications">Certifications</a>
          <a href="/profile">Profile</a>
        </div>
        
        <div className="navbar-user">
          <span>{farmer?.name}</span>
          <button onClick={onLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
