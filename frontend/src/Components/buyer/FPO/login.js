import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import Toast from "../../commons/Toastify";
import axios from "axios";

const RegisterFPO = ({ setSelectedComponent }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post(`${process.env.REACT_APP_API_FPO}/loginFPO`, {
                phone,
                password,
            });

            localStorage.setItem("token2", response.data.token);

            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'User logged in successfully',
            });

            setPhone('');
            setPassword('');

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                navigate('/fpo-connect');
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Error logging in:", error.response.data);
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: error.response.data.msg || 'Login failed. Please try again.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 seconds
        }
    };


    return (
        <>
            <div className="flex justify-center items-center bg-gray-100 mb-5 text-sm">
                <div className="bg-white shadow-md rounded-md w-96 h-80 p-6  dark:bg-boxdark dark:shadow-none">
                    <form onSubmit={handleLogin}>
                        <div className="mb-2">
                            <h3 className="text-gray-800 font-extrabold">Sign in FPO</h3>
                            <p className="mt-1 text-gray-800">
                                Don't have an account ?
                                <Link
                                    onClick={() => setSelectedComponent({
                                        link: 'Phone-verify',
                                        data: ''
                                    })}
                                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                                >
                                    Register here
                                </Link>
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="mb-2">
                            <label className="mb-2 block">Phone</label>
                            <div className="relative flex items-center">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="off"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1 px-5
                           text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                    placeholder="Enter phone number"
                                />
                                <FaPhoneAlt className="w-[12px] h-[12px] absolute right-4" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label className="mb-2 block">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1 
                           px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                    placeholder="Enter password"
                                />
                                {showPassword ? (
                                    <FaEyeSlash
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="w-[18px] h-[18px] absolute right-4 cursor-pointer text-gray-400"
                                    />
                                ) : (
                                    <FaEye
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="w-[18px] h-[18px] absolute right-4 cursor-pointer text-gray-400"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-3 w-3 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md
                           dark:bg-boxdark shadow-md dark:shadow-none"
                                />
                                <label htmlFor="remember-me" className="ml-3 block text-sm">
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <Link
                                    onClick={()=>setSelectedComponent({
                                        link: 'Forgot-pass',
                                        data: ''
                                    })}
                                    className="text-blue-600 font-semibold text-sm hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full py-2 px-6 text-sm tracking-wide rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {toast.show && (
                    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                        <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                    </div>
                )}
        </>
    );
};

export default RegisterFPO;
