import React, { useEffect, useState } from "react";
import { BiSolidPhoneCall } from "react-icons/bi";
import Spinner from "../product/loading";
import VendorEnquiry from "../home/vendorEnquiry";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../../commons/Toastify";
import { Helmet } from 'react-helmet';



const SearchLink = ({ user }) => {
    const {productname, city} = useParams('');
    const [isCity, setIsCity] = useState(city && city === 'ALL' ? null : city);
    const originalProductName = productname.replace(/-/g, " ");

    const [searchTerm, setSearchTerm] = useState(originalProductName || '');
    const [searchCity, setSearchCity] = useState(isCity || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(12); // Number of products per page
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isVendorEnquiryOpen, setIsVendorEnquiryOpen] = useState(false);
    const [vendorID, setVendorID] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [productName, setProductName] = useState('');

    const [viewPhone, setViewPhone] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();
    

    useEffect(()=>{
        if(originalProductName){
            setSearchTerm(originalProductName);
        }

        if(city){
            setSearchCity(city);
        }
    },[originalProductName, city])
   
    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                size: itemsPerPage,
                searchString: searchTerm,
                city: searchCity
            }).toString();

            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/search?${queryParams}`);
            const serRes = await response.json();

            if (response.ok) {
                setProducts(serRes.data || []);
                setTotalPages(serRes.pagination ? serRes.pagination.totalPages : 1);

            } else {
                setError(serRes.message || "Failed to fetch products");
            }

        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />; // Show spinner while loading
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Delay the scroll action slightly
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0); // You can adjust the delay if necessary
    };

    // Function to get the token from local storage
    const getToken = () => localStorage.getItem('token');

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
                navigate('/login');
            }, 1000);
            return;
        }
        setViewPhone(prevId => prevId === productId ? null : productId);
    };

    const sendEnquiry = (vendorID, categoryID, title) => {
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
        setProductName(title);
    };


    const handleClick = (productId) => {
        localStorage.setItem('productId', productId);
    };


    return (
        <div className="lg:mx-50 my-5 bg-white dark:bg-boxdark-2 shadow-md dark:shadow-none">
            <div className="bg-success text-white">
                <h4 className="text-center p-2 font-bold">{originalProductName && originalProductName} ({city && city})</h4>
            </div>
            {/* Product List */}
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 mx-auto gap-4 p-5">
                {products.map((item, i) => (
                    <div key={i + 1} className="bg-white dark:bg-boxdark shadow-lg rounded-lg flex flex-col p-1 lg:w-50 text-sm cursor-pointer">
                        <Link to={`/view/${item.title.replace(/\s+/g, '-')}`} className="block flex-grow"
                            onClick={handleClick.bind(this, item._id)}
                        >
                            <div className="text-center">
                                <div className="overflow-hidden">
                                    <img
                                        src={item.images}
                                        alt="Product"
                                        className="mx-auto mb-2 transform hover:scale-125 transition-transform duration-300"
                                        style={{ width: '60%', height: '100px' }}
                                    />
                                </div>
                                <h3 className="font-semibold mb-1">{item.title}</h3>
                                <p className="mb-1">{item.brand}</p>
                                <p className="font-bold mb-2">₹{item.price}
                                    {item.quantity ? '/' : ''}
                                    <span className="text-success ms-1">
                                        {item.quantity && item.quantity}
                                    </span>
                                    {item.instock !== undefined && item.instock !== null && item?.categoryID?.name !== 'AgriOutput' &&
                                        item?.categoryID?.name !== 'AgriServices' ? (
                                        <span>
                                            <span className="mx-1 text-xl font-bold">{item.instock ? '-' : ''}</span>
                                            <span className={`${typeof item.instock === 'number' && item.instock > 0 ? 'text-success' : 'text-danger'}`}>
                                                {typeof item.instock === 'number' && item.instock > 0 ? 'In Stock' : 'Out of Stock'} {item.instock ? item.instock : ''}
                                            </span>
                                        </span>
                                    ) : null}
                                </p>
                                <p className="line-through text-danger">
                                    {item.cutprice ? `₹${item.cutprice}` : ''}
                                </p>
                            </div>
                        </Link>
                        <div className="text-center mt-2">
                            <button
                                className="flex items-center font-bold lg:px-8 px-5 py-1 rounded text-amber-500 hover:text-blue-500"
                                onClick={() => viewNumber(item._id)}
                            >
                                <BiSolidPhoneCall className="mr-2" />
                                <span>
                                    {viewPhone === item._id ? item.phone : "View Number"}
                                </span>
                            </button>

                            <button
                                className="bg-green-500 text-white px-4 py-2 font-bold w-full rounded hover:bg-green-600 transition mt-2"
                                onClick={() => sendEnquiry(item.vendorID, item.categoryID, item.title)}
                            >
                                Get Best Price
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* Pagination section */}
            <div className={`flex items-center justify-center pb-5`}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1} // Disable if on the first page
                    className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
                >
                    Previous
                </button>

                <span className="mx-4">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages} // Disable if on the last page
                    className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
                >
                    Next
                </button>
            </div>


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


            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}
        </div>
    );
};

export default SearchLink;
