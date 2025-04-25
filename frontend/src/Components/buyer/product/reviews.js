import React, { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';
import Toast from '../../commons/Toastify';

const Reviews = ({ closeForm, userID, productId }) => {
    const [serviceRating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [hover, setHover] = useState(0);
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const [errors, setErrors] = useState({ description: '', rating: '' });

    // Function to handle setting the rating based on the star clicked
    const handleRating = (rate) => {
        setRating(rate);
    };

    const validateForm = () => {
        const newErrors = { description: '', rating: '' };

        if (!serviceRating) {
            newErrors.rating = 'Please select a rating.';
        }

        if (!description.trim()) {
            newErrors.description = 'Description cannot be empty.';
        } else if (description.length < 4) {
            newErrors.description = 'Description must be at least 4 characters long.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === ''); // Returns true if there are no errors
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return; // Exit if validation fails
        }

        try {
            const RatingData = {
                rating: serviceRating,
                description: description,
                userID: userID
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/ratings/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(RatingData),
            });

            const serRes = await response.json();

            if (response.ok) {
                setDescription('');
                setRating(0); // Reset rating to 0 after submission

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Rating submitted successfully',
                });

                setTimeout(() => {
                    closeForm();
                    setToast({ show: false });
                }, 1000);

            } else {
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to submit Rating',
                });

                setTimeout(() => {
                    setToast({ show: false });
                }, 1000);
            }
        } catch (error) {
            console.error('Error submitting Rating:', error);
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'An error occurred while submitting Rating. Please try again later.',
            });

            setTimeout(() => {
                setToast({ show: false });
            }, 1000);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
                <div className="w-full me-3 max-w-lg bg-white dark:bg-boxdark shadow-lg rounded-lg p-6 relative">
                    <div className="flex items-center pb-3 border-b border-gray-300">
                        <h3 className="text-success text-xl text-center font-bold flex-1">Ratings</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
                            viewBox="0 0 320.591 320.591"
                            onClick={closeForm}
                        >
                            <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                data-original="#000000"></path>
                            <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                data-original="#000000"></path>
                        </svg>
                    </div>

                    <div className="my-6">
                        <div>
                            <textarea
                                type="text"
                                name="description"
                                placeholder='Rating and Comments...'
                                rows={5}
                                className={`w-full mb-3 rounded border-[1.5px] 
                                ${errors.description ? 'border-red-500' : 'border-stroke'} 
                                bg-transparent py-3 px-5 text-black outline-none transition
                                 focus:border-success dark:border-form-strokedark dark:bg-form-input
                                  dark:text-white dark:focus:border-success`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description}</p>
                            )}
                        </div>
                        <div className="flex items-center justify-center my-4">
                            {/* Rating icons */}
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = (index + 1) * 1; // To set the integer values for each star
                                const halfStarValue = ratingValue - 0.5; // Half star value

                                return (
                                    <span key={index} className="relative">
                                        {/* Full Star */}
                                        <FaRegStar
                                            className={`me-2 cursor-pointer transition-colors duration-200 p-1 rounded-full 
                                        ${serviceRating >= ratingValue || hover >= ratingValue
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-gray-200'
                                                }`}
                                            size={32}
                                            onClick={() => handleRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                        {/* Half Star */}
                                        <FaRegStar
                                            className={`cursor-pointer absolute top-0 left-0 transition-colors duration-200 p-1 rounded-full
                                        ${serviceRating >= halfStarValue || hover >= halfStarValue
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-gray-200'
                                                }`}
                                            size={32}
                                            onClick={() => handleRating(halfStarValue)}
                                            onMouseEnter={() => setHover(halfStarValue)}
                                            onMouseLeave={() => setHover(0)}
                                            style={{ clipPath: 'inset(0 50% 0 0)' }} // Clips half of the star
                                        />
                                    </span>
                                );
                            })}
                        </div>
                        <p className="text-center text-lg text-black dark:text-white mt-2">
                            Your Rating: {serviceRating}
                        </p>
                        {errors.rating && (
                            <p className="text-red-500 text-sm text-center">{errors.rating}</p>
                        )}
                    </div>

                    <div className="border-t border-gray-300 pt-6 flex justify-end gap-4">
                        <button
                            onClick={closeForm}
                            className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-green-600 hover:bg-green-700 active:bg-green-600">
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast notification */}
            {toast.show && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-9999">
                    <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                </div>
            )}
        </>
    );
};

export default Reviews;
