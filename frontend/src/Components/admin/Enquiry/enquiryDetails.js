import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format, isToday, isYesterday } from 'date-fns';

const EnquiryDetails = () => {
    const { id } = useParams();
    const [enquiryData, setEnquiryData] = useState(null);
    const [isApproved, setIsApproved] = useState(null);

    const getEnquiryData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/getbyId/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEnquiryData(data);
            setIsApproved(data.isApproved); // Set the initial approval status
        } catch (error) {
            console.error("Failed to fetch enquiry data:", error.message);
        }
    };

    useEffect(() => {
        getEnquiryData();
    }, [id]);

    const getToken = () => localStorage.getItem('token');

    const toggleApprovalStatus = async () => {
        const isConfirmed = window.confirm(
            `Are you sure you want to ${isApproved ? 'disapprove' : 'approve'} this product?`
        );

        if (isConfirmed) {
            try {
                const token = getToken();
                const newApprovalStatus = !isApproved;
                const response = await axios.patch(
                    `${process.env.REACT_APP_API_URL_ENQ}/approval/${id}`, // Ensure ID is used correctly
                    { isApproved: newApprovalStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setIsApproved(newApprovalStatus);
                setEnquiryData((prev) => ({
                    ...prev,
                    isApproved: newApprovalStatus
                }));
                console.log('Enquiry approval status updated successfully:', response.data);
            } catch (error) {
                console.error('Error updating enquiry approval status:', error);
            }
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
        <div className="container mx-auto p-4 bg-white shadow-md dark:bg-boxdark">
            {/* First Section: Photo on the left, Product Name and Description on the right */}
            <div className="flex flex-col md:flex-row items-start mb-6">
                <div className="md:w-1/4 flex justify-evenly items-center">
                    <div className="bg-green-300 w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold text-white">
                        {`${enquiryData?.buyerID?.username?.charAt(0) || ''}${enquiryData?.buyerID?.username?.split(' ')[1]?.charAt(0) || ''}`}
                    </div>
                    <div>
                        <p className="text-center text-sm mt-2">{enquiryData?.buyerID?.username}</p>
                        <p className="text-center text-sm">{enquiryData?.buyerID?.phone}</p>
                    </div>
                </div>
                <div className="md:w-full md:pl-5">
                    <h2 className="text-2xl font-semibold mb-2">{enquiryData?.productName}</h2>
                    <p className="text-gray-700">{enquiryData?.description}</p>
                </div>
            </div>

            {/* Line Break */}
            <hr className="my-6" />

            {/* Second Section: Category Name, Approved Product, Date on the left, Full Address on the right */}
            <div className="flex flex-col md:flex-row items-start">
                <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold mb-2">Category: <span className="text-success text-sm">{enquiryData?.categoryID?.name}</span></h3>
                    <p className="text-gray-700 mb-2">Approved Enquiry: {" "}
                        <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${isApproved ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-600' : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-600'} rounded-lg`}>
                            {isApproved ? 'Approved' : 'Not-Approved'}
                        </span>
                        <span
                            className="text-sm ms-3 text-warning hover:text-success hover:underline cursor-pointer"
                            title={isApproved ? 'Click to Disapprove' : 'Click to Approve'}
                            onClick={toggleApprovalStatus}
                        >
                            click
                        </span>
                    </p>
                    <p className="text-gray-700">Date: {formatDate(enquiryData && enquiryData.createdAt)}</p>
                    <p className="text-gray-700">Time: {enquiryData && new Date(enquiryData.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="md:w-1/2 md:pl-6">
                    <h3 className="text-xl font-semibold mb-2">Address</h3>
                    <p className="text-gray-700">{enquiryData?.buyerID?.addressID?.address_line1}</p>
                    <p className="text-gray-700">{enquiryData?.buyerID?.addressID?.address_line2}</p>
                    <p className="text-gray-700">{enquiryData?.buyerID?.addressID?.city}, {enquiryData?.buyerID?.addressID?.state}</p>
                    <p className="text-gray-700">{enquiryData?.buyerID?.addressID?.country}, {enquiryData?.buyerID?.addressID?.postal_code}</p>
                </div>
            </div>
        </div>
    );
};

export default EnquiryDetails;
