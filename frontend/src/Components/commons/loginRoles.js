import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Toast from './Toastify';

const LoginRoles = ({ phone: initialPhone }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState(initialPhone || '');
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                phone,
                password,
            });

            localStorage.setItem("token", response.data.token);

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
                navigate('/');
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
            <div className="font-[sans-serif]">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 items-center mx-auto h-full">
                    <div className="max-md:order-1 lg:col-span-2 md:h-screen w-full bg-none md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-10">
                        <img src="https://readymadeui.com/signin-image.webp" className="lg:w-[70%] w-full lg:h-94 object-contain block mx-auto" alt="login-image" />
                    </div>

                    <div className="w-full mt-2 p-10 lg:mb-24 bg-white dark:bg-boxdark shadow-md dark:shadow-none">
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <h3 className="text-gray-800 text-xl font-extrabold">Sign in</h3>
                                <p className="text-sm mt-4 text-gray-800">
                                    Don't have an account
                                    <Link to="/register"
                                        className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                                    >
                                        Register here
                                    </Link>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm mb-2 block">Phone</label>
                                <div className="relative flex items-center">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="off"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5
                                 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                        placeholder="Enter phone number" />
                                    <FaPhoneAlt className="w-[18px] h-[18px] absolute right-4" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        id="password"
                                        name="password"
                                        autoComplete="off"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 
                                px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                        placeholder="Enter password" />
                                    {showPassword ? (
                                        <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className="w-[18px] h-[18px] absolute right-4 cursor-pointer text-gray-400" />
                                    ) : (
                                        <FaEye onClick={() => setShowPassword(!showPassword)} className="w-[18px] h-[18px] absolute right-4 cursor-pointer text-gray-400" />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox"
                                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md
                                dark:bg-boxdark shadow-md dark:shadow-none" />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm">
                                        Remember me
                                    </label>
                                </div>
                                <div>
                                    <Link to="/forgot-password" className="text-blue-600 font-semibold text-sm hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-6 text-sm tracking-wide rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none">
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
            </div>
        </>
    );
};

export default LoginRoles;
