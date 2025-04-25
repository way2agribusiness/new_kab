import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { format, isToday, isYesterday } from 'date-fns';
import { RiDeleteBinLine } from "react-icons/ri";
import Toast from "../../commons/Toastify";

const GeneralEnquiryVendor = ({ user }) => {
    const [enquiryData, setEnquiryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");
    const [vendorID, setVendorID] = useState(user && user._id);
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();


    // Initialize categoryIDs safely
    const [categoryIDs, setCategoryIDs] = useState(() => {
        return user && Array.isArray(user.categoryID)
            ? user.categoryID.map((category) => category._id) // Map to ID
            : []; // Fallback to an empty array
    });

    useEffect(() => {
        // Update categoryIDs when user changes (if needed)
        if (user && Array.isArray(user.categoryID)) {
            setCategoryIDs(user.categoryID.map((category) => category._id));
        }
    }, [user]);


    const getEnquiryData = async () => {
        try {
            // Construct the query string from the categoryIDs array
            const queryString = new URLSearchParams({
                categoryIDs: categoryIDs.join(','), // Join IDs with commas for the query parameter
            }).toString();

            // Make the GET request with categoryIDs as query parameters
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/addEnquiry/get/${vendorID}?${queryString}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const serRes = await response.json();
            const reversed = serRes.data.reverse(); // Reverse if needed
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


    const enquiryView = async (enquiryId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/addEnquiry/views/${enquiryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vendorID }), // Send the vendorID in the request body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

        } catch (error) {
            console.error("Error marking enquiry as viewed:", error);
        }
        // Navigate to the details page after the enquiry is viewed
        navigate(`/general/enquiry/details/${enquiryId}`);
    };


    const handleRemoveVendor = async (enquiryID) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/addEnquiry/remove/${enquiryID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vendorID: vendorID }),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({
                    show: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Enquiry removed successfully!',
                });

                // Show the success toast for 1 seconds, then navigate
                setTimeout(() => {
                    setToast({ show: false });
                }, 1000);

                getEnquiryData();

            } else {
                // Show the error toast
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Error',
                    message: data.message,
                });

                setTimeout(() => {
                    setToast({ show: false });
                }, 1000); // Hide toast after 1 seconds
            }

        } catch (error) {
            console.error('Error while removing vendor:', error);
            // Show the error toast
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: error || 'An error occurred. Please try again.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 seconds
        }
    };

    return (
        <>
            <div className="p-5 h-screen bg-gray-100 dark:bg-gray-900">
                <h1 className="text-xl mb-2 text-gray-800 dark:text-gray-100">General Product Enquiries by Leads</h1>

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
                    <table className="w-full text-center">
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
                                >
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        {indexOfFirstItem + index + 1}.
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300"
                                        onClick={enquiryView.bind(this, item._id)}
                                    >
                                        {item && item.username}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300"
                                        onClick={enquiryView.bind(this, item._id)}>
                                        {item && item.mobNumber}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300"
                                        onClick={enquiryView.bind(this, item._id)}>
                                        {item && item.productName}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300"
                                        onClick={enquiryView.bind(this, item._id)}>
                                        {item && item.categoryID && item.categoryID.name}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                        onClick={enquiryView.bind(this, item._id)}>
                                        <span className={`p-3 text-sm text-gray-700 dark:text-gray-300`}>
                                            {item && item.city}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                        onClick={enquiryView.bind(this, item._id)}
                                    >
                                        <p>
                                            {item && item.taluk}
                                        </p>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                        onClick={enquiryView.bind(this, item._id)}
                                    >
                                        {formatDate(item && item.createdAt)}
                                        <p>{new Date(item && item.createdAt).toLocaleTimeString()}</p>
                                    </td>
                                    <td className="flex p-3 mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        <div className=""
                                            onClick={enquiryView.bind(this, item._id)}
                                        >
                                            {user && item.isViews.some(v => v.vendorID === user._id) ? (
                                                <div className="flex me-2 text-primary hover:underline dark:text-primary">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="h-5 w-8">
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="flex me-2 text-success hover:underline dark:text-success">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        className="h-5 w-8">
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <button className="text-red-600 hover:text-red-700"
                                                onClick={handleRemoveVendor.bind(this, item._id)}
                                            >
                                                <RiDeleteBinLine className="text-lg" />
                                            </button>
                                        </div>
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
                            <div className="flex space-x-2 justify-end mt-2">
                                <Link to={`/general/enquiry/details/${item._id}`} className="text-green-500 hover:underline dark:text-green-400">
                                    View
                                </Link>
                                <button className="text-red-600 hover:text-red-700"
                                    onClick={handleRemoveVendor.bind(this, item._id)}
                                >
                                    <RiDeleteBinLine className="text-lg" />
                                </button>
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

            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}
        </>
    );
};

export default GeneralEnquiryVendor;
