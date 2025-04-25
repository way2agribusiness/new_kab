import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FeedbackDetails from './feedbackDetails';


const FeedbackList = () => {
    const [currentData, setCurrentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isOpenDetails, setOpenDetails] = useState(false);
    const [databyId, setDataById] = useState('');


    const getFeedback = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/get`);
            const serRes = await response.json();

            if (response.ok) {
                const reversed = serRes.reverse();
                setCurrentData(reversed);
                setTotalItems(serRes.length);
            } else {
                console.error('Error fetching data:', serRes);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        getFeedback();
    }, []);

    // Calculate current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Create pagination numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const openDetails = (item) => {
        setDataById(item);
        setOpenDetails(true);
    };

    const closeDetails = () => {
        setOpenDetails(false);
    };

    return (
        <>
            <div className="p-5 h-screen bg-gray-100 dark:bg-gray-900">
                {/* Table view for desktop */}
                <div className="overflow-auto rounded-lg shadow-md hidden md:block bg-white dark:bg-boxdark dark:text-bodydark dark:shadow-none">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal dark:bg-meta-4 border-b-2">
                                <th className="py-3 px-6 text-left">S.No</th>
                                <th className="py-3 px-6 text-left">Username</th>
                                <th className="py-3 px-6 text-left">Mobile Number</th>
                                <th className="py-3 px-6 text-left">Role</th>
                                <th className="py-3 px-6 text-left">Rating</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-center text-sm">
                            {currentItems.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray dark:hover:bg-body cursor-pointer"
                                    onClick={openDetails.bind(this, item)}
                                >
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1 + indexOfFirstItem}</td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.userID.username}</td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.userID.phone}</td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.userID.roleID.name}</td>
                                    {/* <td className="py-3 px-6 text-left whitespace-nowrap">{item.serviceRating}</td> */}
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        <div className="flex items-center">
                                            {[0, 1, 2, 3, 4].map((starIndex) => {
                                                if (starIndex < Math.floor(item.serviceRating)) {
                                                    return <FaStar key={starIndex} className="text-yellow-500 mr-1" />;
                                                }
                                                if (starIndex === Math.floor(item.serviceRating) && item.serviceRating % 1 !== 0) {
                                                    return <FaStarHalfAlt key={starIndex} className="text-yellow-500 mr-1" />;
                                                }
                                                return <FaStar key={starIndex} className="text-gray-300 mr-1" />;
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        <Link
                                            className="text-success hover:underline dark:text-success">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - List Layout */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {currentItems.map((item, index) => (
                        <div key={item._id} className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-md"
                            onClick={openDetails.bind(this, item)}
                        >
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-300">Review {index + 1 + indexOfFirstItem}</h2>
                            </div>
                            <div className="mb-2">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Username: </span>
                                <span className="text-sm">{item.userID.username}</span>
                            </div>
                            <div className="mb-2">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Mobile Number: </span>
                                <span className="text-sm">{item.userID.phone}</span>
                            </div>
                            <div className="mb-2">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Role: </span>
                                <span className="text-sm">{item.userID.roleID.name}</span>
                            </div>
                            <div className="mb-2 flex items-center">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Rating: </span>
                                <span className="flex items-center ms-2">
                                    {[0, 1, 2, 3, 4].map((starIndex) => {
                                        if (starIndex < Math.floor(item.serviceRating)) {
                                            return <FaStar key={starIndex} className="text-yellow-500 mr-1" />;
                                        }
                                        if (starIndex === Math.floor(item.serviceRating) && item.serviceRating % 1 !== 0) {
                                            return <FaStarHalfAlt key={starIndex} className="text-yellow-500 mr-1" />;
                                        }
                                        return <FaStar key={starIndex} className="text-gray-300 mr-1" />;
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    className="text-success hover:underline dark:text-success">
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <ul className="flex list-style-none">
                        {pageNumbers.map(number => (
                            <li key={number} className="mx-1">
                                <button
                                    onClick={() => paginate(number)}
                                    className={`py-2 px-4 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isOpenDetails && <FeedbackDetails closeDetails={closeDetails} databyId={databyId} />}
        </>
    );
};

export default FeedbackList;
