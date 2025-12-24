import Navbar from '../components/Navbar';

function Certifications({ farmer, onLogout }) {
  return (
    <div>
      <Navbar farmer={farmer} onLogout={onLogout} />
      <div className="container">
        <h1>AURA Certifications</h1>
        <div className="card">
          <p>Blockchain certification feature - Coming soon!</p>
        </div>
      </div>
    </div>
  );
}

export default Certifications;
