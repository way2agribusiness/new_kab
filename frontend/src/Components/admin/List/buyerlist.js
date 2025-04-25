import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const BuyerList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [allRoles, setAllRoles] = useState([]);
    const navigate = useNavigate();

    // Function to get the token from local storage
    const getToken = () => localStorage.getItem('token');

    const getAllRolesWithDetails = async () => {
        try {
            const token = getToken();
            if (token) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_ADM}/users/get`);
                const data = response.data;
                const reversed = data.reverse();
                setAllRoles(reversed);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    useEffect(() => {
        getAllRolesWithDetails();
    }, []);

    // Filtered data based on search query and role
    const filteredData = allRoles.filter((item) =>
        Object.values(item).some((val) =>
            val !== null && val !== undefined && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ) && item.roleID?.name === "Buyer"
    );


    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Get current items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const buyerView = (id) => {
        navigate(`/buyers/details/${id}`);
    };

    return (
        <div className="p-5 h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-xl mb-2 text-gray-800 dark:text-gray-100">Buyer List</h1>

            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 pl-10 text-gray-700 shadow-md bg-white dark:bg-boxdark dark:text-bodydark dark:shadow-none rounded-lg focus:outline-none"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Table for larger screens */}
            <div className="overflow-auto rounded-lg shadow-md hidden md:block bg-white dark:bg-boxdark dark:text-bodydark dark:shadow-none">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                        <tr>
                            <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">S.No</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Buyername</th>
                            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Phone</th>
                            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Blocked</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Created At</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Updated At</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {currentItems.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray dark:hover:bg-body cursor-pointer"
                                onClick={buyerView.bind(this, item._id)}>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{index + 1}.</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.username}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.phone}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.isBlocked ? 'Yes' : 'No'}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{new Date(item.updatedAt).toLocaleDateString()}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                    <Link to={`/buyers/details/${item._id}`}
                                        className="text-success hover:underline dark:text-success"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grid for smaller screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {currentItems.map((item) => (
                    <div key={item._id} className="space-y-3 p-4 rounded-lg bg-white dark:bg-boxdark shadow-lg flex">
                        <div className="flex-shrink-0 mr-4">
                            <div className="bg-green-300 w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold text-white">
                                {`${item?.username?.charAt(0) || ''}${item?.username?.split(' ')[1]?.charAt(0) || ''}`}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                <div className="font-semibold">{item.username}</div>
                                <div>{item.phone}</div>
                                <div>{item.isBlocked ? 'Blocked' : 'Active'}</div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Created: {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Updated: {new Date(item.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link to={`/buyers/details/${item._id}`}
                                    className="text-success hover:underline dark:text-success"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 text-white bg-blue-500 rounded disabled:opacity-50 dark:bg-blue-400"
                >
                    Previous
                </button>
                <span className="px-4 py-2 mx-1 text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 text-white bg-blue-500 rounded disabled:opacity-50 dark:bg-blue-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
export default BuyerList;