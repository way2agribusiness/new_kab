import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";


const ProductAdmin = ({ user }) => {
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

            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/getall?${queryParams}`);
            const serRes = await response.json();

            // console.log('API Response:', serRes.locale.data); // Log the response

            if (response.ok) {
                const data = serRes.locale.data.reverse();
                setProducts(data || []);
                setTotalPages(serRes.locale.pagination ? serRes.locale.pagination.totalPages : 1);
                // console.log('data-** :', data)
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


    const productView = (id) => {
        if (id) {
            navigate(`/admin/products/details/${id}`);
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


    return (
        <>
            <div className="relative h-screen bg-gray-100 dark:bg-gray-900">
                <div className="sticky top-0 z-20 p-4 mb-5 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
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

                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => handleFilterChange('')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === '' ? 'text-blue-500 hover:underline dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            All Products
                        </button>
                        <button
                            onClick={() => handleFilterChange('approved')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === 'approved' ? 'text-blue-500 hover:underline dark:dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            Approved Products
                        </button>
                        <button
                            onClick={() => handleFilterChange('not approved')}
                            className={`px-4 py-2 mx-2 text-sm font-medium rounded-lg ${filterStatus === 'not approved' ? 'text-blue-500 hover:underline dark:dark:text-blue-500' : 'bg-gray-400'}`}
                        >
                            Not Approved Products
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
                                    <th className="p-3 text-sm font-semibold tracking-wide text-center text-gray-600 dark:text-gray-300">Title</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Image</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Price</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Qty/Qlt/booking</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Category</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Approved</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">CreatedAt</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">UpdatedAt</th>
                                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left text-gray-600 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700  text-center">
                                {products.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray dark:hover:bg-body cursor-pointer"
                                        onClick={productView.bind(this, item._id)}>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{item.title}</td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                            {item.images ? (
                                                <img src={item.images} alt={item.title} className="w-16 h-10 object-cover rounded" />
                                            ) : (
                                                <span className="text-gray-500">No Image</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            ₹{item.price}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {!item.quantity && item.quantity !== 0 ? '-' : item.quantity}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            <span className="p-1.5 text-xs font-semibold rounded-lg bg-green-200 text-green-800">
                                                {item.categoryID && item.categoryID.name ? item.categoryID.name : 'N/A'} {/* Adjusted if `categoryID` is an object */}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            <span className={`p-1.5 text-xs font-semibold rounded-lg ${item.isApproved ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                {item.isApproved ? 'Approved' : 'Not Approved'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{new Date(item.updatedAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            <Link to={`/admin/products/details/${item._id}`}
                                                className="text-success hover:underline dark:text-success">
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
                <div className="block md:hidden">
                    {products.map((item, index) => (
                        <div key={item._id} className="bg-white dark:bg-boxdark rounded-lg shadow-md mb-4 p-4 dark:bg-gray-800 dark:text-gray-200">
                            <div className="mb-2">
                                {item.images ? (
                                    <img src={item.images} alt={item.title} className="w-full h-full object-cover rounded" />
                                ) : (
                                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">No Image</div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                            </div>
                            {/* <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.description}</p> */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Price: ₹{item.price}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Category: {item.categoryID && item.categoryID.name ? item.categoryID.name : 'N/A'}</p>
                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${item.isApproved ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-600' : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-600'} rounded-lg`}>
                                {item.isApproved ? 'Approved' : 'Not-Approved'}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 mt-2">createdAt : {new Date(item.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">updatedAt : {new Date(item.updatedAt).toLocaleDateString()}</p>
                            <div className="flex justify-end">
                                <Link to={`/admin/products/details/${item._id}`}
                                    className="text-success hover:underline dark:text-success">
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
            </div>
        </>
    );
};

export default ProductAdmin;
