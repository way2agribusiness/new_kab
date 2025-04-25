import React, { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import { PiGpsFixFill } from "react-icons/pi";
import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const LocationFilter = ({ setSearchState, setSearchCity }) => {
    const [locations, setLocations] = useState([]); // Changed initial state to an empty array
    const [city, setCity] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showAllStates, setShowAllStates] = useState(false);
    const [showAllCities, setShowAllCities] = useState(false);
    const [allCity, setAllCity] = useState(true);

    const getLocations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/locations`);
            const serRes = await response.json();

            if (response.ok) {
                setLocations(serRes.locations);
                console.log('loc :', serRes.locations);
            } else {
                console.error('Error fetching locations:', serRes.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    useEffect(() => {
        getLocations();
    }, []);

    // Get unique states from the fetched locations
    const uniqueStates = Array.from(new Set(locations.map(item => item.state)))
        .map(stateName => locations.find(item => item.state === stateName));

    // Get initially visible states and remaining states
    const initialDisplayCountStates = 6;
    const initiallyVisibleStates = uniqueStates.slice(0, initialDisplayCountStates);
    const remainingStates = uniqueStates.slice(initialDisplayCountStates);

    // Get initially visible cities and remaining cities
    const initialDisplayCountCities = 5;
    const initiallyVisibleCities = city.slice(0, initialDisplayCountCities);
    const remainingCities = city.slice(initialDisplayCountCities);


    // Function to handle state selection and show cities
    const relateState = (stateName) => {
        setSelectedState(stateName);
        setSelectedCity('');
        setAllCity(false);
        setShowAllCities(false); // Reset city view to initial state
        setSearchState(stateName);
        setSearchCity('');

        // Find all cities for the selected state
        const selectedStateData = locations.find(item => item.state === stateName);
        if (selectedStateData) {
            // Remove duplicates and set cities
            setCity(selectedStateData.cities);
        } else {
            console.log('State Not Available');
        }
    };

    const selectCity = (city) => {
        setSelectedCity(city);
        setSearchCity(city);
    };

    const clearSelection = () => {
        setAllCity(true);
        setSelectedState('');
        setSelectedCity('');
        setSearchState('');
        setSearchCity('');
    };

    return (
        <>
            {/* Header filter */}
            <div className="flex flex-col lg:flex-row justify-between mx-10 p-2 text-sm bg-white dark:bg-boxdark shadow-md dark:shadow-none rounded-md space-y-4 lg:space-y-0 lg:space-x-4 cursor-pointer">
                <div className="flex flex-col-1 lg:flex-row items-center lg:space-y-0 lg:space-x-4">
                    <IoLocationSharp className="text-xl text-danger" />
                    <p className="hidden lg:block">Locations</p>
                    <div className="relative flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search by city & Product Name..."
                            className="text-[12px] border border-gray-300 rounded px-4 mx-10 md:mx-1 w-full lg:w-64 pl-10 focus:outline-none text-black dark:text-bodydark bg-white dark:bg-boxdark shadow-md dark:shadow-none"
                            onChange={(e) => setSearchCity(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 text-gray-500" />
                    </div>
                    <PiGpsFixFill className="text-xl text-success" />
                    <p className="hidden lg:block hover:text-success hover:underline">Nearby</p>
                </div>
                <div className="grid grid-cols-3 lg:gap-24 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 w-full">
                    {allCity ? (
                        <>
                            {(showAllStates ? remainingStates : initiallyVisibleStates).map((item, i) => (
                                <div key={i}>
                                    <p
                                        className={`text-center cursor-pointer whitespace-nowrap ${item.state === selectedState ? 'text-success' : 'hover:text-success hover:underline'}`}
                                        onClick={() => relateState(item.state)}
                                    >
                                        {item.state}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-center space-x-4">
                                {!showAllStates && uniqueStates.length > initialDisplayCountStates && (
                                    <p
                                        className="text-blue-600 font-bold text-center hover:text-success hover:underline cursor-pointer"
                                        onClick={() => setShowAllStates(true)}
                                    >
                                        more...
                                    </p>
                                )}
                                {showAllStates && (
                                    <p
                                        className="text-blue-600 font-bold text-center hover:text-success hover:underline cursor-pointer"
                                        onClick={() => setShowAllStates(false)}
                                    >
                                        pre...
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="">
                                <Link to="/products"
                                    className="text-blue-600 font-bold text-center hover:text-success hover:underline cursor-pointer"
                                    onClick={clearSelection}
                                >
                                    States..
                                </Link>
                            </div>
                            <div>
                                <p className={`text-center cursor-pointer font-bold whitespace-nowrap ${selectedState === selectedState ? 'text-success' : 'hover:text-success hover:underline'}`}
                                    onClick={() => relateState(selectedState)}
                                >
                                    {selectedState}
                                </p>
                            </div>
                            {(showAllCities ? remainingCities : initiallyVisibleCities).map((item, i) => (
                                <div key={i}>
                                    <p className={`text-center cursor-pointer whitespace-nowrap ${item === selectedCity ? 'text-success' : 'hover:text-success hover:underline'}`}
                                        onClick={() => selectCity(item)}
                                    >
                                        {item}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-center space-x-4">
                                {!showAllCities && city.length > initialDisplayCountCities && (
                                    <p
                                        className="text-blue-600 font-bold text-center hover:text-success hover:underline cursor-pointer"
                                        onClick={() => setShowAllCities(true)}
                                    >
                                        more...
                                    </p>
                                )}
                                {showAllCities && (
                                    <p
                                        className="text-blue-600 font-bold text-center hover:text-success hover:underline cursor-pointer"
                                        onClick={() => setShowAllCities(false)}
                                    >
                                        pre...
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default LocationFilter;
