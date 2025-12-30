const axios = require('./backend/node_modules/axios').default;

async function testRegister() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      name: 'Demo Farmer',
      email: 'demo@example.com',
      phone: '+911234567890',
      password: 'demo123',
      location: {
        latitude: 15.3173,
        longitude: 75.7139,
        address: 'Demo Village'
      },
      crops: [{
        type: 'maize',
        area: 5,
        storageType: 'bag'
      }]
    });
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testRegister();