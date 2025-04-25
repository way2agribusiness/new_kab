import React, { useEffect, useState } from "react";
import { BiSolidPhoneCall } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Toast from "../../commons/Toastify";
import VendorEnquiry from "../home/vendorEnquiry";
import { FaRegStar, FaStarHalfAlt, FaStar } from 'react-icons/fa';
import Reviews from "./reviews";
import { Helmet } from "react-helmet";

const ProductDetails = ({ user }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [viewPhone, setViewPhone] = useState(null);
    const [isVendorEnquiryOpen, setIsVendorEnquiryOpen] = useState(false);
    const [vendorID, setVendorID] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [productName, setProductName] = useState('');

    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [ratingsError, setRatingsError] = useState(null);

    const [isFormOpen, setFormOpen] = useState(false);
    const [aboutID, setAboutID] = useState('');
    const [aboutData, setAboutData] = useState(null);

    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();

    const id = localStorage.getItem('productId');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null); // Reset error state before fetching

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/getpid/${id}`);

                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setAboutID(data.vendorID.aboutID);
                } else {
                    // Handle HTTP errors
                    const errorData = await response.json();
                    if (response.status === 404) {
                        setError('Product not found');
                    } else if (response.status === 500) {
                        setError('Server error: Please try again later');
                    } else {
                        setError(errorData.message || 'An error occurred');
                    }
                }
            } catch (error) {
                // Handle network errors or other exceptions
                setError('Network error: ' + error.message);
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
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${process.env.REACT_APP_API_URL}/about/get/${aboutID}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setAboutData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (aboutID) {
            fetchData();
        }
    }, [aboutID]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!product) {
        return <p>No product data available.</p>;
    }


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


    // Function to get the token from local storage
    const getToken = () => localStorage.getItem('token');

    const sendEnquiry = (vendorID, categoryID, productname) => {
        const token = getToken();

        if (!token) {
            // Show the success toast
            setToast({
                show: true,
                type: 'info',
                title: 'info',
                message: 'Please Login First!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                navigate('/login');
            }, 1000);
            return;
        }

        setIsVendorEnquiryOpen(true);
        setVendorID(vendorID);
        setCategoryID(categoryID);
        setProductName(productname);
    };


    const viewNumber = (productId) => {
        const token = getToken();

        if (!token) {
            // Show the success toast
            setToast({
                show: true,
                type: 'info',
                title: 'info',
                message: 'Please Login First!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                setToast({ show: false });
                navigate('/login');
            }, 1000);
            return;
        }
        setViewPhone(prevId => prevId === productId ? null : productId);
    };


    // Function to open Form
    const openForm = () => {
        if (!user) {
            // Show the success toast
            setToast({
                show: true,
                type: 'info',
                title: 'info',
                message: 'Please Login First!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                setToast({ show: false });
                navigate('/login');
            }, 1000);
            return;
        }
        setFormOpen(true);
    };

    // Function to close Form
    const closeForm = () => {
        setFormOpen(false);
    };


    return (
        <>
            <Helmet>
                <title>{product && product.title}</title>
                <meta
                    name="description"
                    content={`Explore the best deals on ${product ? product.title : 'agricultural products'} in Karnataka. Discover opportunities in organic farming, agri-tech, and sustainable agriculture.`}
                />
                <meta
                    name="keywords"
                    content={`${product ? product.title : 'Agricultural products'}, Agribusiness Karnataka, Organic farming, Sustainable agriculture`}
                />
            </Helmet>


            <div className="bg-gray-100 mb-5 bg-white shadow-lg mt-5 dark:bg-boxdark">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/2 px-4 mb-8 overflow-hidden flex justify-center">
                            <div className="bg-white w-full h-100 shadow-md flex justify-center dark:shadow-none">
                                <img
                                    src={product && product.images}
                                    alt="Product"
                                    className="mb-4"
                                    id="mainImage"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-1/2 px-4">
                            <h2 className="text-xl font-bold mb-2">{product && product.title}</h2>
                            <div className="mb-4">
                                <span className="text-2xl font-bold mr-2">₹{product && product.price}</span>
                                <span className="text-gray-500 line-through text-danger">{product && product.cutprice ? `₹${product.cutprice}` : ''}</span>
                            </div>


                            <div className="flex items-center space-x-4">
                                {ratingsError ? (
                                    <p className="text-red-500">{ratingsError}</p>
                                ) : totalRatings > 0 ? (
                                    <div className="flex items-center">
                                        <span className="flex items-center">
                                            {renderStars(averageRating)}
                                        </span>
                                        <a
                                            href="#rating"
                                            className="ml-2 hover:text-success"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent default anchor behavior
                                                const ratingSection = document.getElementById('rating');
                                                if (ratingSection) {
                                                    ratingSection.scrollIntoView({
                                                        behavior: 'smooth',  // Smooth scrolling
                                                        block: 'start',      // Aligns the section to the start (top) of the viewport
                                                        inline: 'nearest'    // Ensures the horizontal alignment (optional)
                                                    });
                                                }
                                            }}
                                        >
                                            {averageRating} ({totalRatings} {totalRatings > 1 ? 'reviews' : 'review'})
                                        </a>
                                    </div>
                                ) : (
                                    <p className=" text-amber-500 font-semibold mb-2">No reviews</p>
                                )}
                                <span>
                                    <button
                                        onClick={openForm}
                                        className="bg-green-600 hover:bg-green-700 text-sm p-2 w-42 text-white font-semibold rounded-md mb-2"
                                    >
                                        Rate Product
                                    </button>
                                </span>
                            </div>

                            <p className="text-gray-700 mb-6">
                                {product && product.description}
                            </p>
                            <div className="flex space-x-4 mb-6">
                                <button
                                    className="bg-green-600 flex gap-2 items-center text-white px-6 py-2 font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    onClick={() => sendEnquiry(product && product.vendorID._id, product && product.categoryID._id, product.title)}
                                >
                                    Get Best Price
                                </button>
                                <button
                                    className="flex items-center font-bold lg:px-8 px-5 py-1 rounded text-amber-500 hover:text-blue-500"
                                    onClick={() => viewNumber(product && product._id)}
                                >
                                    <BiSolidPhoneCall className="mr-2" />
                                    <span>
                                        {viewPhone === product._id ? product.vendorID.phone : "View Number"}
                                    </span>
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Specifications:</h3>
                                {product && product.specifications.map((item, i) => (
                                    <ul key={item._id} className="list-disc list-inside space-y-2 text-gray-600">
                                        <li className="flex justify-between items-center border-b border-gray-200 py-2">
                                            <span className="font-medium">{item.title}</span>
                                            <span className="text-gray-900">{item.desc}</span>
                                        </li>
                                    </ul>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                    <h1 className="text-2xl font-bold text-gray-800 text-center text-success">{product && product.brandID.name}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 text-left">
                            {aboutData ? (
                                <div className="">
                                    <div className="mt-2">
                                        <h2 className="text-xl font-semibold mb-2 text-gray-700">About the Seller</h2>
                                        <p>{aboutData.description}</p>

                                        {/* Keywords */}
                                        <div className="flex flex-wrap gap-2 text-black text-sm mt-2">
                                            {aboutData.keys.map((keyObj, index) => (
                                                <span
                                                    key={keyObj._id || index} // Use _id if available for a unique key
                                                    className="bg-green-200 px-5 rounded-md"
                                                >
                                                    {keyObj.keywords} {/* Display the keywords */}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 text-gray-700">About the Seller</h2>
                                    <p className="text-gray-600">
                                        We are a leading provider of cutting-edge technology solutions in AgriInput,
                                        delivering unparalleled innovation and customer service. Our mission is to
                                        empower businesses worldwide in the agriculture sector.
                                    </p>
                                </div>
                            )}

                            <p className="mt-5">{product && product.vendorID.email}</p>
                            <button
                                className="flex items-center font-bold  text-amber-500 hover:text-blue-500"
                                onClick={() => viewNumber(product && product._id)}
                            >
                                <BiSolidPhoneCall className="mr-2" />
                                <span>
                                    {viewPhone === product._id ? product.vendorID.phone : "View Number"}
                                </span>
                            </button>
                        </div>
                        <div className="p-4 md:text-right">
                            <h2 className="text-xl font-semibold mb-2 text-gray-700">Address</h2>
                            <p className="text-gray-600">
                                {product && product.nearby}, {product && product.city}<br />
                                {product && product.state},&nbsp;
                                {product && product.country} &nbsp;
                                ({product && product.postal_code})<br />
                                GST : {product && product.vendorID.gstNumber}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Display All Reviews */}
            {ratings.length > 0 ? (
                <div className="mx-5 mb-10" id="rating" style={{ paddingTop: '80px' }}>
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
                            <p className="text-gray-800 font-semibold">{review.description}</p>
                        </div>
                    ))}
                </div>
            ) :
                (
                    <p className="text-gray-500">No reviews yet for this product.</p>
                )}

            {/* Vendor Enquiry */}
            {isVendorEnquiryOpen && (
                <VendorEnquiry
                    onCancel={() => setIsVendorEnquiryOpen(false)}
                    onConfirm={() => setIsVendorEnquiryOpen(false)}
                    vendorID={vendorID}
                    categoryID={categoryID}
                    buyerID={user._id}
                    productName={productName}
                />
            )}


            {/* Conditionally render the Form */}
            {isFormOpen &&
                <Reviews
                    closeForm={closeForm}
                    userID={user._id}
                    productId={product._id}
                />
            }

            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}

        </>
    )
};
export default ProductDetails;