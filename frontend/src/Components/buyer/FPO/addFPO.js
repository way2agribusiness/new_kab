import React, { useEffect, useState } from "react";
import Toast from "../../commons/Toastify";

// List of activities
const activities = [
    "Field crops cultivation",
    "High value horticulture crops",
    "Greenhouse crop production",
    "Integrated farming",
    "Input supply",
    "Precision farming technology",
    "Farm machinery rental services",
    "Farm management services",
    "Primary processing",
    "Value added products",
    "Branding & labeling",
    "Direct marketing - Local",
    "Direct marketing – Outside"
];

const AddFPO = ({ user, selectedComponent }) => {
    const [pid, setPid] = useState(selectedComponent && selectedComponent.data._id || '');
    const [formData, setFormData] = useState({
        fponame: '',
        taluk: '',
        district: '',
        underSchema: '',

        activities: [],
        otherActivity: "",

        personname: '',
        mobNumber: '',

        cropDetails: [{ cropname: "", quantity: "", pricerange: "", remarks: "" }],
        productDetails: [{ productname: "", quantity: "", value: "", remarks: "" }],

        sellerID: user && user._id || ''
    });

    useEffect(() => {
        // Scroll to the top of the page when this effect is triggered
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Check if selectedComponent and selectedComponent.data are defined
        if (selectedComponent && selectedComponent.data) {
            setFormData(prevData => ({
                ...prevData,
                // Safely access the data fields and provide fallback values
                fponame: selectedComponent.data.fponame || '',
                taluk: selectedComponent.data.taluk || '',
                district: selectedComponent.data.district || '',
                underSchema: selectedComponent.data.underSchema || '',
                activities: selectedComponent.data.activities || [],
                otherActivity: selectedComponent.data.otherActivity || '',
                personname: selectedComponent.data.personName || '',
                mobNumber: selectedComponent.data.mobNumber || '',

                // Safely handle cropDetails with dynamic row support
                cropDetails: Array.isArray(selectedComponent.data.cropDetails)
                    ? selectedComponent.data.cropDetails.map(crop => ({
                        cropname: crop.cropname || "",
                        quantity: crop.quantity || null,
                        pricerange: crop.pricerange || "",
                        remarks: crop.remarks || ""
                    }))
                    : [{ cropname: "", quantity: null, pricerange: "", remarks: "" }], // Initialize with one row by default

                // Safely handle productDetails with dynamic row support
                productDetails: Array.isArray(selectedComponent.data.productDetails)
                    ? selectedComponent.data.productDetails.map(product => ({
                        productname: product.productname || "",
                        quantity: product.quantity || null,
                        value: product.value || "",
                        remarks: product.remarks || ""
                    }))
                    : [{ productname: "", quantity: null, value: "", remarks: "" }], // Initialize with one row by default

                // Handle sellerID safely
                sellerID: selectedComponent.sellerID || user._id || ''
            }));

            // setPid(selectedComponent.data._id);
        }
    }, [selectedComponent, user]);


    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (activity) => {
        setFormData((prev) => {
            const isSelected = prev.activities.includes(activity);

            return {
                ...prev,
                activities: isSelected
                    ? prev.activities.filter((a) => a !== activity) // Remove if already selected
                    : [...prev.activities, activity], // Add if not selected
            };
        });
    };

    const handleOtherCheckboxChange = () => {
        setFormData((prev) => ({
            ...prev,
            otherActivity: prev.otherActivity ? "" : "Other", // Toggle between "Other" and empty string
        }));
    };


    const handleOtherInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            otherActivity: e.target.value, // Update the "Other" input field
        }));
    };


    // Function to handle input changes in crop details
    const handleCropDetailsChange = (index, field, value) => {
        const updatedCrops = [...formData.cropDetails];
        updatedCrops[index][field] = value;
        setFormData({ ...formData, cropDetails: updatedCrops });
    };

    // Function to add a new row
    const addCropRow = () => {
        const newCrop = { cropname: "", quantity: null, pricerange: "", remarks: "" };
        setFormData({
            ...formData,
            cropDetails: [...formData.cropDetails, newCrop],
        });
    };

    // Function to remove a row
    const removeCropRow = (index) => {
        const updatedCrops = formData.cropDetails.filter((_, i) => i !== index);
        setFormData({ ...formData, cropDetails: updatedCrops });
    };



    // Function to handle input changes in product details
    const handleProductDetailsChange = (index, field, value) => {
        const updatedProducts = [...formData.productDetails];
        updatedProducts[index][field] = value;
        setFormData({ ...formData, productDetails: updatedProducts });
    };

    // Function to add a new row
    const addProductRow = () => {
        const newProduct = { productname: "", quantity: null, value: "", remarks: "" };
        setFormData({
            ...formData,
            productDetails: [...formData.productDetails, newProduct],
        });
    };

    // Function to remove a row
    const removeProductRow = (index) => {
        const updatedProducts = formData.productDetails.filter((_, i) => i !== index);
        setFormData({ ...formData, productDetails: updatedProducts });
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize validation errors
        let validationErrors = {};

        // Validate `fponame`
        if (!formData.fponame.trim()) {
            validationErrors.fponame = "FPO Name is required";
        }

        // Validate `taluk`
        if (!formData.taluk.trim()) {
            validationErrors.taluk = "Taluk is required";
        }

        // Validate `district`
        if (!formData.district.trim()) {
            validationErrors.district = "district is required";
        }

        // Validate `activities`
        if (formData.activities.length === 0 && !formData.otherActivity.trim()) {
            validationErrors.activities = "At least one activity or an 'Other' activity is required";
        }

        // Validate `otherActivity`
        if (!formData.otherActivity.trim() && formData.activities.length === 0) {
            validationErrors.otherActivity = "Please specify an 'Other' activity if no other activities are selected";
        }

        // Validate `personname`
        if (!formData.personname.trim()) {
            validationErrors.personname = "Person name is required";
        }

        // Validate `mobNumber`
        if (!formData.mobNumber) {
            validationErrors.mobNumber = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobNumber)) {
            validationErrors.mobNumber = "Enter a valid 10-digit mobile number";
        }

        const cleanedCropDetails = formData.cropDetails.filter(
            (crop) => crop.cropname || crop.quantity || crop.pricerange || crop.remarks
        );

        const finalCropDetails = cleanedCropDetails.length > 0 ? cleanedCropDetails : [];

        const cleanedProductDetails = formData.productDetails.filter(
            (product) => product.productname || product.quantity || product.value || product.remarks
        );
        const finalProductDetails = cleanedProductDetails.length > 0 ? cleanedProductDetails : [];
        const finalFormData = {
            ...formData,
            cropDetails: finalCropDetails,
            productDetails: finalProductDetails
        };


        // Set errors if validation fails
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            // Clear errors and handle form submission
            setErrors({});
            console.log("Form submitted successfully", finalFormData);

            // Now send the valid form data to the API
            try {
                // Determine whether to use POST or PUT based on the presence of `pid`
                const method = pid ? 'PUT' : 'POST'; // Use PUT if `pid` exists, else POST
                const url = pid
                    ? `${process.env.REACT_APP_API_FPO}/data/update/${pid}`  // URL for PUT (update)
                    : `${process.env.REACT_APP_API_FPO}/data/post`; // URL for POST (create)

                const response = await fetch(url, {
                    method, // Use the appropriate HTTP method
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(finalFormData), // Send the formData in the body
                });

                // Check if the response is okay (status 2xx)
                if (response.ok) {
                    const data = await response.json();
                    // console.log('Form submitted successfully:', data);
                    // Scroll to the top of the page when this effect is triggered
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    // Show a success message in a toast
                    setToast({
                        show: true,
                        type: 'success',
                        title: 'Success',
                        message: pid ? 'Form updated successfully' : 'Form submitted successfully'
                    });

                    resetData(); // Reset form data after successful submission

                    // Hide toast after 3 seconds
                    setTimeout(() => {
                        setToast({ show: false });
                    }, 3000);
                } else {
                    const errorData = await response.json();
                    console.error('Error submitting form:', errorData.message);

                    // Handle the error here, display an error message, etc.
                    setToast({
                        show: true,
                        type: 'error',
                        title: 'Error',
                        message: errorData.message
                    });

                    // Hide toast after 5 seconds
                    setTimeout(() => {
                        setToast({ show: false });
                    }, 5000);
                }
            } catch (error) {
                console.error('Error during fetch:', error);

                // Handle fetch error (network issues, server down, etc.)
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Error',
                    message: error.message,
                });

                // Hide toast after 5 seconds
                setTimeout(() => {
                    setToast({ show: false });
                }, 5000);
            }
        }
    };


    const resetData = () => {
        setFormData({
            fponame: '',
            taluk: '',
            district: '',
            underSchema: '',

            activities: [],
            otherActivity: "",

            personname: '',
            mobNumber: '',

            // Initialize with a single row for cropDetails
            cropDetails: [
                { cropname: "", quantity: null, pricerange: "", remarks: "" }
            ],

            // Initialize with a single row for productDetails
            productDetails: [
                { productname: "", quantity: null, value: "", remarks: "" }
            ],
        })
    };


    return (
        <>
            <div className="flex flex-col mb-5">
                <h4 className="text-gray-800 text-center font-semibold">
                    {selectedComponent.data ? 'Update FPO Content' : 'Add New FPO'}
                </h4>
                <div
                    className="max-w-4xl mx-auto font-sans p-4 bg-green-100 shadow-lg rounded-lg dark:bg-boxdark dark:text-bodydark 
            dark:shadow-none">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="grid sm:grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-gray-800 text-[12px] block">FPO Name</label>
                                        <input
                                            name="fponame"
                                            type="text"
                                            value={formData.fponame}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success`}
                                            placeholder="Enter fpo name"
                                            required
                                        />
                                        {errors.fponame && <p className="text-red-500 text-sm">{errors.fponame}</p>}
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-[12px] block">Taluk</label>
                                        <input
                                            name="taluk"
                                            type="text"
                                            value={formData.taluk}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success`}
                                            placeholder="Enter taluk"
                                            required
                                        />
                                        {errors.taluk && <p className="text-red-500 text-sm">{errors.taluk}</p>}
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-gray-800 text-[12px] block">Under the Scheme</label>
                                        <input
                                            name="underSchema"
                                            type="text"
                                            value={formData.underSchema}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success`}
                                            placeholder="Schema..."
                                        />
                                        {errors.underSchema && <p className="text-red-500 text-sm">{errors.underSchema}</p>}
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-[12px] block">district</label>
                                        <input
                                            name="district"
                                            type="text"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success`}
                                            placeholder="Enter district"
                                            required
                                        />
                                        {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
                                    </div>
                                </div>
                                <div className="text-gray-800 text-[12px] block mt-2">
                                    <div>Activities carried out:</div>
                                    <div className="ms-3">
                                        {/* Display validation error messages */}
                                        {errors.activities && (
                                            <div className="text-red-500 mt-2">{errors.activities}</div>
                                        )}
                                        {errors.otherActivity && (
                                            <div className="text-red-500 mt-2">{errors.otherActivity}</div>
                                        )}
                                        <div className="flex flex-wrap gap-4">
                                            {activities.map((activity, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        className="p-2 w-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-boxdark-2"
                                                        checked={formData.activities.includes(activity)}
                                                        onChange={() => handleCheckboxChange(activity)}
                                                    />
                                                    <label>{activity}</label>
                                                </div>
                                            ))}
                                        </div>
                                        {/* "Other" checkbox */}
                                        <div className="flex items-center space-x-2 mt-4">
                                            <input
                                                type="checkbox"
                                                className="p-2 w-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-boxdark-2"
                                                onChange={handleOtherCheckboxChange}
                                                checked={formData.otherActivity !== ""}
                                            />
                                            <label>Specify if any other:</label>
                                        </div>
                                        {/* Show the text input if "Other" is selected */}
                                        {formData.otherActivity !== "" && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    value={formData.otherActivity}
                                                    onChange={handleOtherInputChange}
                                                    placeholder="Please specify..."
                                                    className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                  py-1 px-4 text-black outline-none transition focus:border-success
                  dark:border-form-strokedark dark:bg-form-input dark:text-white
                  dark:focus:border-success`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-gray-800 text-[12px] block">Contact person name</label>
                                        <input
                                            name="personname"
                                            type="text"
                                            value={formData.personname}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success`}
                                            placeholder="Enter contact person name"
                                            required
                                        />
                                        {errors.personname && <p className="text-red-500 text-sm">{errors.personname}</p>}
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-[12px] block">Mobile number</label>
                                        <input
                                            name="mobNumber"
                                            type="number"
                                            value={formData.mobNumber}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success`}
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                        {errors.mobNumber && <p className="text-red-500 text-sm">{errors.mobNumber}</p>}
                                    </div>
                                </div>
                                <div>
                                    <div className="p-6 bg-gray-50 min-h-screen text-[12px]">
                                        <h2 className="font-bold mb-4">Output Supply – Crops Details:</h2>
                                        <table className="table-auto w-full border border-gray-300 mb-8">
                                            <thead>
                                                <tr className="bg-gray-200 text-left">
                                                    <th className="px-4 py-2 border border-gray-300">Sl. No.</th>
                                                    <th className="px-4 py-2 border border-gray-300">Crop Name</th>
                                                    <th className="px-4 py-2 border border-gray-300">Quantity</th>
                                                    <th className="px-4 py-2 border border-gray-300">Price Range (Rs.)</th>
                                                    <th className="px-4 py-2 border border-gray-300">Remarks</th>
                                                    <th className="px-4 py-2 border border-gray-300">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.cropDetails.map((crop, index) => (
                                                    <tr key={index} className="text-sm">
                                                        <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success"
                                                                placeholder="Crop name"
                                                                value={crop.cropname}
                                                                onChange={(e) =>
                                                                    handleCropDetailsChange(index, "cropname", e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success"
                                                                placeholder="Quantity"
                                                                value={crop.quantity || ""}
                                                                onChange={(e) =>
                                                                    handleCropDetailsChange(index, "quantity", e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success"
                                                                placeholder="Price range"
                                                                value={crop.pricerange}
                                                                onChange={(e) =>
                                                                    handleCropDetailsChange(index, "pricerange", e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success"
                                                                placeholder="Remarks"
                                                                value={crop.remarks}
                                                                onChange={(e) =>
                                                                    handleCropDetailsChange(index, "remarks", e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                                            {formData.cropDetails.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeCropRow(index)}
                                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={addCropRow}
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                            >
                                                Add Row
                                            </button>
                                        </div>



                                        <h2 className="font-bold mb-4">Input Requirement – Product Details:</h2>
                                        <table className="table-auto w-full border border-gray-300 mb-8">
                                            <thead>
                                                <tr className="bg-gray-200 text-left">
                                                    <th className="px-4 py-2 border border-gray-300">Sl. No.</th>
                                                    <th className="px-4 py-2 border border-gray-300">Product Name</th>
                                                    <th className="px-4 py-2 border border-gray-300">Qty/No.</th>
                                                    <th className="px-4 py-2 border border-gray-300">Value (Rs.)</th>
                                                    <th className="px-4 py-2 border border-gray-300">Remarks</th>
                                                    <th className="px-4 py-2 border border-gray-300">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.productDetails.map((product, index) => (
                                                    <tr key={index} className="text-sm">
                                                        <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success`}
                                                                placeholder="Product name"
                                                                value={product.productname}
                                                                onChange={(e) =>
                                                                    handleProductDetailsChange(index, "productname", e.target.value)
                                                                }
                                                            />
                                                            {errors[`productDetails.${index}.productname`] && (
                                                                <p className="text-red-500 text-sm">{errors[`productDetails.${index}.productname`]}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success`}
                                                                placeholder="Quantity/No."
                                                                value={product.quantity || ""}
                                                                onChange={(e) =>
                                                                    handleProductDetailsChange(index, "quantity", e.target.value)
                                                                }
                                                            />
                                                            {errors[`productDetails.${index}.quantity`] && (
                                                                <p className="text-red-500 text-sm">{errors[`productDetails.${index}.quantity`]}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success`}
                                                                placeholder="Value"
                                                                value={product.value}
                                                                onChange={(e) =>
                                                                    handleProductDetailsChange(index, "value", e.target.value)
                                                                }
                                                            />
                                                            {errors[`productDetails.${index}.value`] && (
                                                                <p className="text-red-500 text-sm">{errors[`productDetails.${index}.value`]}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            <input
                                                                type="text"
                                                                className={`w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                            py-1 px-4 text-black outline-none transition focus:border-success
                            dark:border-form-strokedark dark:bg-form-input dark:text-white
                            dark:focus:border-success`}
                                                                placeholder="Remarks"
                                                                value={product.remarks}
                                                                onChange={(e) =>
                                                                    handleProductDetailsChange(index, "remarks", e.target.value)
                                                                }
                                                            />
                                                            {errors[`productDetails.${index}.remarks`] && (
                                                                <p className="text-red-500 text-sm">{errors[`productDetails.${index}.remarks`]}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                                            {formData.productDetails.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeProductRow(index)}
                                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={addProductRow}
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                            >
                                                Add Row
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className={`w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700`}
                            >
                                {selectedComponent.data ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}
        </>
    );
};

export default AddFPO;
