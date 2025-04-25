import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../commons/confirmAlert";
import Toast from "../../commons/Toastify";
import CategoryAlert from "./categoryAlert";
import axios from "axios";


const ProductVendor = ({ user }) => {
    const { slug } = useParams();
    let [searchTerm, setSearchTerm] = useState(slug || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(15); // Number of products per page
    const [filterStatus, setFilterStatus] = useState(slug ? slug : '');
    const [vendorID, setVendorID] = useState(user?._id || '');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();



    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                size: itemsPerPage,
                searchString: searchTerm,
            }).toString();

            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/vendor/${vendorID}?${queryParams}`);
            const serRes = await response.json();

            // console.log('API Response:', serRes.locale.data); // Log the response

            if (response.ok) {
                const data = serRes.locale.data.reverse();
                setProducts(data || []);
                setTotalPages(serRes.locale.pagination ? serRes.locale.pagination.totalPages : 1);
            } else {
                setError(serRes.message || "Failed to fetch products");
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [vendorID, currentPage, searchTerm]);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Delay the scroll action slightly
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0); // You can adjust the delay if necessary
    };


    const handleDeleteProduct = (id) => {
        setProductToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (productToDelete === null) return; // No product to delete

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/deletebyid/${productToDelete}/${vendorID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setIsConfirmOpen(false);
            setProductToDelete(null);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const SerRes = await response.json();

            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Product deleted successfully!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 seconds

            fetchProducts();

        } catch (error) {
            console.error('Delete failed:', error);

            // Show the error toast
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: error.message || 'An error occurred. Please try again.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 seconds
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmOpen(false);
        setProductToDelete(null);
    };


    const productView = (id) => {
        if (id) {
            navigate(`/vendor/products/details/${id}`);
        }
    };

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page on search
    };


    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setSearchTerm(status);
        setCurrentPage(1); // Reset to the first page on filter change
    };



    const getToken = () => localStorage.getItem('token');

    const productActivate = async (id, isActive) => {
        const isConfirmed = window.confirm(
            `Are you sure you want to ${isActive ? 'Deactivate' : 'Activate'} this product?`
        );

        if (isConfirmed) {
            try {
                const token = getToken();
                const newApprovalStatus = !isActive;

                // Optimistically update UI
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product._id === id ? { ...product, isActive: newApprovalStatus } : product
                    )
                );

                const response = await axios.put(
                    `${process.env.REACT_APP_API_URL_PRO}/activate/${id}`,
                    { isActive: newApprovalStatus },
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
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product._id === id ? { ...product, isActive: !isActive } : product
                    )
                );
            }
        }
    };

    const openForm = () => {
        if (user && user.aboutID) {
            setIsCategoryOpen(true);
        } else {
            alert('please Update your About Us inside profile!');
            navigate('/vendor/profile');
        }
    };


    return (
        <>
            <div className="relative h-screen bg-gray-100 dark:bg-gray-900">
                <div className="sticky top-0 z-20 p-4 mb-5 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">

                    <div className="flex justify-between mb-4">
                        <h1 className="text-xl text-gray-800 dark:text-gray-100">Your Products</h1>
                        <div
                            className=" absolute right-3"
                            onClick={openForm}
                        >
                            <button className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                <FaPlus className="mr-2" /> Add New Product
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 relative mt-5">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange} // Update search term on change
                            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black 
            outline-none transition focus:border-success dark:border-form-strokedark 
            dark:bg-form-input dark:text-white dark:focus:border-success`}
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 
        dark:text-gray-400" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 relative">
                        <button
                            onClick={() => handleFilterChange('')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === '' ? 'text-blue-500 hover:underline dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            All Products
                        </button>
                        <button
                            onClick={() => handleFilterChange('active')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === 'active' ? 'text-blue-500 hover:underline dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => handleFilterChange('not active')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === 'not active' ? 'text-blue-500 hover:underline dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            Not-Active
                        </button>
                        <button
                            onClick={() => handleFilterChange('approved')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === 'approved' ? 'text-blue-500 hover:underline dark:dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => handleFilterChange('not approved')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === 'not approved' ? 'text-blue-500 hover:underline dark:dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            Not-Approved
                        </button>
                    </div>
                </div>

                {/* Table view */}
                <div className="rounded-lg shadow-lg hidden md:block bg-white dark:bg-boxdark dark:text-bodydark dark:shadow-none">
                    <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                <tr>
                                    <th className="w-16 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">S.No</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-gray-600 dark:text-gray-300  text-center">Title</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Image</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Price</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Qty/Qlt/booking</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Category</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Approved</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Active</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700  text-center">
                                {products.map((item, index) => (
                                    <tr key={item._id}
                                        className="hover:bg-gray dark:hover:bg-body cursor-pointer"
                                    >
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            {(currentPage - 1) * itemsPerPage + index + 1}.
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            {item.title}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            {item.images ? (
                                                <img src={item.images} alt={item.title} className="w-16 h-10 object-cover rounded" />
                                            ) : (
                                                <span className="text-gray-500">No Image</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            ₹{item.price}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            {!item.quantity && item.quantity !== 0 ? '-' : item.quantity}

                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            {item.categoryID && item.categoryID.name ? item.categoryID.name : 'N/A'}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${item.isApproved ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-600' : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-600'} rounded-lg`}>
                                                {item.isApproved ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                            onClick={productView.bind(this, item._id)}
                                        >
                                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${item.isActive ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-600' : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-600'} rounded-lg`}>
                                                {item.isActive ? 'Active' : 'Deactive'}
                                            </span>
                                        </td>

                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            <a className={`${item.isActive ? 'text-red-500 hover:underline dark:text-red-400' : 'text-success hover:underline dark:text-success'} `}
                                                onClick={productActivate.bind(this, item._id, item.isActive)}
                                            >
                                                {item.isActive ? 'Deactivate' : 'Activate'}
                                            </a> |
                                            <Link to={`/add-new-products/${item._id}`} className="text-blue-500 hover:underline dark:text-blue-400"
                                            >
                                                Edit
                                            </Link> |
                                            <a className="text-red-500 hover:underline dark:text-red-400"
                                                onClick={() => handleDeleteProduct(item._id)}>
                                                Delete
                                            </a> |
                                            <Link to={`/vendor/products/details/${item._id}`} className="text-success hover:underline dark:text-success"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile view */}
                <div className="block md:hidden max-h-[500px] overflow-y-auto">
                    {products.map((item, index) => (
                        <div key={item._id} className="bg-white dark:bg-boxdark rounded-lg shadow-md mb-4 p-4 dark:bg-gray-800 dark:text-gray-200">
                            <div className="mb-2"
                                onClick={productView.bind(this, item._id)}
                            >
                                {item.images ? (
                                    <img src={item.images} alt={item.title} className="w-full h-full object-cover rounded" />
                                ) : (
                                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">No Image</div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mb-2"

                            >
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"

                            >
                                Price: ₹{item.price}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"

                            >
                                Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"

                            >
                                Category: {item.categoryID && item.categoryID.name ? item.categoryID.name : 'N/A'}
                            </p>
                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider  ${item.isApproved ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-600' : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-600'} rounded-lg`}

                            >
                                {item.isApproved ? 'Approved' : 'Not-Approved'}
                            </span>
                            <div className="flex justify-end">
                                <a className={`${item.isActive ? 'text-red-500 hover:underline dark:text-red-400' : 'text-success hover:underline dark:text-success'} `}
                                >
                                    {item.isActive ? 'Deactive' : 'Active'}
                                </a>
                                <Link to={`/add-new-products/${item._id}`} className="text-blue-500 hover:underline dark:text-blue-400"
                                >
                                    Edit
                                </Link> |
                                <a href="#" className="text-red-500 hover:underline dark:text-red-400"
                                    onClick={() => handleDeleteProduct(item._id)}>
                                    Delete
                                </a> |
                                <Link to={`/vendor/products/details/${item._id}`} className="text-success hover:underline dark:text-success"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination section */}
                <div className={`flex items-center justify-center mt-4`}>
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

                {/* Category Alert */}
                {isCategoryOpen && (
                    <CategoryAlert
                        user={user}
                        onCancel={() => setIsCategoryOpen(false)}
                    />
                )}

                {/* {/* Confirm Alert */}
                {isConfirmOpen && (
                    <ConfirmAlert
                        message="Are you sure you want to delete this product?"
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
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

export default ProductVendor;
