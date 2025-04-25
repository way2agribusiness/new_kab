import React, { useState } from 'react';
import { TbPasswordUser } from "react-icons/tb";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Toast from '../../commons/Toastify';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordFPO = ({ setSelectedComponent, selectedComponent }) => {
    console.log('selectedComponent-form :', selectedComponent)
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (newPassword !== confirmPassword) {
            setToast({ show: true, type: 'error', title: 'Error', message: 'Passwords do not match' });
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_FPO}/resetPasswordFPO`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        phone: selectedComponent.data,
                        newPassword: newPassword
                    }
                ),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const result = await response.json();
            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Password reset successfully',
            });

            setNewPassword('');
            setConfirmPassword('');

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                setSelectedComponent({
                    link: 'Login-FPO',
                    data: ''
                })
            }, 1000);
        } catch (error) {
            console.log("Error passoword reset:", error);
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Password reset failed. Please try again.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 seconds
        }
    };

    return (
        <section>
            <main className="flex justify-center items-center bg-gray-100 mb-5 text-sm">
                <div className="bg-white shadow-md rounded-md w-96 h-80 p-6 dark:bg-boxdark dark:shadow-none">
                    <div className="">
                        <div className="text-center">
                            <div className="flex items-end justify-center text-6xl font-bold">
                                <TbPasswordUser className='text-success' />
                            </div>
                            <h1 className="block text-lg font-bold text-gray-800">Reset Password
                                  <Link to="/login" className="text-blue-600 font-semibold text-sm hover:underline ms-2">Login</Link></h1>
                        </div>

                        <div className="mt-5">
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="new_password" className="block mb-2 ml-1 text-xs font-semibold">New password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="new_password"
                                                name="new_password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                                required
                                                placeholder="Enter a new password"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-500 focus:outline-none"
                                                >
                                                    {showPassword ? <AiFillEyeInvisible size={16} /> : <AiFillEye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirm_new_password" className="block mb-2 ml-1 text-xs font-semibold">Confirm new password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="confirm_new_password"
                                                name="confirm_new_password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                                required
                                                placeholder="Confirm new password"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-500 focus:outline-none"
                                                >
                                                    {showPassword ? <AiFillEyeInvisible size={16} /> : <AiFillEye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        Reset my password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}
        </section>
    );
};

export default ForgotPasswordFPO;
