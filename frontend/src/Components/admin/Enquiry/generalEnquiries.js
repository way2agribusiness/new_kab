import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { format, isToday, isYesterday } from 'date-fns';

const GeneralEnquiry = ({ user }) => {
    const [enquiryData, setEnquiryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();



    const getEnquiryData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/general/get`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const serRes = await response.json();
            const reversed = serRes.data.reverse();
            setEnquiryData(reversed);

        } catch (error) {
            console.error('Error fetching enquiry data:', error);
        }
    };

    useEffect(() => {
        getEnquiryData();
    }, []);



    // Calculate total pages
    const totalPages = Math.ceil(enquiryData.length / itemsPerPage);

    const filteredData = enquiryData.filter((item) =>
        Object.values(item || {}).some((val) =>
            (val ? val.toString().toLowerCase() : "").includes(searchQuery.toLowerCase())
        )
    );

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

    const enquiryView = (id) => {
        if (id) {
            navigate(`/general/enquiries/details/${id}`);
        }
    };


    const formatDate = (updatedAt) => {
        const date = new Date(updatedAt);

        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'dd/MM/yyyy'); // You can change the format to your preference
        }
    }

    return (
        <div className="p-5 h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-xl mb-2 text-gray-800 dark:text-gray-100">Product Enquiries by Buyer</h1>

            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 pl-10 text-gray-700 dark:bg-boxdark dark:text-bodydark rounded-lg focus:outline-none"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Table for larger screens */}
            <div className="overflow-auto rounded-lg shadow-lg hidden md:block bg-white dark:bg-boxdark dark:text-bodydark">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                        <tr>
                            <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">S.No</th>
                            {/* <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Image</th> */}
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Username</th>
                            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Phone</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Product Title</th>
                            <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Product Category</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">City</th>
                            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Taluk</th>
                            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Date</th>
                            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 cursor-pointer">
                        {currentItems.map((item, index) => (
                            // console.log('item :', item)
                            <tr key={item.id}
                                className="hover:bg-gray dark:hover:bg-body cursor-pointer"
                                onClick={enquiryView.bind(this, item._id)}
                            >
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    {indexOfFirstItem + index + 1}.
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item && item.username}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item && item.mobNumber}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item && item.productName}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item && item.categoryID && item.categoryID.name}</td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    <span className={`p-3 text-sm text-gray-700 dark:text-gray-300`}>
                                        {item && item.city}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    <p>
                                        {item && item.taluk}
                                    </p>
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    {formatDate(item && item.createdAt)}
                                    <p>{new Date(item && item.createdAt).toLocaleTimeString()}</p>
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    <Link to={`/general/enquiries/details/${item._id}`}
                                        className="text-success hover:underline dark:text-success">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grid for smaller screens */}
            <div className="block md:hidden">
                {currentItems.map((item, index) => (
                    <div key={item.id} className="bg-white dark:bg-boxdark rounded-lg shadow-md mb-4 p-4 dark:text-gray-200">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{indexOfFirstItem + index + 1}.</p>
                        <div className="mb-2">
                            <h2 className="text-lg font-semibold">{item && item.productName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item && item.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item && item.mobNumber}</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Category: {item && item.categoryID && item.categoryID.name}</p>
                        <p>
                            City : {item && item.city}
                        </p>
                        <p>
                            Taluk : {item && item.taluk}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 mt-2">
                            {formatDate(item && item.createdAt)}
                            <p>{new Date(item && item.createdAt).toLocaleTimeString()}</p>
                        </p>
                        <div className="flex justify-end mt-2">
                            <Link to={`/general/enquiries/details/${item._id}`} className="text-green-500 hover:underline dark:text-green-400">
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
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

export default GeneralEnquiry;
