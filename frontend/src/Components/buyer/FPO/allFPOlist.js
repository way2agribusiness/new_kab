import React, { useState, useEffect } from "react";

const AllfpoList = () => {
    const [fpoData, setFpoData] = useState([]);
    const [fpodistrict, setFpoDistrict] = useState([]);
    const [fpoName, setFpoName] = useState([]);
    const [formData, setFormData] = useState({
        fponame: '',
        district: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const getAllFpoDistricts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_FPO}/data/getdistrict`);
                if (response.ok) {
                    const data = await response.json();
                    setFpoDistrict(data.districts);
                    console.log('fpo-taluk :', data);
                } else {
                    console.log('Failed to fetch data');
                }
            } catch (err) {
                console.error(err);
            }
        };

        getAllFpoDistricts();
    }, []);

    // Fetch FPO names based on selected district
    useEffect(() => {
        const getFpoNamesByDistrict = async () => {
            if (!formData.district) return; // Only fetch if district is selected
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_FPO}/data/district/${formData.district}`);
                if (response.ok) {
                    const data = await response.json();
                    setFpoName(data.fponames); // Assuming the response has a "fponames" field
                } else {
                    console.log('Failed to fetch FPO names');
                    setFpoName([]);
                }
            } catch (err) {
                console.error(err);
                setFpoName([]);
            } finally {
                setLoading(false);
            }
        };

        getFpoNamesByDistrict();
    }, [formData.district]); // Only run when district changes

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSearch = async () => {
        if (!formData.fponame || !formData.district) {
            setError("Please select both FPO Name and district.");
            return;
        }

        setLoading(true);
        setError(null);  // Reset error

        try {
            const response = await fetch(`${process.env.REACT_APP_API_FPO}/data/get-fpo-by-name-taluk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setFpoData(data);  // Store the fetched data in state
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch data.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred while fetching the data.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="flex space-x-6 mt-5 justify-center text-sm">
                <div className="w-64">
                    <select
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-slate-400 bg-transparent py-1 px-4 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                    >
                        <option value="">Select district</option>
                        {/* Conditionally render options only if taluks is an array and has items */}
                        {fpodistrict.length > 0 ? (
                            fpodistrict.map((district, index) => (
                                <option key={index} value={district}>
                                    {district}
                                </option>
                            ))
                        ) : (
                            <option value="">No district available</option>
                        )}
                    </select>
                </div>

                <div className="w-64">
                    <select
                        id="fponame"
                        name="fponame"
                        value={formData.fponame}
                        onChange={handleChange}
                        disabled={!formData.district || fpoName.length === 0} // Disable if no district selected or no FPO names found
                        className="w-full rounded border-[1.5px] border-slate-400 bg-transparent py-1 px-4 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                    >
                        <option value="">Select FPO Name</option>
                        {/* Conditionally render options only if fponames is an array and has items */}
                        {fpoName.length > 0 ? (
                            fpoName.map((fponame, index) => (
                                <option key={index} value={fponame}>
                                    {fponame}
                                </option>
                            ))
                        ) : (
                            <option value="">No FPO names available</option>
                        )}
                    </select>
                </div>

                <div className="w-64">
                    <button
                        onClick={handleSearch}
                        className="w-[50%] py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    >
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>
            <div className="text-center text-xs">
                <p className="text-amber-500 italic">Please select both FPO Name and district then Search</p>
            </div>

            {/* Show Error */}
            {error && (
                <div className="mt-5 text-center text-red-500">
                    <p>{error}</p>
                </div>)}

            <div className="flex flex-col mb-5">
                <h4 className={`text-gray-800 text-center font-semibold ${fpoData.fponame ? 'block' : 'hidden'}`}>
                    ALL FPO LIST
                </h4>

                {fpoData && fpoData.map((item, index) => (
                    <div
                        className="md:mx-10 mb-5 font-sans p-3 md:p-4 bg-green-100 shadow-lg rounded-lg dark:bg-boxdark dark:text-bodydark 
                 dark:shadow-none"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="grid sm:grid-cols-2 gap-2">
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">FPO Name:</label>
                                        <p className="text-[12px]">{item.fponame}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">Taluk:</label>
                                        <p className="text-[12px]">{item.taluk}</p>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2">
                                    {item && item.underSchema ? (
                                        <div className="flex space-x-2">
                                            <label className="text-[12px] font-semibold">Under the Scheme:</label>
                                            <p className="text-[12px]">{item.underSchema}</p>
                                        </div>
                                    ) : ('')
                                    }
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">District:</label>
                                        <p className="text-[12px]">{item.district}</p>
                                    </div>
                                </div>
                                {item.activities.length > 1 ? (
                                    <div className="flex flex-wrap space-x-2">
                                        <label className="text-[12px] font-semibold whitespace-nowrap w-full">Activities carried out:</label>
                                        {item.activities.map((active, index) => (
                                            <p className="text-[12px] w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mr-2 mb-2 break-words" key={index}>
                                                {index + 1}. {active}
                                            </p>
                                        ))}
                                    </div>
                                ) : item.activities.length === 0 ? ('') :
                                    (
                                        <div className="flex space-x-2">
                                            <label className="text-[12px] font-semibold">Activities carried out:</label>
                                            <p className="text-[12px]">{item.activities[0]}</p>
                                        </div>
                                    )}
                                {item && item.otherActivity ? (
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">Other Activity:</label>
                                        <p className="text-[12px]">{item.otherActivity}</p>
                                    </div>
                                ) : ('')
                                }
                                <div className="grid sm:grid-cols-2 gap-2">
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">Contact Person Name:</label>
                                        <p className="text-[12px]">{item.personName}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">Mob Number:</label>
                                        <p className="text-[12px]">{item.mobNumber}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-gray-50 text-[12px]">
                                        {item && item.cropDetails && item.cropDetails.length > 0 ? (
                                            <>
                                                <h2 className="font-bold mb-4">Output Supply – Product Details:</h2>
                                                <table className="table-auto w-full border border-gray-300 mb-8">
                                                    <thead>
                                                        <tr className="bg-gray-200 text-left">
                                                            <th className="px-4 py-2 border border-gray-300">Sl. No.</th>
                                                            <th className="px-4 py-2 border border-gray-300">Crop Name</th>
                                                            <th className="px-4 py-2 border border-gray-300">Quantity</th>
                                                            <th className="px-4 py-2 border border-gray-300">Price Range (Rs.)</th>
                                                            <th className="px-2 py-2 border border-gray-300">Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.cropDetails.map((crop, index) => (
                                                            <tr className="text-sm" key={index}>
                                                                <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                                                                <td className="px-4 py-2 border border-gray-300">{crop.cropname}</td>
                                                                <td className="px-4 py-2 border border-gray-300">{crop.quantity}</td>
                                                                <td className="px-4 py-2 border border-gray-300">{crop.pricerange}</td>
                                                                <td className="px-2 py-2 border border-gray-300">{crop.remarks}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : null}

                                        {item && item.productDetails && item.productDetails.length > 0 ? (
                                            <>
                                                <h2 className="font-bold mb-4">Input Requirement – Product Details:</h2>
                                                <table className="table-auto w-full border border-gray-300">
                                                    <thead>
                                                        <tr className="bg-gray-200 text-left">
                                                            <th className="px-4 py-2 border border-gray-300">Sl. No.</th>
                                                            <th className="px-4 py-2 border border-gray-300">Product Name</th>
                                                            <th className="px-4 py-2 border border-gray-300">Qty/No.</th>
                                                            <th className="px-4 py-2 border border-gray-300">Value (Rs.)</th>
                                                            <th className="px-1 py-2 border border-gray-300">Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.productDetails.map((product, index) => (
                                                            <tr className="text-sm" key={index}>
                                                                <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                                                                <td className="px-4 py-2 border border-gray-300">{product.productname}</td>
                                                                <td className="px-4 py-2 border border-gray-300">{product.quantity}</td>
                                                                <td className="px-4 py-2 border border-gray-300">{product.value}</td>
                                                                <td className="px-1 py-2 border border-gray-300">{product.remarks}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : null}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};
export default AllfpoList;