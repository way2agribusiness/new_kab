import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { format, isToday, isYesterday } from 'date-fns';

const FeedbackDetails = ({ closeDetails, databyId }) => {
    const [data, setData] = useState(databyId);

    const formatDate = (createdAt) => {
        if (!createdAt) return 'N/A'; // Fallback for missing date
    
        const date = new Date(createdAt);
        
        if (isNaN(date.getTime())) {
            return 'Invalid Date'; // Handle invalid date parsing
        }
    
        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'dd/MM/yyyy'); // Customize format as needed
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
                <div className="w-full me-3 max-w-lg bg-white dark:bg-boxdark shadow-lg rounded-lg p-6 relative">
                    <div className="flex items-center pb-3 border-b border-gray-300">
                        <h3 className="text-success text-xl text-center font-bold flex-1">Feedback</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
                            viewBox="0 0 320.591 320.591"
                            onClick={closeDetails}
                        >
                            <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                data-original="#000000"></path>
                            <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                data-original="#000000"></path>
                        </svg>
                    </div>

                    <div className="my-6">
                        <div className="flex flex-col md:flex-row items-start mb-6">
                            <div className="md:w-1/4 flex justify-evenly items-center">
                                <div className="bg-green-300 w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold text-white">
                                    {`${data?.userID?.username?.charAt(0) || ''}${data?.userID?.username?.split(' ')[1]?.charAt(0) || ''}`}
                                </div>
                            </div>
                            <div className='ms-2'>
                                <p className="text-sm mt-2">{data?.userID?.username}</p>
                                <p className="text-sm">{data?.userID?.phone}</p>
                            </div>
                            <div className="md:w-full md:pl-5">
                                {/* <h2 className="text-xl mb-2">{data?.serviceRating}</h2> */}
                                <div className="flex items-center mb-2">
                                    {[0, 1, 2, 3, 4].map((starIndex) => {
                                        if (starIndex < Math.floor(data.serviceRating)) {
                                            return <FaStar key={starIndex} className="text-yellow-500 mr-1" />;
                                        }
                                        if (starIndex === Math.floor(data.serviceRating) && data.serviceRating % 1 !== 0) {
                                            return <FaStarHalfAlt key={starIndex} className="text-yellow-500 mr-1" />;
                                        }
                                        return <FaStar key={starIndex} className="text-gray-300 mr-1" />;
                                    })}
                                    <span>
                                        <h2 className="text-sm">({data?.serviceRating})</h2>
                                    </span>
                                </div>
                                <p className="text-sm">{data?.description}</p>
                            </div>
                        </div>

                        {/* Line Break */}
                        <hr className="my-6" />

                        <div className="flex flex-col md:flex-row items-start">
                            <div className="md:w-1/2">
                                <h4>Role : {data?.userID?.roleID?.name}</h4>
                            </div>
                            <div className="md:w-1/2">
                                <h4>Date : {formatDate(data &&  data.createdAt)}</h4>
                                <h4>Time : {new Date(data &&  data.createdAt).toLocaleTimeString()}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 pt-6 flex justify-end gap-4">
                        <button
                            onClick={closeDetails}
                            className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackDetails;
