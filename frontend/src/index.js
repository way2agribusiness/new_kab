import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './css/style.css';
import './css/satoshi.css';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import BuyerApp from './buyerApp';
import VendorApp from './vendorApp';
import AdminApp from './adminApp';

// Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState('');

  // Function to get the token from local storage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = getToken();
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/getuser`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          setRole(response.data.roleID.name);
          // console.log('profile data :', response.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    getUserProfile();
  }, []);

  // Determine which component to render based on role in localStorage
  let appComponent = <BuyerApp user={user}/>; // Default to BuyerApp

  if (role && role.toLowerCase() === 'vendor') {
    appComponent = <VendorApp user={user} />;
  } else if (role && role.toLowerCase() === 'admin') {
    appComponent = <AdminApp user={user} />;
  }

  return (
    <QueryClientProvider client={queryClient}> {/* Wrap your app with QueryClientProvider */}
      <React.StrictMode>
        {appComponent}
      </React.StrictMode>
    </QueryClientProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
