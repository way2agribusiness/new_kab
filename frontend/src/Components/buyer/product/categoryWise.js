import React, { useState, useEffect } from "react";
import LocationFilter from "./locationFilter";
import AllFilter from "./allfilter";
import RelatedProduct from "./relatedProduct";
import Products from "./products";


const CategoriesWiseProducts = ({ user }) => {
    const [searchState, setSearchState] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [category, setCategory] = useState('');

    return (
        <div className="mt-5 mb-5">

            {/* Title */}
            <div className="flex flex-col sm:flex-row justify-between mx-4 sm:mx-10 mb-5">
                <div className="text-xs sm:text-sm whitespace-nowrap mb-2 sm:mb-0 sm:me-5">
                    All Products
                </div>
                <div className="font-bold text-amber-600 text-xs sm:text-sm text-justify">
                    Find the best deals and get personalized assistance to meet your needs.
                </div>
            </div>


            {/* Header filter */}
            <div>
                <LocationFilter
                    setSearchState={setSearchState}
                    setSearchCity={setSearchCity}
                />
            </div>

            <div className="grid md:grid-cols-4 lg:mx-10 gap-5">

                {/* filterations section */}
                <div className="relative col-span-4 md:col-span-1">
                    <AllFilter
                        setCategory={setCategory}
                    />
                </div>


                <div className="col-span-3">

                    {/* Related Product */}
                    {/* <RelatedProduct /> */}


                    {/* Products card */}
                    <div className="col-span-3 mt-4">
                        <Products
                            user={user}
                            searchCity={searchCity}
                            searchState={searchState}
                            category={category}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};
export default CategoriesWiseProducts;