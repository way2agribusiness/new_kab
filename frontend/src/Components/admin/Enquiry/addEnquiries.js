import React, { useState } from 'react';
import Toast from '../../commons/Toastify';

const AddEnquiries = ({ onConfirm, onCancel }) => {
    const [mobNumber, setMobNumber] = useState('');
    const [description, setDescription] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [productName, setProductName] = useState('');
    const [city, setCity] = useState('');
    const [taluk, setTaluk] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        // Validate fields
        if (!mobNumber || !username || !categoryID || !productName || !city || !taluk) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        // Validate mobile number format
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(mobNumber)) {
            setError('Please enter a valid 10-digit mobile number.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/addEnquiry/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    mobNumber,
                    categoryID,
                    productName,
                    description,
                    city,
                    taluk
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Show success toast
            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Enquiry submitted successfully!',
            });

            // Clear form fields
            setUsername('');
            setMobNumber('');
            setCategoryID('');
            setProductName('');
            setDescription('');
            setCity('');
            setTaluk('');

            // Show the success toast for 1 second, then call onConfirm
            setTimeout(() => {
                onConfirm();
            }, 1000);

        } catch (err) {
            // Show error toast
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to submit the enquiry. Please try again later.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 second

            setError('Failed to submit the enquiry. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="bg-white md:w-[30%] dark:bg-boxdark p-4 rounded-lg shadow-lg max-h-[80vh] overflow-none">
                    <div className="relative"> {/* Set relative positioning for parent */}
                        <h4 className="text-lg mb-4 text-center text-success font-bold">Add Enquiries for seller by category</h4>
                        <i className="absolute top-0 right-0"
                            onClick={onCancel}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 dark:fill-red-500 hover:fill-red-500"
                                viewBox="0 0 320.591 320.591"
                            >
                                <path
                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                    data-original="#000000"></path>
                                <path
                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                    data-original="#000000"></path>
                            </svg>
                        </i>
                    </div>

                    {/* Line 1: Username and Mobile Number */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <input
                                type='text'
                                className="w-full text-sm mb-2 rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                required
                                placeholder="Buyer Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type='number'
                                className="w-full text-sm mb-2 rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                required
                                placeholder="Buyer mob number"
                                value={mobNumber}
                                onChange={(e) => setMobNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Line 2: Category and Product Name */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <select
                                className="w-full text-sm mb-2 rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                value={categoryID}
                                onChange={(e) => setCategoryID(e.target.value)}
                            >
                                <option value="">Select category</option>
                                <option value="AgriInput">Agri Input</option>
                                <option value="AgriOutput">Agri Output</option>
                                <option value="AgriServices">Agri Services</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type='text'
                                className="w-full text-sm mb-2 rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                required
                                placeholder="Enter Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Line 3: Description */}
                    <div className="mb-2">
                        <textarea
                            name="description"
                            placeholder="Describe about product / services (optional)"
                            rows={4}
                            className="w-full text-sm rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Line 4: City and Taluk */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <input
                                type='text'
                                className="w-full text-sm mb-2 rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                required
                                placeholder="Enter Your City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type='text'
                                className="w-full text-sm mb-2 rounded border-[1.5px] border-stroke bg-transparent py-0.5 px-3 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                required
                                placeholder="Enter Your Taluk"
                                value={taluk}
                                onChange={(e) => setTaluk(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 mb-2">{error}</p>} {/* Display error message */}

                    <div className="flex justify-end">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-3 py-1 bg-green-500 rounded-lg text-white hover:bg-green-600"
                            onClick={handleSubmit}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
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

export default AddEnquiries;
