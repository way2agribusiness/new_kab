import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { format, isToday, isYesterday } from 'date-fns';


const LeadManagersVendor = ({ user }) => {
  const [enquiryData, setEnquiryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchQuery, setSearchQuery] = useState("");
  const [catData, setCatData] = useState(user?.categoryID || []);
  const [vendorID, setVendorID] = useState(user && user._id);
  const navigate = useNavigate();

  useEffect(() => {
    setCatData(user?.categoryID || []);
  }, [user]);

  const getAllApprovedEnquiry = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/approved/getall`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }

      const serRes = await response.json();
      const reversed = serRes.reverse();
      setEnquiryData(reversed);

      return serRes;

    } catch (error) {
      console.error('Error fetching approved enquiries:', error);
    }
  };

  useEffect(() => {
    getAllApprovedEnquiry();
  }, [])


  const categoryNames = catData.map(res => res.name.toLowerCase());

  // Calculate total pages
  const totalPages = Math.ceil(enquiryData.length / itemsPerPage);

  // Filtered data based on search query and category
  const filteredData = enquiryData
    .filter(item => categoryNames.includes(item.categoryID.name.toLowerCase()))
    .filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
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

  const enquiryView = async (enquiryId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/views/buyer/${enquiryId}`, {
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
    navigate(`/lead-managers/enquiry/details/${enquiryId}`);
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

  const TableRow = ({ item, index }) => (
    <tr key={item._id}
      className="hover:bg-gray dark:hover:bg-body cursor-pointer"
      onClick={enquiryView.bind(this, item._id)}
    >
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {indexOfFirstItem + index + 1}.
      </td>
      {/* <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        <img src={item.buyerID.photo} alt="Buyer" className="w-16 h-10 object-cover rounded" />
      </td> */}
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.buyerID.username}</td>
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.buyerID.phone}</td>
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.productName}</td>
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300 ">{item.categoryID.name}</td>
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
        <p>
          {item.buyerID.addressID.city}
        </p>
      </td>
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
        {formatDate(item.updatedAt)}
        <p className=" whitespace-nowrap">{new Date(item.updatedAt).toLocaleTimeString()}</p>
      </td>
      <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
        <div className=""
          onClick={enquiryView.bind(this, item._id)}
        >
          {user && item.views.some(v => v.vendorID === user._id) ? (
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
      </td>
    </tr>
  );

  const GridItem = ({ item, index }) => (
    <div key={item._id} className="bg-white dark:bg-boxdark rounded-lg shadow-md mb-4 p-4 dark:text-gray-200"
      onClick={enquiryView.bind(this, item._id)}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">#{indexOfFirstItem + index + 1}</p>
      <div className="mb-2">
        {item.buyerID.photo ? (
          <img
            src={item.buyerID.photo}
            alt={item.productName}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <div className="mb-2">
        <h2 className="text-lg font-semibold">{item.productName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.buyerID.username}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.buyerID.phone}</p>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Category: {item.categoryID.name}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 mt-2">Date: {formatDate(item.updatedAt)}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Time: <span className="bg-success">{new Date(item.updatedAt).toLocaleTimeString()}</span></p>
      <div className="flex justify-end mt-2">
        <div className="">
          {user && item.views.some(v => v.vendorID === user._id) ? (
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
              <p>Viewed</p>
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
              <p>View</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-5 h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl mb-2 text-gray-800 dark:text-gray-100">Product Enquiries by Leads</h1>

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
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Place</th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Date</th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 cursor-pointer">
            {currentItems.map((item, index) => (
              <TableRow key={item._id} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid for smaller screens */}
      <div className="block md:hidden">
        {currentItems.map((item, index) => (
          <GridItem key={item._id} item={item} index={index} indexOfFirstItem={indexOfFirstItem} />
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

export default LeadManagersVendor;
