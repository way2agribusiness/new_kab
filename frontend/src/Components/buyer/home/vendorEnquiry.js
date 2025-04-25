import React, { useState } from 'react';
import Toast from '../../commons/Toastify';

const VendorEnquiry = ({ onConfirm, onCancel, vendorID, categoryID, buyerID, productName }) => {
    const [mobNumber, setMobNumber] = useState('');
    const [description, setDescription] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async () => {
        setLoading(true);
        setError('');


         // Validate mobile number
         if (!mobNumber) {
            setError('Mobile number is required.');
            setLoading(false);
            return;
        }

        // Validate mobile number format (optional)
        const phoneRegex = /^[0-9]{10}$/; // Adjust regex as per your requirements
        if (!phoneRegex.test(mobNumber)) {
            setError('Please enter a valid 10-digit mobile number.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_ENQ}/vendor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vendorID,
                    productName,
                    description,
                    categoryID,
                    buyerID,
                    mobNumber
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Show the success toast
            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Enquiry submitted successfully!',
            });

            setMobNumber('');
            setDescription('');

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                onConfirm();
            }, 1000);

        } catch (err) {

            // Show the error toast
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to submit the enquiry. Please try again later.',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                setToast({ show: false });
            }, 1000); // Hide toast after 1 seconds

            setError('Failed to submit the enquiry. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white md:w-[50%] dark:bg-boxdark p-6 rounded-lg shadow-lg">
                    <h4 className="text-lg mb-4 text-center text-success font-bold">Tell us your product requirement to direct seller</h4>
                    <div>
                        <input
                            type='number'
                            className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                            required
                            placeholder="Your mobile number"
                            value={mobNumber}
                            onChange={(e) => setMobNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            type="text"
                            name="description"
                            placeholder='Describe about product / services (optional)'
                            rows={5}
                            className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 mb-3">{error}</p>} {/* Display error message */}
                    <div className="flex justify-end">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600"
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

export default VendorEnquiry;
