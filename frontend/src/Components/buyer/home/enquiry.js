import React, { useState } from "react";
import { MdOutlineChat, MdOutlinePermPhoneMsg } from "react-icons/md";
import { LiaRocketchat } from "react-icons/lia";
import Toast from "../../commons/Toastify";
import { useAsyncValue, useNavigate } from "react-router-dom";

const EnquiryBuyer = ({ buyerID }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!productName.trim()) {
            setError('Product name is required.');
            return false;
        }
        if (!categoryID.trim()) {
            setError('Please select a product category.');
            return false;
        }
        if (!description.trim()) {
            setError('Please provide a description.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent form submission causing a page reload
        setLoading(true);
        setError('');

        if (!buyerID) {
            // alert('PLease login first..!!');
            setToast({
                show: true,
                type: 'info',
                title: 'info',
                message: 'Please Login First!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                setToast({ show: false });
                navigate('/login');
            }, 1000);
            setLoading(false);
            return;
        }

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productName,
                    description,
                    categoryID,
                    buyerID
                })
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Bad request. Please check your input.');
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const data = await response.json();

            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Enquiry submitted successfully!',
            });

            setProductName('');
            setDescription('');
            setCategoryID('');

            setTimeout(() => {
                setToast({ show: false });
            }, 1000);

        } catch (err) {
            console.error('Error:', err.message);

            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: err.message || 'Failed to submit the enquiry. Please try again later.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000);

            setError(err.message || 'Failed to submit the enquiry. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div id="enquiry" data-aos="fade-up" className='flex flex-col md:flex-row w-full bg-white dark:bg-boxdark-2'>
                <div className='dark:bg-boxdark-2 dark:text-bodydark w-full md:w-1/2'>
                    <h2 className='text-lg font-medium text-center mt-10'>Get your <span className='text-green-700 font-bold text-xl'>Agri</span> Products in 3 easy steps</h2>
                    <div className='grid lg:grid-cols-3 gap-3 mt-5 justify-center text-success'>
                        <section className='bg-white dark:bg-boxdark shadow-md dark:shadow-none  rounded-lg  px-2 mx-2'>
                            <p className='text-center p-2'>Step 1</p>
                            <div className='text-center'>
                                <MdOutlineChat className="lg:text-8xl text-6xl ms-5 text-black dark:text-bodydark" />
                            </div>
                            <div className='pb-4'>
                                <span className=''>Post Anything you want</span>
                            </div>
                        </section>
                        <section className='bg-white dark:bg-boxdark shadow-md dark:shadow-none  rounded-lg  px-2 mx-2'>
                            <p className='text-center p-2'>Step 2</p>
                            <div className='text-center'>
                                <LiaRocketchat className="text-8xl ms-5 text-black dark:text-bodydark" />
                            </div>
                            <div className='pb-4'>
                                <span className=''>Get Response from sellers</span>
                            </div>
                        </section>
                        <section className='bg-white dark:bg-boxdark shadow-md dark:shadow-none  rounded-lg  px-2 mx-2'>
                            <p className='text-center p-2'>Step 3</p>
                            <div className='text-center'>
                                <MdOutlinePermPhoneMsg className="text-8xl ms-5 text-black dark:text-bodydark" />
                            </div>
                            <div className='pb-4'>
                                <span className=''>Contact and make yours</span>
                            </div>
                        </section>
                    </div>
                    <div className="mt-20 px-10">
                        <h4 className="md:text-3xl text-xl mb-8">Get <b className="text-success">free</b> quotes from multiple sellers</h4>
                    </div>
                </div>

                <div className='dark:bg-boxdark-2 dark:text-bodydark w-full md:w-1/2 mr-3'>
                    <h2 className='text-xl font-medium text-center mt-10 mb-5'>Drop your <span className='text-green-700 font-bold text-xl'>Requirement</span> to different Agriculture Suppliers</h2>

                    <div className='mb-10 mx-5 shadow-lg bg-gray-200 border rounded-lg'>
                        <div className="text-center m-5">
                            <form>
                                <input
                                    className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                    required
                                    placeholder="Product Name / Service Name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />

                                <select
                                    className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                    value={categoryID}
                                    onChange={(e) => setCategoryID(e.target.value)}
                                >
                                    <option value="">select your product category</option>
                                    <option value="66e027779a85da0e0efacc95">Agri Input</option>
                                    <option value="66e027839a85da0e0eface43">Agri Output</option>
                                    <option value="66e027849a85da0e0eface7a">Agri Services</option>
                                </select>

                                <div>
                                    <textarea
                                        type="text"
                                        name="description"
                                        placeholder='Describe about product / services'
                                        rows={5}
                                        className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {error && <p className="text-red-500 mb-3">{error}</p>}

                                <button
                                    className=" w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-all bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Post Requirement'}
                                </button>
                            </form>
                        </div>
                    </div>
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

export default EnquiryBuyer;
