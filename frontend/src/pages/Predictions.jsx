import Navbar from '../components/Navbar';

function Predictions({ farmer, onLogout }) {
  return (
    <div>
      <Navbar farmer={farmer} onLogout={onLogout} />
      <div className="container">
        <h1>Prediction History</h1>
        <div className="card">
          <p>Prediction history feature - Coming soon!</p>
        </div>
      </div>
    </div>
  );
}

export default Predictions;
