import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const FpoListByName = () => {
    const [fpoData, setFpoData] = useState('');
    const { slug } = useParams();

    const data = 'login';

    const getAllFPOByName = async (slugName) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_FPO}/data/fpocontent/${slugName}`);

            if (response.ok) {
                const data = await response.json();
                console.log('data :', data);
                setFpoData(data.data);
            } else {
                console.log('Failed to fetch data');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };


    useEffect(() => {
        if (!slug) {
            console.log('slug data not available');
            return;
        }
        getAllFPOByName(slug);

    }, [slug]);




    return (
        <div className="flex flex-col mb-5 mt-5">
            <div className="flex justify-between items-center mb-4">
                {/* Slug Text */}
                <h4 className="text-gray-800 text-center font-semibold mb-2 flex-1">
                    {slug && slug.replace(/-/g, ' ')}
                </h4>

                {/* Login Link */}
                <Link
                    to={`/fpo-connect/user/${data}`}  // Update with your actual login route
                    className="underline text-blue-500 hover:text-blue-700 text-sm font-semibold mr-5"
                >
                    Login
                </Link>
            </div>

            {fpoData && fpoData ? (
                <div
                    className="md:mx-10 mb-5 font-sans p-4 bg-green-100 shadow-lg rounded-lg dark:bg-boxdark dark:text-bodydark 
            dark:shadow-none"
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="grid sm:grid-cols-2 gap-2">
                                <div className="flex space-x-2">
                                    <label className="text-[12px] font-semibold">FPO Name:</label>
                                    <p className="text-[12px]">{fpoData.fponame}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <label className="text-[12px] font-semibold">Taluk:</label>
                                    <p className="text-[12px]">{fpoData.taluk}</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {fpoData && fpoData.underSchema ? (
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">Under the Scheme:</label>
                                        <p className="text-[12px]">{fpoData.underSchema}</p>
                                    </div>
                                ) : ('')
                                }
                                <div className="flex space-x-2">
                                    <label className="text-[12px] font-semibold">District:</label>
                                    <p className="text-[12px]">{fpoData.district}</p>
                                </div>
                            </div>
                            {fpoData.activities.length > 1 ? (
                                <div className="flex flex-wrap space-x-2">
                                    <label className="text-[12px] font-semibold whitespace-nowrap w-full">Activities carried out:</label>
                                    {fpoData.activities.map((active, index) => (
                                        <p className="text-[12px] w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mr-2 mb-2 break-words" key={index}>
                                            {index + 1}. {active}
                                        </p>
                                    ))}
                                </div>
                            ) : fpoData.activities.length === 0 ? ('') :
                                (
                                    <div className="flex space-x-2">
                                        <label className="text-[12px] font-semibold">Activities carried out:</label>
                                        <p className="text-[12px]">{fpoData.activities[0]}</p>
                                    </div>
                                )}
                            {fpoData && fpoData.otherActivity ? (
                                <div className="flex space-x-2">
                                    <label className="text-[12px] font-semibold">Other Activity:</label>
                                    <p className="text-[12px]">{fpoData.otherActivity}</p>
                                </div>
                            ) : ('')
                            }
                            <div className="grid sm:grid-cols-2 gap-2">
                                <div className="flex space-x-2">
                                    <label className="text-[12px] font-semibold">Contact Person Name:</label>
                                    <p className="text-[12px]">{fpoData.personName}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <label className="text-[12px] font-semibold">Mob Number:</label>
                                    <p className="text-[12px]">{fpoData.mobNumber}</p>
                                </div>
                            </div>
                            <div>
                                <div className="bg-gray-50 text-[12px]">
                                    {fpoData && fpoData.cropDetails && fpoData.cropDetails.length > 0 ? (
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
                                                    {fpoData.cropDetails.map((crop, index) => (
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

                                    {fpoData && fpoData.productDetails && fpoData.productDetails.length > 0 ? (
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
                                                    {fpoData.productDetails.map((product, index) => (
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
            )
                :
                (<p>No FPO Content...</p>)
            }
        </div>
    )
};
export default FpoListByName;