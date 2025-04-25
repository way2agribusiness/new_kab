import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaUserAlt, FaStar, FaEnvelope, FaProductHunt } from 'react-icons/fa';
import axios from 'axios';
import { Link } from "react-router-dom";

const DashboardVendor = ({ user }) => {
    const [cardData, setCardData] = useState([]);
    const [error, setError] = useState(null);
    const [vendorID, setVendorID] = useState(user && user._id);

    const categoryIDs = user.categoryID.map((res) => res._id);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_PRO}/dashboard/data`, {
                    params: { vendorID, categoryIDs }
                });

                const data = response.data;

                const updatedCardData = [
                    {
                        id: 1,
                        title: 'Products in Stock (Qty.)',
                        quantity: data.totalProductQuantity,
                        icon: <FaBoxOpen className="h-6 w-6 text-green-500" />,
                        link: '/products'
                    },
                    {
                        id: 2,
                        title: 'Products',
                        quantity: data.totalProductsCount,
                        icon: <FaProductHunt className="h-6 w-6 text-green-500" />,
                        link: `/products`
                    },
                    {
                        id: 3,
                        title: 'Approved Products',
                        quantity: data.totalApprovedProducts,
                        icon: <FaCheckCircle className="h-6 w-6 text-blue-500" />,
                        link: `/products/${'approved'}`
                    },
                    {
                        id: 4,
                        title: 'Not-Approved Products',
                        quantity: data.totalNotApprovedProducts,
                        icon: <FaTimesCircle className="h-6 w-6 text-red-500" />,
                        link: `/products/${'not approved'}`
                    },
                    {
                        id: 5,
                        title: 'Buyer Enquiries',
                        quantity: data.totalVendorEnquiries,
                        icon: <FaUserAlt className="h-6 w-6 text-purple-500" />,
                        link: '/enquiries'
                    },
                    {
                        id: 6,
                        title: 'Lead Enquiries',
                        quantity: data.totalAdminEnquiries,
                        icon: <FaEnvelope className="h-6 w-6 text-blue-500" />,
                        link: '/lead-managers'
                    },
                    {
                        id: 7,
                        title: 'Product Rating (Avg.)',
                        quantity: data.averageProductRating, // Example static data, replace with real data if available
                        icon: <FaStar className="h-6 w-6 text-orange-500" />,
                        link: '/dashboard'
                    },

                    // {
                    //     id: 8,
                    //     title: 'Seller Rating',
                    //     quantity: 5, // Example static data, replace with real data if available
                    //     icon: <FaStar className="h-6 w-6 text-purple-500" />,
                    //      link: '/dashboard'
                    // }
                ];

                setCardData(updatedCardData);
            } catch (error) {
                setError(error.response?.data?.error || 'An error occurred');
            }
        };

        fetchDashboardData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (cardData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-green-300">Dashboard Vendor Page</h1>
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
        </div>
    );
};

export default DashboardVendor;
