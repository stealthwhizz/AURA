import Navbar from '../components/Navbar';

function Alerts({ farmer, onLogout }) {
  return (
    <div>
      <Navbar farmer={farmer} onLogout={onLogout} />
      <div className="container">
        <h1>Alerts & Notifications</h1>
        <div className="card">
          <p>Alerts management feature - Coming soon!</p>
        </div>
      </div>
    </div>
  );
}

export default Alerts;
