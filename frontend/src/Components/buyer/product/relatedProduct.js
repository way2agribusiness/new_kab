import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const RelatedProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4; // Reduce number of products to 4
    const [transitioning, setTransitioning] = useState(false);
    const [direction, setDirection] = useState('next'); // Track direction for transition

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_PRO}/approved/get`);
                const data = response.data.products;
                
                // Shuffle products randomly
                const shuffledProducts = shuffleArray(data);
                
                // Set products and the current page slice
                setProducts(shuffledProducts);
                setCurrentProducts(shuffledProducts.slice(0, itemsPerPage));
            } catch (err) {
                console.error('Error fetching Products:', err);
            }
        };
    
        fetchProducts();
    }, []);
    
    // Function to shuffle the array of products
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    

    const loadProducts = (direction) => {
        if (transitioning) return;

        setTransitioning(true);
        setTimeout(() => {
            if (direction === 'next') {
                if ((currentPage + 1) * itemsPerPage >= products.length) {
                    setTransitioning(false);
                    return;
                }
                const nextPage = currentPage + 1;
                const start = nextPage * itemsPerPage;
                const end = start + itemsPerPage;
                setCurrentProducts(products.slice(start, end));
                setCurrentPage(nextPage);
            } else if (direction === 'previous') {
                if (currentPage === 0) {
                    setTransitioning(false);
                    return;
                }
                const nextPage = currentPage - 1;
                const start = nextPage * itemsPerPage;
                const end = start + itemsPerPage;
                setCurrentProducts(products.slice(start, end));
                setCurrentPage(nextPage);
            }
            setDirection(direction);
            setTransitioning(false);
        }, 500); // Match the transition duration
    };

    const productContainerStyle = {
        display: 'flex',
        transition: 'transform 0.5s ease',
        transform: transitioning ? (direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)') : 'translateX(0)',
        width: 'calc(100% - 80px)', // Account for icon width and spacing
        margin: '0 auto',
    };

    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <div
                style={{
                    ...productContainerStyle,
                    marginLeft: '40px', // Space for the left icon
                    marginRight: '40px', // Space for the right icon
                }}
            >
                <div style={{ minWidth: '100%' }}>
                    <div className="grid grid-cols-4 gap-5">
                        {currentProducts.map(product => (
                            <div key={product._id} className="mt-4 me-2 hidden lg:block">
                                <div className="group flex items-center p-2 w-44 bg-white dark:bg-boxdark rounded-md cursor-pointer">
                                    <div className="overflow-hidden group-hover:scale-125 transition-transform duration-300">
                                        <img
                                            src={product.images}
                                            alt={product.title}
                                            className="h-10 w-10"
                                        />
                                    </div>
                                    <div className="ms-3 transition-transform duration-200 group-hover:scale-110">
                                        <p className="text-sm font-bold">{product.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-between', transform: 'translateY(-50%)' }}>
                {currentPage > 0 && (
                    <button
                        onClick={() => loadProducts('previous')}
                        style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <IoIosArrowBack size={24} className="text-slate-400 hover:text-success" />
                    </button>
                )}
                {currentPage * itemsPerPage < products.length && (
                    <button
                        onClick={() => loadProducts('next')}
                        style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <IoIosArrowForward size={24} className="text-slate-400 hover:text-success" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default RelatedProduct;
