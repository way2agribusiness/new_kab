import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Toast from "./Toastify";

const RegisterRoles = ({ phone, user }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [uid, setUid] = useState(user && user._id || '');
    const [isAdmin, setIsAdmin] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });


    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: phone || user?.phone || '', // Use phone from props
        password: "",
        cpassword: "",
        isWhatsApp: user?.isWhatsApp || false,
        role: user?.roleID?.name || 'Buyer',
        categories: {
            AgriInput: user?.categoryID.some(res => res.name === 'AgriInput') || false,
            AgriOutput: user?.categoryID.some(res => res.name === 'AgriOutput') || false,
            AgriServices: user?.categoryID.some(res => res.name === 'AgriServices') || false,
        },
        gstNumber: user?.gstNumber || null,
        address_line1: user?.addressID?.address_line1 || '',
        address_line2: user?.addressID?.address_line2 || '',
        city: user?.addressID?.city || '',
        state: user?.addressID?.state || '',
        postal_code: user?.addressID?.postal_code || '',
        country: user?.addressID?.country || '',
        photo: user?.photo || '',
    });

    // Update formData when phone prop changes
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            phone: phone || ""
        }));
    }, [phone]);

    useEffect(() => {
        if (user && user.roleID.name === 'Admin') {
            setIsAdmin(true);
        }
    }, [])

    const [errors, setErrors] = useState({});
    const [isAgreed, setIsAgreed] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (name in formData.categories) {
                setFormData((prevData) => ({
                    ...prevData,
                    categories: {
                        ...prevData.categories,
                        [name]: checked,
                    },
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: checked,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleFileChange = (e) => {
        const { files } = e.target;
        const maxSize = 100 * 1024; // 100KB in bytes

        if (files[0]) {
            const file = files[0];

            if (file.size > maxSize) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    photo: 'File size should be less than 100KB.',
                }));
                e.target.value = ''; // Clear the input
                return;
            }

            setErrors((prevErrors) => ({
                ...prevErrors,
                photo: '', // Clear error if file size is valid
            }));

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    photo: reader.result,
                }));
            };
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        let validationErrors = {};

        if (!formData.username) {
            validationErrors.username = "Username is required";
        }

        if (formData.password !== formData.cpassword) {
            validationErrors.cpassword = "Passwords do not match";
        }


        if (formData.role === "Vendor") {
            // Check if "AgriOutput" is selected exclusively
            const onlyAgriOutputSelected = formData.categories.AgriOutput &&
                !formData.categories.AgriInput &&
                !formData.categories.AgriServices;

            // GST number is required unless only AgriOutput is selected
            if (!onlyAgriOutputSelected && !formData.gstNumber) {
                validationErrors.gstNumber = "GST Number is required for vendors (except for AgriOutput)";
            }

            // Ensure at least one category is selected
            if (!Object.values(formData.categories).some(Boolean)) {
                validationErrors.categories = "At least one category must be selected";
            }
        }


        if (!formData.address_line1) {
            validationErrors.address_line1 = "Address Line 1 is required";
        }

        if (!formData.city) {
            validationErrors.city = "City is required";
        }

        if (!formData.state) {
            validationErrors.state = "State is required";
        }

        if (!formData.postal_code) {
            validationErrors.postal_code = "Postal Code is required";
        }

        if (!formData.country) {
            validationErrors.country = "Country is required";
        }

        // Validate photo
        // if (!formData.photo) {
        //     validationErrors.photo = "Profile photo is required";
        // } else if (formData.photo.size > 100 * 1024) { // 100KB in bytes
        //     validationErrors.photo = "Profile photo should be less than 100KB";
        // }


        // Validate photo
        if (formData.role === "Vendor") {
            if (!formData.photo) {
                validationErrors.photo = "Profile photo is required";
            } else if (formData.photo.size > 100 * 1024) { // 100KB in bytes
                validationErrors.photo = "Profile photo should be less than 100KB";
            }
        } else {
            // If role is "Buyer" or any other role, ensure photo is not required
            delete validationErrors.photo;  // Clear any previous photo validation error if role changes
        }



        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear previous errors
        setErrors({});

        // Determine the API endpoint and method based on uid
        const endpoint = !uid
            ? `${process.env.REACT_APP_API_URL}/register`
            : `${process.env.REACT_APP_API_URL}/editprofile/${uid}`;
        const method = uid ? 'PUT' : 'POST';

        // Handle form submission logic here
        fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    // Handle non-2xx HTTP responses
                    return response.json().then((data) => {
                        throw new Error(data.message || 'An error occurred');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                // Handle success
                setToast({
                    show: true,
                    type: 'success',
                    title: 'Success',
                    message: !uid ? 'User Registered successfully!' : 'User Updated successfully!',
                });

                // Reset form fields
                setFormData({
                    username: "",
                    email: "",
                    phone: "",
                    password: "",
                    cpassword: "",
                    isWhatsApp: false,
                    role: "Buyer",
                    categories: {
                        AgriInput: false,
                        AgriOutput: false,
                        AgriServices: false,
                    },
                    gstNumber: "",
                    address_line1: "",
                    address_line2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "",
                    photo: "",
                });

                // Show the success toast for 1 second, then navigate
                setTimeout(() => {
                    navigate(uid ? window.location.reload('/buyer/profile') : '/login');
                }, 1000);
            })
            .catch((error) => {
                console.error("Error:", error);

                // Handle errors from the fetch call or server
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Error',
                    message: error.message || 'Registration failed. Please try again.',
                });

                // Hide toast after 5 seconds
                setTimeout(() => {
                    setToast({ show: false });
                }, 5000);
            });
    };


    return (
        <div className="flex flex-col ">
            <h4 className="text-gray-800 text-center font-semibold mt-2">
                Sign up into your account
            </h4>
            <div className="max-w-4xl mx-auto font-sans p-4 bg-green-100 shadow-lg rounded-lg dark:bg-boxdark dark:text-bodydark dark:shadow-none">
                <form onSubmit={handleSubmit}>
                    {/* Container for Personal and Address Sections */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Personal Information */}
                        <div className="flex-1">
                            <h4 className="text-gray-800 text-center font-semibold mt-2 mb-4">Personal Information</h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Username</label>
                                    <input
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter username"
                                        required
                                    />
                                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                </div>
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Email (optional)</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success"
                                        placeholder="Enter email"
                                    />
                                </div>
                                {/* <div>
                                    <label className="text-gray-800 text-[12px] block">Phone</label>
                                    <input
                                        name="phone"
                                        type="text"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full text-gray-800 text-[12px] px-4 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'} border`}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div> */}
                                <div className="relative">
                                    <label className="text-gray-800 text-[12px] block">Password</label>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter password"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-5">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-500 focus:outline-none"
                                        >
                                            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>
                                <div className="relative">
                                    <label className="text-gray-800 text-[12px] block">Confirm Password</label>
                                    <input
                                        name="cpassword"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.cpassword}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Confirm password"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-5">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-500 focus:outline-none"
                                        >
                                            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.cpassword && <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>}
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="mb-1">
                                <div className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        name="isWhatsApp"
                                        checked={formData.isWhatsApp}
                                        onChange={handleChange}
                                        className="p-2 w-5 text-blue-600 rounded focus:ring-blue-500  dark:bg-boxdark-2"
                                    />
                                    <label className="text-gray-800 text-[12px] ml-2">Yes, I use WhatsApp</label>
                                </div>
                            </div>

                            {/* Role and Categories */}
                            <div className={`mb-2 ${isAdmin ? 'hidden' : 'block'}`}>
                                <label className="text-gray-800 text-[12px] block">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleRoleChange}
                                    className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success"
                                    required
                                >
                                    <option value="Buyer">Buyer</option>
                                    <option value="Vendor">Vendor</option>
                                </select>
                            </div>

                            {formData.role === "Vendor" && (
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Categories</label>
                                    <div className="flex flex-col">
                                        <label className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                name="AgriInput"
                                                checked={formData.categories.AgriInput}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500  dark:bg-boxdark-2"
                                            />
                                            <span className="text-gray-800 text-sm ml-2">Agri Input</span>
                                        </label>
                                        <label className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                name="AgriOutput"
                                                checked={formData.categories.AgriOutput}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500  dark:bg-boxdark-2"
                                            />
                                            <span className="text-gray-800 text-sm ml-2">Agri Output</span>
                                        </label>
                                        <label className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                name="AgriServices"
                                                checked={formData.categories.AgriServices}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500  dark:bg-boxdark-2"
                                            />
                                            <span className="text-gray-800 text-sm ml-2">Agri Services</span>
                                        </label>
                                    </div>
                                    {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}

                                    {/* GST Number */}
                                    <div className="mb-6">
                                        <label className="text-gray-800 text-[12px] block">GST Number</label>
                                        <input
                                            name="gstNumber"
                                            type="text"
                                            value={formData.gstNumber}
                                            onChange={handleChange}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                                py-1 px-4 text-black outline-none transition focus:border-success
                                                 dark:border-form-strokedark dark:bg-form-input dark:text-white
                                                  dark:focus:border-success
                                                 ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                            placeholder="Enter GST Number"
                                        />
                                        <p className="text-[10px] text-warning">
                                            GST Number is not required for Agri Output.
                                        </p>
                                        {errors.gstNumber && <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Address Information */}
                        <div className="flex-1">
                            <h4 className="text-gray-800 text-center font-semibold mt-2 mb-4">Address Information</h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Address Line 1</label>
                                    <input
                                        name="address_line1"
                                        type="text"
                                        value={formData.address_line1}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter address line 1"
                                        required
                                    />
                                    {errors.address_line1 && <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>}
                                </div>
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Address Line 2</label>
                                    <input
                                        name="address_line2"
                                        type="text"
                                        value={formData.address_line2}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter address line 2"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-800 text-[12px] block">City</label>
                                    <input
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter city"
                                        required
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="text-gray-800 text-[12px] block">State</label>
                                    <input
                                        name="state"
                                        type="text"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter state"
                                        required
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Postal Code</label>
                                    <input
                                        name="postal_code"
                                        type="text"
                                        value={formData.postal_code}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter postal code"
                                        required
                                    />
                                    {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                                </div>
                                <div>
                                    <label className="text-gray-800 text-[12px] block">Country</label>
                                    <input
                                        name="country"
                                        type="text"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success
                                             ${errors.password ? 'border-red-500' : 'border-slate-400'} border`}
                                        placeholder="Enter country"
                                        required
                                    />
                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Photo URL Input */}
                    <div className="mb-6">
                        <label className="text-gray-800 text-[12px] block">Profile Photo URL</label>
                        <input
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            className="w-full rounded border-[1.5px] border-slate-400 bg-transparent 
                                            py-1 px-4 text-black outline-none transition focus:border-success
                                             dark:border-form-strokedark dark:bg-form-input dark:text-white
                                              dark:focus:border-success"
                        />
                        {errors.photo && <p className="text-red-500 text-xl mt-1">{errors.photo}</p>}
                        <p className="text-[10px] text-warning">
                            profile photo should be less than 100kb *
                        </p>
                        {formData.photo && <img src={formData.photo} alt="Profile Preview" className="mt-4 h-32 w-32 object-cover rounded-full" />}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="p-2 w-5 text-blue-600 rounded focus:ring-blue-500  dark:bg-boxdark-2"
                            />
                            <label className="text-gray-800 text-[12px] ml-2">I Agree with your terms & conditions *</label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={!isAgreed} // Disable button if terms are not agreed
                            className={`w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 ${!isAgreed ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}
        </div>
    );
};

export default RegisterRoles;
