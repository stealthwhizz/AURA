const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      name: "Demo Farmer",
      email: "demo@example.com",
      phone: "+911234567890",
      password: "demo123",
      location: {
        latitude: 15.3173,
        longitude: 75.7139,
        address: "Demo Village"
      },
      crops: [{
        type: "maize",
        area: 5,
        storageType: "silo"
      }]
    });

    console.log('Registration successful:', response.data);

    // Now try login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: "demo@example.com",
      password: "demo123"
    });

    console.log('Login successful:', loginResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testRegistration();