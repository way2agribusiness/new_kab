import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('ALL');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate();

    useEffect(() => {
        // Function to fetch cities from the API
        const fetchCities = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/allcity`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data.success) {
                    setCities(data.cities);
                } else {
                    console.log(data.message || 'Failed to fetch cities');
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchCities();
    }, []);

    // Function to format product name for URL
    const formatProductName = (productName) =>
        productName.trim().replace(/\s+/g, "-"); // Replace spaces with '-'

    const handleSearch = (e) => {
        e.preventDefault();
        if (!selectedProduct.trim()) {
            setError('Please enter a product name before searching.');
        } else {
            setError(''); // Clear error if input is valid
            navigate(`/search/${formatProductName(selectedProduct)}/${selectedCity || "default-city"}`);
        }
    };

    return (
        <>
            <form
                className="flex justify-center mt-5 mb-5"
                onSubmit={handleSearch}
            >
                {/* Dropdown for Cities */}
                <div className="relative">
                    <select
                        className="inline-flex items-center px-1 md:px-8 py-2 bg-orange-500 text-white
                            rounded-l-md shadow-sm hover:bg-white hover:text-orange-500 focus:outline-none border"
                        onChange={(e) => setSelectedCity(e.target.value)}
                        value={selectedCity}
                    >
                        <option value="ALL">ALL</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Input Field */}
                <input
                    type="text"
                    id="text-input"
                    placeholder={error ? "Product name is required!" : `Search products in ${!selectedCity || selectedCity === "ALL" ? "your city" : selectedCity}...`}
                    className={`bg-white dark:bg-boxdark dark:text-bodydark1 shadow-md dark:shadow-none py-2 px-1 lg:px-12 lg:w-125 font-bold 
                        focus:outline-none sm:text-sm placeholder:text-[10px] lg:placeholder:text-[15px]
                        ${error ? "border border-red-500 placeholder-red-500" : ""}`}
                    value={selectedProduct}
                    onChange={(e) => {
                        setSelectedProduct(e.target.value);
                        if (error) setError(''); // Clear error on valid input
                    }}
                />

                {/* Search Button */}
                <button
                    type="submit"
                    className="inline-flex items-center lg:px-4 lg:py-2 lg:w-32 w-20 text-white bg-green-600
                        hover:bg-green-800 text-gray-700 rounded-r-md shadow-sm sm:px-2 sm:py-1"
                >
                    <p className="ml-3">Search</p>
                </button>
            </form>
        </>
    );
};

export default SearchBox;