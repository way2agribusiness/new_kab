import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FPOListAdmin = ({ user, setSelectedComponent }) => {
    const [fpoData, setFpoData] = useState([]);
    const navigate = useNavigate();

    const getAllFPOs = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_FPO}/data/getall`);

            if (response.ok) {
                const data = await response.json();
                const reversedData = data.data.reverse();
                setFpoData(reversedData);
            } else {
                console.log('Failed to fetch data');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };


    useEffect(() => {
        getAllFPOs();
    }, []);


    const handleDelete = async (fpoId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_FPO}/data/delete/${fpoId}`, {
                method: 'DELETE', // Ensure that the DELETE method is specified
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Delete Success:', data);
                alert('FPO deleted successfully!');
                getAllFPOs();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                console.error('Failed to delete FPO');
                alert('Failed to delete FPO');
            }
        } catch (error) {
            console.error('Error deleting FPO:', error);
            alert('Error occurred while deleting FPO');
        }
    };


    const handleEdit = (data) => {
        setSelectedComponent({
            data: data
        });
        navigate('/fpo-connect/add-content');
    };


    return (
        <div className="flex flex-col mb-5">
            <h4 className="text-gray-800 text-center font-semibold">FPO LIST</h4>
            {fpoData && fpoData.map((item, index) => (
                <div
                    className="md:mx-10 mb-5 font-sans p-4 bg-green-100 shadow-lg rounded-lg dark:bg-boxdark dark:text-bodydark 
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

                    <div className="text-end space-x-5 mt-2">
                        <button
                            className=" bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-all"
                            onClick={handleEdit.bind(this, item)}>
                            Edit
                        </button>
                        <button
                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all"
                            onClick={handleDelete.bind(this, item._id)}>
                            Delete
                        </button>
                    </div>

                </div>
            ))}
        </div>
    )
};
export default FPOListAdmin;