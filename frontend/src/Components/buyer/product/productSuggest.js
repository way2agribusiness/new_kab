import React from "react";
import Products from "./products";
import { Link } from "react-router-dom";

const ProductSuggetions = ({ user, isproPage }) => {
    return (
        <div className=" lg:mx-50 p-4 mb-5 bg-white dark:bg-boxdark-2 shadow-md dark:shadow-none">
            <div className="flex space-x-5 mb-2">
                <h3 className="text-xl font-bold">Products You May Like</h3>
                <span>
                    <Link to="/products" className="text-[12px] text-success hover:underline">
                        View All
                    </Link>
                </span>
            </div>
            <div>
                <Products user={user} isproPage={isproPage} />
            </div>
        </div>
    )
};
export default ProductSuggetions;