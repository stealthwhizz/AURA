import Navbar from '../components/Navbar';

function Profile({ farmer, onLogout }) {
  return (
    <div>
      <Navbar farmer={farmer} onLogout={onLogout} />
      <div className="container">
        <h1>Farmer Profile</h1>
        <div className="card">
          <h3>{farmer.name}</h3>
          <p>Email: {farmer.email}</p>
          <p>Location: {farmer.location.address || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
