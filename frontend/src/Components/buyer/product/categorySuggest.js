import React from "react";
import { Link } from "react-router-dom";

const categories = [
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646110/images_10_cqzdei.jpg",
        title: "Irrigation",
        altText: "Irrigation",
        category: "AgriInput"
    },
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646192/360_F_87624930_7n7NgLCFHff7IGr85DCgOcE2aPunov2m_fymeha.jpg",
        title: "Fertilizer",
        altText: "Fertilizer",
        category: "AgriInput"
    },
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646246/spray-ecological-pesticide-farmer-fumigate-protective-suit-mask-lemon-trees-man-spraying-toxic-pesticides-insecticides-184466768_jyf3pm.webp",
        title: "Pesticides",
        altText: "Pesticides",
        category: "AgriInput"
    },
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646287/images_ldstyf.jpg",
        title: "Farm-Machinery",
        altText: "Farm-Machinery",
        category: "AgriInput"
    },
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646334/1-1024x671_w4x1pz.jpg",
        title: "Agritech-Solutions",
        altText: "Agritech-Solutions",
        category: "AgriInput"
    },
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646381/images_1_inpqpd.jpg",
        title: "Implements",
        altText: "Implements",
        category: "AgriInput"
    },
    {
        image: "https://res.cloudinary.com/dm71xhdxd/image/upload/v1728646428/luannan-county-china-january-14-260nw-2082085021_hadlee.webp",
        title: "OFF-Farms",
        altText: "OFF-Farms",
        category: "AgriServices"
    }
];

const CategorySuggestions = () => {
    return (
        <div className="lg:mx-5 p-4 mb-5 bg-white dark:bg-boxdark-2 shadow-md dark:shadow-none">
            <div className="flex space-x-5 mb-2">
                <h3 className="text-xl font-bold">Categories You May Like</h3>
                <span>
                    <Link
                        to="/products"
                        className="text-[12px] text-success hover:underline"
                    >
                        View All
                    </Link>
                </span>
            </div>
            <div>
                <div className="grid grid-cols-2 lg:grid-cols-7 md:grid-cols-3 mx-auto gap-4">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-boxdark shadow-lg rounded-lg p-1 lg:w-40 text-sm cursor-pointer"
                        >
                            <Link
                                to={`/${category.category}/${category.altText}`}
                                className="text-center"
                            >
                                <div className="overflow-hidden mb-5">
                                    <img
                                        src={category.image}
                                        alt={category.altText}
                                        className="mx-auto mb-2 transform hover:scale-125 transition-transform duration-300"
                                        style={{ width: '100%', height: '100px' }}
                                    />
                                </div>
                                <div>
                                    <Link
                                        to={`/${category.category}/${category.altText}`}
                                        className="font-semibold hover:text-success"
                                    >
                                        {category.title}
                                    </Link>
                                </div>
                            </Link>
                            <button className="bg-green-500 text-white px-4 py-1 mt-5 font-bold w-full rounded hover:bg-green-600 transition">
                                <a href="#enquiry">Get Quotes</a>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategorySuggestions;
