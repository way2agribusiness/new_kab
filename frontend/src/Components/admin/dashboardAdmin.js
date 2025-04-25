import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaUser, FaUserShield, FaUserAlt, FaProductHunt } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  // State variables
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the token from local storage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = getToken();
        if (token) {
          setLoading(true);
          const response = await axios.get(`${process.env.REACT_APP_API_URL_ADM}/dashboard`);
          const data = response.data;

          const updatedCardData = [
            {
              id: 1,
              title: 'Products in Stock (Qty.)',
              quantity: data.totalProductInstocks,
              icon: <FaBoxOpen className="h-6 w-6 text-green-500" />,
              link: '/products'
            },
            {
              id: 2,
              title: 'Products',
              quantity: data.totalProducts,
              icon: <FaProductHunt className="h-6 w-6 text-green-500" />,
              link: '/products'
            },
            {
              id: 6,
              title: 'Buyer Enquiries (Reg.)',
              quantity: data.totalAdminEnquiries,
              icon: <FaUser className="h-6 w-6 text-red-500" />,
              link: '/registered/enquiries'
            },
            {
              id: 7,
              title: 'Total Buyers',
              quantity: data.totalBuyers,
              icon: <FaUserAlt className="h-6 w-6 text-teal-500" />,
              link: '/buyers'
            },
            {
              id: 8,
              title: 'Total Vendors',
              quantity: data.totalVendors,
              icon: <FaUserShield className="h-6 w-6 text-indigo-500" />,
              link: '/vendors'
            },
            {
              id: 11,
              title: 'Blocked Users',
              quantity: data.totalBlockedUsers,
              icon: <FaUserAlt className="h-6 w-6 text-red-700" />,
              link: '/blocked/list'
            },
          ];
          setCardData(updatedCardData);
        } else {
          setError('No authentication token found.');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-green-300">Dashboard</h1>

      {loading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-center text-lg font-semibold text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map(card => (
            <Link to={`${card.link}`}>
              <div
                key={card.id}
                className="relative dark:bg-boxdark dark:text-bodydark p-6 rounded-lg shadow-md ring-1 ring-green-600/35 dark:ring-green-700 transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-white">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{card.title}</h3>
                    <p className="text-2xl font-bold">{card.quantity}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
