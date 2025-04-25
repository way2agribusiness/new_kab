import React, { useEffect, useState } from "react";
import { BiSolidPhoneCall } from "react-icons/bi";
import Spinner from "../product/loading";
import VendorEnquiry from "../home/vendorEnquiry";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../../commons/Toastify";
import { Link1SEO } from "./SEO";



const LinkProducts1 = ({ user }) => {
    const { slug } = useParams();  // Get all params: slug, subslug, subsubslug
    const formattedSlug = slug.replace(/(?<!^)(?=[A-Z])/g, " ");

    const [searchTerm, setSearchTerm] = useState(slug || '');
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


    useEffect(() => {
        if (slug) {
            setSearchTerm(slug);
        }
    }, [slug])

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
            }).toString();

            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/products?${queryParams}`);
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
        <>
            <Link1SEO slug={slug} />
            {slug && slug === 'AgriInput' ? (
                <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                    <div className="p-5">
                        <p className="mb-3 text-justify">
                            Karnataka Agribusiness is a dedicated platform connecting farmers with trusted agritech product
                            manufacturers, suppliers, and vendors offering high-quality solutions for profitable and sustainable farming.
                            Vendors registered on our platform provide a wide range of agricultural inputs, including high-yield hybrid seeds,
                            organic bio-fertilizers, and advanced irrigation systems such as water pumps, sprinklers, and drip irrigation.
                            Their fertilizers—spanning bio, organic, and inorganic options—enhance soil health and optimize nutrient management for improved crop growth.
                            To protect crops from pests, they supply effective insecticides in both organic and inorganic forms.
                        </p>
                        <p className="text-justify">
                            The vendors on Karnataka Agribusiness also offer an extensive selection of
                            farm machinery and equipment, including power tillers, brush cutters, and
                            sprayers from renowned brands, with warranty and service support to enhance
                            efficiency and reduce labor costs. Additionally, they provide primary processing
                            equipment to streamline post-harvest operations and reliable power solutions,
                            such as generators, to ensure uninterrupted farm activities, especially in
                            remote areas. At Karnataka Agribusiness, our mission is to facilitate access to
                            farm machineries, and technology, empowering farmers to boost productivity,
                            embrace sustainable practices, and achieve long-term profitability.
                            From cultivation to harvesting, our platform connects farmers with the
                            right suppliers to support them at every stage, fostering a thriving and
                            efficient agricultural ecosystem.
                        </p>
                    </div>
                </div>
            )
                : slug === 'AgriOutput' ? (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                Karnataka Agribusiness is a one-stop platform connecting farmers,
                                Farmer Producer Organizations (FPOs), APMC traders, and suppliers
                                with consumers, retail shops, and the HORECA sector. Our platform
                                provides quick access to high-quality agricultural produce, offering
                                a wide selection of fresh fruits, vegetables, grains, and consumables
                                sourced directly from farms. By purchasing through Karnataka Agribusiness,
                                consumers enjoy fresher, more affordable options while supporting the local
                                economy. With direct access to farmers, the platform ensures fair pricing
                                for all stakeholders and serves as a reliable source for essential
                                commodities such as pulses, grains, and locally produced spices.
                            </p>
                            <p className="text-justify">
                                Buying locally means better taste, fresher produce, and a more sustainable choice,
                                as products are harvested at peak freshness and delivered promptly. Our user-friendly
                                platform allows buyers to submit requirements, connect with suppliers, compare prices,
                                and complete transactions with ease. Whether in Bengaluru or smaller towns,
                                Karnataka Agribusiness makes farm-fresh produce easily accessible, promoting a
                                healthier lifestyle while directly benefiting farmers. Experience the freshness
                                and convenience of locally sourced food with Karnataka Agribusiness right now!
                            </p>
                        </div>
                    </div>
                )
                    : (
                        <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                            <div className="p-5">
                                <p className="mb-3 text-justify">
                                    Karnataka Agribusiness offers a comprehensive range of services by connecting agri service providers
                                    with farmers, aiming to enhance farming practices. Our registered service providers offer
                                    both on-farm and off-farm solutions to support informed decision-making for profitable and
                                    sustainable agriculture. These services include farm visits, crop planning, crop management,
                                    identification of agritech products, and promotion of technology based agriculture as well
                                    as off-farm services such as project support, subsidy assistance, and bank funding guidance.

                                </p>
                                <p className="text-justify">
                                    Agri service providers listed under Karnataka Agribusiness also help farmers’
                                    access profitable markets, improving supply chain efficiency. From optimizing yield
                                    to increasing profitability, they support farmers at every stage. Additionally, some
                                    providers offer labor supply management, primary processing solutions, and guidance
                                    on government programs. To ensure good yields and sustainable farming, they provide
                                    crop-planning services tailored to market demand, weather conditions, and soil health.
                                    With the help of our crop selection guide, farmers can make informed choices based on
                                    land suitability and market trends. Our platform prioritizes environmentally friendly,
                                    sustainable farming methods while ensuring long-term financial success for both farmers
                                    and service providers.
                                </p>
                            </div>
                        </div>
                    )}

            <div className="lg:mx-50 my-5 bg-white dark:bg-boxdark-2 shadow-md dark:shadow-none">
                <div className="bg-success text-white">
                    <h4 className="text-center p-2 font-bold">{slug && formattedSlug}</h4>
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

                    <span className={`mx-4`}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0} // Disable if on the last page
                        className={`px-4 py-2 border rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
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
        </>
    );
};

export default LinkProducts1;
