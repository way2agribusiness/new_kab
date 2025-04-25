import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, isToday, isYesterday } from 'date-fns';


const VendorEnquiryDetails = () => {
    const { id } = useParams();
    const [enquiryData, setEnquiryData] = useState(null);


    const getEnquiryData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/getbyId/details/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEnquiryData(data);
        } catch (error) {
            console.error("Failed to fetch enquiry data:", error.message);
        }
    };

    useEffect(() => {
        getEnquiryData();
    }, [id]);

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
            <div className="flex flex-col md:flex-row items-start mb-6">
                <div className="md:w-1/4 flex justify-evenly items-center">
                    <div className="bg-green-300 w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold text-white">
                        {`${enquiryData?.buyerID?.username?.charAt(0) || ''}${enquiryData?.buyerID?.username?.split(' ')[1]?.charAt(0) || ''}`}
                    </div>
                    <div>
                        <p className="text-center text-sm mt-2">{enquiryData?.buyerID?.username}</p>
                        <p className="text-center text-sm">{enquiryData?.mobNumber}</p>
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

export default VendorEnquiryDetails;
