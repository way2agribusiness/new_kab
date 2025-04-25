import React from "react";
import CategorySection from "./categorySection";
import ProductSuggetions from "../product/productSuggest";
import CategorySuggetions from "../product/categorySuggest";
import SearchBox from "./searchbox";
import { Helmet } from "react-helmet";


const Home = ({ user, isproPage }) => {

    return (
        <>
            <Helmet>
                <title>
                    Agribusiness platform, Agri inputs, output & services,
                    High-quality agri inputs & farm machineries, extension services for farmers,
                    agribusiness platform for stakeholders
                </title>
                <meta
                    name="description"
                    content="Agri inputs, Agri output and Agri services: High-quality fertilizers, pesticides, 
                farm machinery, implements & expert consultancy for sustainable farming"
                />
                <meta
                    name="keywords"
                    content="Agri Inputs, Agri Output, Agri services, Agribusiness platform,
                    one-stop agri solutions for farmers, best quality agricultural produce, 
                    opportunities for agri service providers to connect with farmers"
                />
                <meta
                    name="robots"
                    content="index, follow"
                />
                <meta property="og:description" content="Karnataka Agribusiness is a agribusiness platform connecting farmers, vendors, and service providers in the agricultural ecosystem. 
                We offer high-quality agri inputs, expert consultancy, and efficient management solutions to enhance productivity and sustainability in farming. Our platform supports farmers with resources and services that drive profitability, from organic fertilizers to advanced farm machinery, 
                making agricultural operations more efficient." />
            </Helmet>

            {/* Hero Section */}
            <section>
                <img
                    src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1735623001/KAB-web-banner-update_es9uvx.png"
                    alt="home.pic"
                    className="object-cover"
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                />
            </section>

            <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                <div className="p-5">
                    <p className="mb-3 text-justify">
                        Karnataka Agribusiness is a comprehensive platform that seamlessly connects farmers, suppliers, and service providers to enhance agricultural productivity and profitability. Vendors on the platform offer high-quality fertilizers, pesticides, farm machinery, equipment, seeds, and plants to support efficient farming. Additionally, the platform facilitates the sale of agricultural produce, including fruits, vegetables, and groceries, ensuring better market access and transparent transactions for farmers.
                    </p>
                    <p className="text-justify">
                        By integrating agricultural inputs, outputs, and services, Karnataka Agribusiness fosters a sustainable and cooperative ecosystem. Farmers benefit from professional consulting, marketing support, and on-farm services, while suppliers and service providers gain access to a larger customer base. With a user-friendly interface, personalized product recommendations,
                        and seamless navigation, the platform enhances the overall experience for all stakeholders.
                        Karnataka Agribusiness is committed to empowering farmers, suppliers, and buyers by creating a dynamic, transparent, and efficient network built on sustainability and trust. Whether farmers seek essential resources or sellers aim to expand their reach, Karnataka Agribusiness serves as the ideal platform for growth and long-term success.
                    </p>
                </div>
            </div>

            <SearchBox />

            {/* Category Sections */}
            <div>
                <CategorySection />
            </div>

            {/* Product You May Like Sections */}
            <div>
                <ProductSuggetions user={user} isproPage={isproPage} />
            </div>

            {/* Categories You May Like Sections */}
            <div>
                <CategorySuggetions />
            </div>
        </>
    );
};

export default Home;
