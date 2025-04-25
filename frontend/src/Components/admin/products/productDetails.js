import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaRegStar, FaStarHalfAlt, FaStar } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApproved, setIsApproved] = useState(null); // Initialize with null
    const [selectedCategory, setSelectedCategory] = useState('');
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [ratingsError, setRatingsError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/getpid/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setItem(data);
                    setIsApproved(data.isApproved); // Set isApproved based on fetched data
                    setSelectedCategory(data.categoryID.name);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Error fetching product');
                }
            } catch (error) {
                setError('Fetch error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };


        const fetchRatings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/ratings/getbyId/${id}`);
                if (response.ok) {
                    const { ratings, averageRating, totalRatings } = await response.json();
                    setRatings(ratings);
                    setAverageRating(averageRating);
                    setTotalRatings(totalRatings);
                    // console.log('ratings :', ratings,
                    //     'averageRating :', averageRating,
                    //     'totalRatings :', totalRatings);
                } else {
                    setRatingsError('Error fetching ratings');
                }
            } catch (error) {
                setRatingsError('Fetch error: ' + error.message);
            }
        };

        if (id) {
            fetchProduct();
            fetchRatings();
        }
    }, [id]);

    const getToken = () => localStorage.getItem('token');

    const productApproval = async () => {
        const isConfirmed = window.confirm(
            `Are you sure you want to ${isApproved ? 'disapprove' : 'approve'} this product?`
        );

        if (isConfirmed) {
            try {
                const token = getToken();
                const newApprovalStatus = !isApproved;

                // Optimistically update UI
                setIsApproved(newApprovalStatus);

                const response = await axios.patch(
                    `${process.env.REACT_APP_API_URL_PRO}/approval/${item._id}`,
                    { isApproved: newApprovalStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Product approval updated successfully:', response.data);
            } catch (error) {
                console.error('Error updating product approval:', error);
                // Revert the optimistic UI update if the request fails
                setIsApproved(prev => !prev);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!item) return <p>No product found</p>;


    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <FaStar key={`full-${index}`} className="text-yellow-500" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
                ))}
            </>
        );
    };

    return (
        <>
            <div className="bg-gray-50 text-gray-800">
                <div className="container mx-auto p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <img
                                src={item.images || 'default-image-url'} // Handle missing images
                                alt="Product Image"
                                className="text-center w-full h-80 bg-white shadow-md"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <h1 className="text-xl font-bold text-blue-800">
                                <span className='text-xl text-gray-600'>Title: </span>
                                {item.title || 'N/A'}
                            </h1>

                            <div className="flex space-x-2 text-[10px] lg:text-[12px]">
                                <p className="w-1/2 bg-green-200 rounded-sm text-center text-black whitespace-nowrap">{item.subcategoryID?.name}</p>
                                <p className="w-1/2 bg-green-200 rounded-sm text-center text-black whitespace-nowrap">{item.subsubcategoryID?.name}</p>
                                <p className="w-1/2 bg-green-200 rounded-sm text-center text-black whitespace-nowrap">{item.subsescategoryID?.name}</p>
                            </div>

                            <div>
                                {ratingsError ? (
                                    <p className="text-red-500">{ratingsError}</p>
                                ) : totalRatings > 0 ? (
                                    <div className="flex items-center">
                                        <span className="flex items-center">
                                            {renderStars(averageRating)}
                                        </span>
                                        <p className="ml-2">
                                            {averageRating} ({totalRatings} {totalRatings > 1 ? 'reviews' : 'review'})
                                        </p>
                                    </div>
                                ) : (
                                    <p>No reviews</p>
                                )}
                            </div>

                            <p className="text-sm text-gray-700">
                                <span className='text-xl text-gray-600 text-blue-600'>Description: </span>
                                {item.description || 'N/A'}
                            </p>

                            <div className="flex items-center space-x-4">
                                <span className="text-xl font-semibold text-green-600">₹{item.price} &nbsp;
                                    {item.cutprice ? (
                                        <span className='line-through text-slate-400 text-[15px]'>₹{item.cutprice}</span>
                                    ) : ''}
                                </span>

                                <span className="text-sm text-green-500">
                                    {item.instock === 0 || item.instock === null ? 'Out of Stock' : `In stock ${item.instock}`}
                                </span>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-boxdark dark:text-bodydark">
                                <h2 className="text-xl font-semibold text-gray-800">Specifications</h2>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    {item.specifications?.map((spec, index) => (
                                        <li key={index}>
                                            <strong className="text-blue-600">{spec.title}:</strong> {spec.desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-lg mt-4 dark:bg-boxdark dark:text-bodydark">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {selectedCategory === "AgriServices" ? 'Service Area' : 'Warranty'}: <span className='text-sm text-orange-400'>{item.warranty || 'N/A'}</span>
                                </h2>
                            </div>

                            <div className="relative flex items-center space-x-4 mt-4 bg-white p-4 rounded-lg shadow-lg dark:bg-boxdark dark:text-bodydark">
                                <h4 className='text-xl font-semibold'>Product Approved :</h4>
                                <div className="relative flex items-center">
                                    <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${isApproved ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-600' : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-600'} rounded-lg`}>
                                        {isApproved ? "Approved" : "Not Approved"}
                                    </span>
                                </div>
                                <span
                                    className="absolute top-0 right-0 text-xs text-blue-500 cursor-pointer hover:underline"
                                    title="Click to toggle product approval"
                                    onClick={productApproval}
                                >
                                    Click Approval
                                </span>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-lg mt-4 dark:bg-boxdark dark:text-bodydark">
                                <h2 className="text-xl font-semibold text-gray-800">Vendor Details</h2>
                                <p><strong className="text-blue-600">Name:</strong> {item.vendorID?.username}</p>
                                <p><strong className="text-blue-600">Email:</strong> {item.vendorID?.email}</p>
                                <p><strong className="text-blue-600">Phone:</strong> {item.vendorID?.phone}</p>
                                <p><strong className="text-blue-600">GST Number:</strong> {item.vendorID?.gstNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white p-4 rounded-lg shadow-lg mt-6 dark:bg-boxdark dark:text-bodydark">
                        <h2 className="text-xl font-semibold text-gray-800">Location</h2>
                        <p><strong className="text-blue-600">Country:</strong> {item.country}</p>
                        <p><strong className="text-blue-600">State:</strong> {item.state}</p>
                        <p><strong className="text-blue-600">City:</strong> {item.city}</p>
                        <p><strong className="text-blue-600">Nearby:</strong> {item.nearby}</p>
                        <p><strong className="text-blue-600">Postal Code:</strong> {item.postal_code}</p>
                    </div>
                </div>
            </div>

            {/* Display All Reviews */}
            {ratings.length > 0 ? (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Customer Reviews:</h3>
                    {ratings.map((review) => (
                        <div
                            key={review._id}
                            className="border-b border-gray-300 py-2 mb-2"
                        >
                            <div className="flex items-center mb-1">
                                <p className="text-sm text-gray-600">
                                    {review.userID?.username}
                                </p>
                                <span className="ml-2  flex items-center">
                                    {renderStars(review.rating)}
                                    <span className="ml-2">({review.rating})</span>
                                </span>
                            </div>
                            <p className="text-gray-800">{review.description}</p>
                        </div>
                    ))}
                </div>
            ) :
                (
                    <p className="text-gray-500">No reviews yet for this product.</p>
                )}
        </>
    );
};

export default ProductDetails;
