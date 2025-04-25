import React, { useState, useEffect } from "react";
import { AiOutlineControl } from "react-icons/ai";

const AllFilter = ({ setCategory }) => {
    // console.log('sub-slug*** :', subparamsValue);
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [subsubcategories, setSubsubcategories] = useState([]);
    const [selectedSubsubcategory, setSelectedSubsubcategory] = useState('');
    const [subsescategories, setSubsescategories] = useState([]);
    const [selectedSubsescategory, setSelectedSubsescategory] = useState('');



    const getAllCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/category/all`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            if (selectedCategory === '') {
                // Clear category-specific states when 'All Categories' is selected
                setSubcategories([]);
                setSelectedSubcategory('');
                setSubsubcategories([]);
                setSelectedSubsubcategory('');
                setSubsescategories([]);
                setSelectedSubsescategory('');
            } else {
                const category = categories.find(cat => cat._id === selectedCategory);
                if (category) {
                    setSubcategories(category.subcategoriesID);
                    setSelectedSubcategory('');
                    setSubsubcategories([]);
                    setSelectedSubsubcategory('');
                    setSubsescategories([]);
                    setSelectedSubsescategory('');
                    setCategory(category.name);
                } else {
                    // Reset states if no matching category found
                    setSubcategories([]);
                    setSelectedSubcategory('');
                    setSubsubcategories([]);
                    setSelectedSubsubcategory('');
                    setSubsescategories([]);
                    setSelectedSubsescategory('');
                }
            }
        }
    }, [selectedCategory, categories]);

    useEffect(() => {
        if (selectedSubcategory) {
            const subcategory = subcategories.find(sub => sub._id === selectedSubcategory);
            if (subcategory) {
                setSubsubcategories(subcategory.subsubcategoriesID);
                setSelectedSubsubcategory('');
                setSubsescategories([]);
                setSelectedSubsescategory('');
                setCategory(subcategory.name);
            } else {
                setSubsubcategories([]);
                setSelectedSubsubcategory('');
                setSubsescategories([]);
                setSelectedSubsescategory('');
            };
        }
    }, [selectedSubcategory, subcategories]);

    useEffect(() => {
        if (selectedSubsubcategory) {
            const subsubcategory = subsubcategories.find(sub => sub._id === selectedSubsubcategory);
            if (subsubcategory) {
                setSubsescategories(subsubcategory.subsescategoryID);
                setSelectedSubsescategory('');
                setCategory(subsubcategory.name);
            } else {
                setSubsescategories([]);
                setSelectedSubsescategory('');
            }
        }
    }, [selectedSubsubcategory, subsubcategories]);

    useEffect(() => {
        if (selectedSubsescategory) {
            const subsescategory = subsescategories.find(sub => sub._id === selectedSubsescategory);
            if (subsescategory) {
                setCategory(subsescategory.name);
            }
        }
    }, [selectedSubsescategory, subsescategories]);


    return (
        <>
            <div className="flex justify-between mb-2 ms-10 mt-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex bg-success text-white p-2 rounded-md lg:hidden focus:outline-none"
                >
                    <AiOutlineControl className="mt-1 me-2" />
                    Filters
                </button>

                <button
                    onClick={() => setIsOpen(false)}
                    className={`absolute top-2 right-4 p-2 text-gray-600 hover:text-gray-900 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                >
                    <svg className="h-6 w-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div
                className={`bg-white dark:bg-boxdark shadow-md dark:shadow-non text-[10px] py-6 px-2 lg:block ${isOpen ? 'block' : 'hidden'}`}
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                <h4 className="relative text-center text-xl bg-success text-white p-2 rounded">Filterations</h4>

                <nav>
                    <ul>
                        {/* Filter by Category */}
                        <li className="mb-4">
                            <h5 className="text-black dark:text-bodydark font-semibold">Filter by Category</h5>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black dark:text-bodydark bg-white dark:bg-boxdark shadow-md dark:shadow-none">
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </li>

                        {/* Filter by Sub-Category */}
                        <li className="mb-4">
                            <h5 className="text-black dark:text-bodydark font-semibold">Filter by Sub-Category</h5>
                            <select
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black dark:text-bodydark bg-white dark:bg-boxdark shadow-md dark:shadow-none"
                            >
                                <option value="">All Sub-Categories</option>
                                {subcategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </li>

                        {/* Filter by Sub-Sub-Category */}
                        <li className="mb-4">
                            <h5 className="text-black dark:text-bodydark font-semibold">Filter by SubSub-Category</h5>
                            <select
                                value={selectedSubsubcategory}
                                onChange={(e) => setSelectedSubsubcategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black dark:text-bodydark bg-white dark:bg-boxdark shadow-md dark:shadow-none">
                                <option value="">All SubSub-Categories</option>
                                {subsubcategories.map(sub => (
                                    <option
                                        key={sub._id} value={sub._id}
                                        className={`${sub.subsescategoryID.length > 0 ? 'block' : 'hidden'}`}
                                    >
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </li>

                        {/* Filter by Subses-Category */}
                        <li className="mb-4">
                            <h5 className="text-black dark:text-bodydark font-semibold">Filter by Subses-Category</h5>
                            <select
                                value={selectedSubsescategory}
                                onChange={(e) => setSelectedSubsescategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black dark:text-bodydark bg-white dark:bg-boxdark shadow-md dark:shadow-none">
                                <option value="">All Subses-Categories</option>
                                {subsescategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AllFilter;
