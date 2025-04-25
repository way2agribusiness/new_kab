import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CategoryAlert = ({ onCancel, user }) => {
    const [categories, setCategories] = useState(user && user.categoryID);
    const [selectedcategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const openAddProductForm = () => {
        if (!selectedcategory) {
            setError('Please select a category before proceeding.');
            return;
        }

        try {
            navigate(`/add-new-products/category/${selectedcategory}`);
        } catch (error) {
            console.error('Navigation error:', error);
            setError('An error occurred while navigating to the product form. Please try again.');
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-boxdark-2 p-6 rounded-lg shadow-lg w-80">
                <div className="mb-4">
                    <label className="text-md mb-4">
                        Choose Product Category
                    </label>
                    <select
                     value={selectedcategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                        required
                    >
                        <option value="">Select a one category</option>
                        {categories && categories.map(category => (
                            <option key={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                {error && (
                    <div className="mb-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                    onClick={openAddProductForm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryAlert;
