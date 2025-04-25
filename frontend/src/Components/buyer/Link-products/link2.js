import React, { useEffect, useState } from "react";
import { BiSolidPhoneCall } from "react-icons/bi";
import Spinner from "../product/loading";
import VendorEnquiry from "../home/vendorEnquiry";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../../commons/Toastify";
import { Link2SEO } from "./SEO";

const LinkProducts2 = ({ user }) => {
    const { subslug } = useParams();  // Get all params: slug, subslug, subsubslug

    const [searchTerm, setSearchTerm] = useState(subslug || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(12); // Number of products per page
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isVendorEnquiryOpen, setIsVendorEnquiryOpen] = useState(false);
    const [vendorID, setVendorID] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [productName, setProductName] = useState('');

    const [viewPhone, setViewPhone] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (subslug) {
            setSearchTerm(subslug);
        }
    }, [subslug])

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                size: itemsPerPage,
                searchString: searchTerm,
            }).toString();

            const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/products?${queryParams}`);
            const serRes = await response.json();

            if (response.ok) {
                setProducts(serRes.data || []);
                setTotalPages(serRes.pagination ? serRes.pagination.totalPages : 1);

            } else {
                setError(serRes.message || "Failed to fetch products");
            }

        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />; // Show spinner while loading
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Delay the scroll action slightly
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0); // You can adjust the delay if necessary
    };

    // Function to get the token from local storage
    const getToken = () => localStorage.getItem('token');

    const viewNumber = (productId) => {
        const token = getToken();

        if (!token) {
            // Show the success toast
            setToast({
                show: true,
                type: 'info',
                title: 'info',
                message: 'Please Login First!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                navigate('/login');
            }, 1000);
            return;
        }
        setViewPhone(prevId => prevId === productId ? null : productId);
    };

    const sendEnquiry = (vendorID, categoryID, title) => {
        const token = getToken();

        if (!token) {
            // Show the success toast
            setToast({
                show: true,
                type: 'info',
                title: 'info',
                message: 'Please Login First!',
            });

            // Show the success toast for 1 seconds, then navigate
            setTimeout(() => {
                navigate('/login');
            }, 1000);
            return;
        }

        setIsVendorEnquiryOpen(true);
        setVendorID(vendorID);
        setCategoryID(categoryID);
        setProductName(title);
    };

    const handleClick = (productId) => {
        localStorage.setItem('productId', productId);
    };

    // Descriptions based on subslug
    const getDescription = (subslug) => {
        switch (subslug) {
            case 'Seeds-and-Plants':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a comprehensive range of high-quality agricultural and horticultural products to support farmers, vendors, and service providers. Our selection includes high-yield vegetable seeds for crops like tomatoes, cucumbers, and chilies, as well as ornamental plants for beautiful gardens. We also provide essential plants such as arecanut, coconut, and pepper, all sourced from trusted companies like Ashoka Seeds. To ensure healthy plant growth, we offer premium growing media, including eco-friendly coco peat, nutrient-rich vermiculite, organic compost, and balanced potting mixes, designed to optimize yields.
                            </p>
                            <p className="text-justify">
                                In addition, we provide versatile plant containers, including durable plastic pots, stylish indoor plant containers, and practical grow bags, making them suitable for both personal and commercial use. For added protection, we offer shade nets and polyfilms to safeguard plants from pests, harsh weather, and environmental stress. With a focus on quality, we partner with renowned nurseries and seed suppliers to provide premium products at competitive prices. Whether you're growing crops or enhancing your garden, Karnataka Agribusiness is your one-stop platform, offering expert guidance and comprehensive solutions to meet all your agricultural and horticultural needs.
                            </p>
                        </div>
                    </div>
                );
            case 'Irrigation':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer advanced irrigation systems and products designed to optimize water usage and enhance agricultural productivity. Our extensive range includes high-quality fertilizer tanks, sand filters, disk filters, hydro cyclone filters, drip lateral pipes, micro sprinklers, rain guns, and reliable water pumps from trusted suppliers like Sujay, Mobitech, and Rivulis. We provide a variety of irrigation systems to suit different needs, including drip irrigation, sprinkler irrigation, fertigation systems, and hydraulic pump systems. Our fertigation solutions deliver precise nutrient application directly to crops, improving efficiency while minimizing waste.
                            </p>
                            <p className="text-justify">
                                For flexible irrigation, we offer drip lateral pipe systems, micro sprinkler systems, and lay flat hoses that ensure uniform water distribution. Additionally, our water pumps, including hydraulic and agricultural pumps, are designed to ensure a consistent and reliable water flow across your farm. Fertigation systems seamlessly combine irrigation and fertilization to ensure optimal crop nutrition and improve overall farm performance. Whether you're a small-scale grower or managing large commercial operations, our irrigation systems are tailored to meet your needs. Focused on quality, sustainability, and cost-effectiveness, we empower farmers to achieve greater yields while conserving water. Explore our advanced irrigation solutions today to revolutionize your farm’s water management.
                            </p>
                        </div>
                    </div>
                );
            case 'Fertilizer':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a diverse range of organic, bio, and inorganic fertilizers designed to enhance soil fertility and boost crop yields. Our products cater to various farming needs, promoting sustainable agriculture and fostering healthy plant growth. Our organic and bio fertilizers, including Dr. Soil Health Areca Special, Bio NPK, Bio Potash, and Python-T, improve soil structure, enhance microbial activity, and support eco-friendly farming practices. These fertilizers provide balanced nutrients, improve long-term soil health, and reduce reliance on chemical inputs, promoting sustainability.
                            </p>
                            <p className="text-justify">
                                For more immediate nutrient needs, we also offer inorganic fertilizers like Calsan and Borosan. These fertilizers deliver quick and effective nutrients to plants, ensuring optimal growth and crop performance. Liquid bio fertilizers like Python-T offer fast absorption and efficient application through fertigation or foliar spray, reducing waste and improving results. We collaborate with trusted suppliers such as Samarth and Amruth Organics to ensure our fertilizers meet the highest quality standards. Our fertilizers are designed to improve soil health, increase nutrient availability, and maximize yields for a wide range of crops. Choose Karnataka Agribusiness for sustainable, high-quality solutions that boost farm productivity and promote eco-friendly farming.
                            </p>
                        </div>
                    </div>
                );
            case 'Pesticides':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a wide range of bio pesticides, organic pest control solutions, and chemical pesticides to ensure healthy crop growth and high yields. Our products are designed to cater to both small farms and large orchards, providing effective pest control while promoting sustainable farming practices. Our bio and organic pesticides, including Power Plus, Alnym, Alderm, Navarathna, Samrakshak, and Almonas, are derived from natural sources and are eco-friendly. These solutions are ideal for sensitive crops like areca nut and vegetables, offering safe pest control with minimal environmental impact. For farmers focused on sustainability, these organic solutions support healthy ecosystems while ensuring effective pest management.
                            </p>
                            <p className="text-justify">
                                For more immediate pest control, we also offer chemical pesticides that deliver rapid action to manage severe infestations, especially in large orchards and commercial farms. These chemical solutions complement our organic pesticides, forming an integrated pest management approach. We partner with trusted suppliers like Amruth Organics and Samarth to provide high-quality pest control products. Our expert team is available to help you select the right pesticide based on the type of pest, crop, and environmental conditions. Whether you choose organic or chemical pesticides, Karnataka Agribusiness offers reliable solutions to improve crop health, increase yields, and support sustainable farming practices.
                            </p>
                        </div>
                    </div>
                );
            case 'Farm-Machinery':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a wide range of farm machinery designed to improve the efficiency and productivity of your farming operations. Our selection includes essential tools such as de-weeders, sprayers, harvesters, and maintenance equipment, catering to the needs of both small and large-scale farmers. Our de-weeders, including brush cutters and power weeders from trusted brands like Texas, Honda, and Makita, are perfect for efficient weed control. These machines save valuable time and labor, with both manual and automatic options available for all types of farms.
                            </p>
                            <p className="text-justify">
                                We also provide a range of sprayers, including HTTP sprayers, power sprayers, battery sprayers, and portable sprayers, designed to ensure accurate and effective application of pesticides and fertilizers, minimizing waste and maximizing crop protection. In addition to these, we offer maintenance tools like lawn mowers, concrete vibrators, pole saws, earth augers, and chain saws to keep your machinery running smoothly. For harvesting, we provide high-performance tractor-mounted and self-propelled harvesters that help reduce labor costs and increase productivity during peak harvest periods. By investing in high-quality farm machinery from trusted brands, farmers can improve efficiency, cut costs, and boost crop yields. Explore our platform to find the right tools for your farm.
                            </p>
                        </div>
                    </div>
                );
            case 'Agritech-Solutions':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we are dedicated to transforming agriculture with cutting-edge agri-tech solutions. Our advanced technologies, including AI-powered farming robots, drones, and precision farming products, enhance efficiency, reduce resource usage, and maximize yields. These innovations revolutionize farming by increasing precision, minimizing labor dependency, and optimizing operations.
                                Our AI-powered farming robots automate essential tasks like weeding, planting, and harvesting, reducing manual labor while ensuring accuracy. Drones equipped with advanced sensors and GPS technology play a crucial role in crop monitoring, pest control, and targeted spraying, improving plant health and resource management.
                            </p>
                            <p className="text-justify">
                                We also offer a comprehensive suite of precision farming products, including soil sensors, weather monitoring systems, yield mapping tools, and smart irrigation systems. These tools help farmers make data-driven decisions, optimizing planting, fertilization, and irrigation schedules. By integrating these technologies, farmers can improve productivity, conserve resources, and achieve sustainable farming.
                                At Karnataka Agribusiness, our goal is to equip farmers with the latest innovations to boost efficiency and profitability. By leveraging AI, automation, and precision agriculture, we empower farmers to embrace modern practices, ensuring long-term success and sustainability in the ever-evolving agricultural landscape.

                            </p>
                        </div>
                    </div>
                );
            case 'Primary-Processing':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a wide range of primary processing equipment for farms, including high-quality chaff cutters, milking machines, and wood chippers, designed to enhance farm productivity. These essential tools help farmers operate efficiently and maximize yields. Our chaff cutter is crucial for livestock farming, efficiently transforming fodder into easily digestible pieces, promoting better digestion, and reducing waste. The Bushra brand chaff cutter is known for its adjustable blades, durability, and cost-effectiveness, making it an ideal choice for modern farms. Milking machines are another vital addition, streamlining dairy operations by allowing farmers to milk multiple animals simultaneously.
                            </p>
                            <p className="text-justify">
                                With advanced features from Kisan Dairy, our milking machines offer faster milking, improved hygiene, and enhanced animal comfort. For sustainable farming, our wood chipper helps reduce farm waste by turning bulky materials into valuable resources like mulch or compost, benefiting both farm operations and soil health. Our chaff cutter, milking machine, and wood chipper are designed for the needs of modern farms. Karnataka Agribusiness ensures access to trusted brands and expert support to help farmers select the best primary processing equipment. Visit us today to boost your farm's productivity with the right tools for success.
                            </p>
                        </div>
                    </div>
                );

            case 'Power-and-Energy':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a variety of reliable energy solutions tailored to meet the unique needs of modern farming. Whether it's backup power during outages or efficient energy for your machinery, we provide top-quality products to ensure your farm operates smoothly. Our Honda portable generators are compact, fuel-efficient, and reliable, making them perfect for small to medium-sized farms. With easy portability and quiet operation, these generators ensure uninterrupted power for irrigation, lighting, and other essential farm activities. We also provide durable, fuel-efficient engines that power a wide range of agricultural machinery, including irrigation pumps and tractors.
                            </p>
                            <p className="text-justify">
                                Designed for tough conditions, these engines ensure efficient performance with minimal downtime, so you can focus on running your farm effectively. For farmers looking for a sustainable option, we offer solar-powered engines that reduce operational costs and environmental impact. These eco-friendly solutions provide energy independence, especially in remote areas, while minimizing maintenance needs. At Karnataka Agribusiness, our goal is to empower farmers with reliable and cost-effective energy solutions that boost productivity and promote sustainability. With trusted brands like Honda and cutting-edge solar technologies, we offer the energy solutions you need to keep your farm running efficiently while embracing a greener future.
                            </p>
                        </div>
                    </div>
                );
            case 'Implements':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we provide a complete range of garden tools, attachments, equipment, and fencing materials to enhance farming and gardening efficiency. Whether managing a small home garden or a large farm, our high-quality tools cater to diverse agricultural needs.
                                Our selection includes essential tools such as sickles, khurpis, kudalis, hand weeders, and coconut de-huskers, designed for harvesting, weeding, soil aeration, and digging. Built for durability and ease of use, these tools help farmers and gardeners work efficiently. For larger tasks, we offer tractor attachments, garden sprayers, rotavators, and post-hole diggers to streamline farming operations, saving time and effort while ensuring healthy crops.
                            </p>
                            <p className="text-justify">
                                Fencing is crucial for farm security, and we provide durable, eco-friendly solutions like wire fences, electric fences, and wooden posts to protect crops. Our fencing materials are strong, reliable, and sustainable. Additionally, we offer essential gardening accessories, including gloves, watering cans, wheelbarrows, and pruning shears, ensuring a complete farming setup.
                                At Karnataka Agribusiness, we focus on providing efficient, reliable, and environmentally conscious solutions. Our products empower farmers and gardeners to achieve optimal results. Explore our collection today and equip yourself with the right tools for successful and sustainable farming and gardening.
                            </p>
                        </div>
                    </div>
                );
            case 'Vegetables':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we are dedicated to providing fresh, nutrient-rich vegetables to support a healthy lifestyle. Our diverse selection includes staple vegetables, leafy greens, and exotic varieties, ensuring a balanced diet for every household.
                                We offer nutritious vegetables like brinjal, rich in fiber and antioxidants, and carrots, packed with beta-carotene for improved vision and skin health. Chillies add spice while supplying vitamins A and C, while beans serve as a high-protein, fiber-rich addition to your meals. Ginger aids digestion and boosts immunity, and lemons provide vitamin C for enhanced immune support.
                            </p>
                            <p className="text-justify">
                                Our leafy greens include coriander, curry leaves, chakota leaf, and palak (spinach), all loaded with essential vitamins, minerals, and antioxidants to promote digestion, strengthen immunity, and improve overall well-being.
                                For added variety and nutrition, we offer exotic vegetables like baby corn, broccoli, capsicum, and milky mushrooms. These unique options are packed with fiber, vitamins, and antioxidants that support overall health.
                                By incorporating our fresh, seasonal vegetables into your meals, you can improve digestion, boost immunity, support protein intake, and enhance skin health. Choose Karnataka Agribusiness for high-quality, farm-fresh vegetables that contribute to a healthier, more nutritious lifestyle.

                            </p>
                        </div>
                    </div>
                );
            case 'Fruits':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a wide variety of fresh, nutritious fruits that are carefully selected to support a healthy lifestyle. Our selection includes common fruits like bananas, oranges, and papayas, each rich in essential vitamins, minerals, and antioxidants. Bananas provide potassium and fiber, promoting heart health and aiding digestion, while oranges, packed with vitamin C, help boost immunity. Papayas are known for their digestive benefits and high vitamin content, supporting skin health and overall immunity. These everyday fruits form the foundation of a balanced diet.
                            </p>
                            <p className="text-justify">
                                We also provide seasonal favorites such as mangoes, jackfruit, grapes, and watermelon, which are packed with flavor and nutrients at their peak. Mangoes, rich in vitamins A and C, promote healthy skin and immunity, while jackfruit supports digestion and immunity with its fiber and potassium content. Grapes and watermelon are hydrating fruits that are rich in antioxidants, benefiting heart health. For those seeking something unique, our exotic fruit selection includes dragon fruit, figs, cherries, kiwi, and strawberries, offering a delightful twist to your diet with their high fiber, vitamin, and antioxidant content. Incorporating these fresh fruits into your meals, smoothies, or snacks can boost hydration, immunity, and overall well-being.
                            </p>
                        </div>
                    </div>
                );
            case 'Groceries':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer a diverse selection of high-quality grains, pulses, millets, spices, and condiments to enhance your cooking experience. Our range includes essential grains like basmati rice, Bengal gram, and finger millets, all of which provide vital nutrients that support heart health, improve digestion, and promote overall well-being. Whether you're preparing traditional dishes or exploring new recipes, our premium ingredients will elevate your meals and taste. Additionally, our protein-rich pulses, such as chickpea dal and Bengal gram, are perfect for vegan and vegetarian diets, offering fiber, vitamins, and a rich flavor to curries, soups, and salads.
                            </p>
                            <p className="text-justify">
                                We also offer a variety of flavorful spices like black pepper, cinnamon, and dry ginger, which not only enhance the taste of your dishes but also offer health benefits like improved digestion and boosted immunity. Our collection of healthy oil seeds, including almonds, cashews, pistachios, mustard seeds, and cardamom, provides healthy fats and protein for cooking or snacking. Shop with us for premium ingredients and enjoy the convenience of bulk grocery shopping, all while preparing delicious, nutritious meals for you and your family.
                            </p>
                        </div>
                    </div>
                );
            case 'Off-Farms':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                At Karnataka Agribusiness, we offer professional project management consultancy services tailored to the agribusiness sector. Our expert team supports farmers, vendors, and service providers in overcoming the complexities of agricultural business development. We provide a range of solutions, including detailed project reports (DPR), government subsidies, marketing support, and technology identification, ensuring your agribusiness is set up for long-term success. Our end-to-end consultancy covers everything from project planning and crop selection to securing bank funding and managing labor supply, helping businesses make informed decisions that promote growth and profitability.
                            </p>
                            <p className="text-justify">
                                Our detailed project reports include in-depth market analysis, technological requirements, and financial projections to ensure your agribusiness is well-prepared. We help you adopt the most suitable technologies to improve operational efficiency and sustainability. With our expertise in navigating government subsidies, we guide you through the application process to secure financial support. Our marketing services help you effectively promote your agribusiness and reach your target audience. Additionally, we assist in crop planning, selection, and securing bank funding to ensure your business thrives. By optimizing operations and providing skilled labor support, we help you streamline your agribusiness for long-term success.
                            </p>
                        </div>
                    </div>
                );
            case 'On-Farms':
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                Karnataka Agribusiness is committed to enhancing farm productivity and sustainability with a range of specialized services, including Field Intel management, expert field visits, and project management consultancy. Our Field Intel Management solution uses data-driven technology to provide real-time insights on soil health, weather patterns, crop conditions, and other key factors. This allows farmers to make informed decisions on irrigation, pest control, fertilization, and crop planning, improving overall yields and reducing losses. In addition to this, our Field Visits offer hands-on support from agricultural experts who evaluate your farm’s progress, monitor crop health, and provide customized solutions to address any challenges.
                            </p>
                            <p className="text-justify">
                                Furthermore, our Project Management Consultancy ensures that farmers receive comprehensive support in planning, budgeting, and executing agricultural projects. From initial project design to resource allocation and monitoring, our consultants ensure smooth operations and efficient farm management. By integrating these services, farmers can enhance decision-making, increase productivity, optimize resources, and reduce costs. We focus on sustainability by promoting environmentally-friendly practices, improving farm efficiency, and helping farmers achieve long-term profitability. At Karnataka Agribusiness, we empower farmers to make data-driven decisions that elevate their agricultural operations for better, sustainable results.
                            </p>
                        </div>
                    </div>
                );
            // Add more cases as needed
            default:
                return (
                    <div className="m-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                        <div className="p-5">
                            <p className="mb-3 text-justify">
                                Karnataka Agribusiness provides a comprehensive range of agricultural products and services to support farmers in achieving sustainable and profitable farming.
                            </p>
                            <p className="text-justify">
                                Our platform connects farmers with trusted suppliers, offering high-quality inputs and solutions tailored to their needs.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <Link2SEO subslug={subslug} />
            {getDescription(subslug)}
            <div className="lg:mx-50 my-5 bg-white dark:bg-boxdark-2 shadow-md dark:shadow-none">
                <div className="bg-success text-white">
                    <h4 className="text-center p-2 font-bold">{subslug && subslug}</h4>
                </div>
                {/* Product List */}
                <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 mx-auto gap-4 p-5">
                    {products.map((item, i) => (
                        <div key={i + 1} className="bg-white dark:bg-boxdark shadow-lg rounded-lg flex flex-col p-1 lg:w-50 text-sm cursor-pointer">
                            <Link to={`/view/${item.title.replace(/\s+/g, '-')}`} className="block flex-grow"
                                onClick={handleClick.bind(this, item._id)}
                            >
                                <div className="text-center">
                                    <div className="overflow-hidden">
                                        <img
                                            src={item.images}
                                            alt="Product"
                                            className="mx-auto mb-2 transform hover:scale-125 transition-transform duration-300"
                                            style={{ width: '60%', height: '100px' }}
                                        />
                                    </div>
                                    <h3 className="font-semibold mb-1">{item.title}</h3>
                                    <p className="mb-1">{item.brand}</p>
                                    <p className="font-bold mb-2">₹{item.price}
                                        {item.quantity ? '/' : ''}
                                        <span className="text-success ms-1">
                                            {item.quantity && item.quantity}
                                        </span>
                                        {item.instock !== undefined && item.instock !== null && item?.categoryID?.name !== 'AgriOutput' &&
                                            item?.categoryID?.name !== 'AgriServices' ? (
                                            <span>
                                                <span className="mx-1 text-xl font-bold">{item.instock ? '-' : ''}</span>
                                                <span className={`${typeof item.instock === 'number' && item.instock > 0 ? 'text-success' : 'text-danger'}`}>
                                                    {typeof item.instock === 'number' && item.instock > 0 ? 'In Stock' : 'Out of Stock'} {item.instock ? item.instock : ''}
                                                </span>
                                            </span>
                                        ) : null}
                                    </p>
                                    <p className="line-through text-danger">
                                        {item.cutprice ? `₹${item.cutprice}` : ''}
                                    </p>
                                </div>
                            </Link>
                            <div className="text-center mt-2">
                                <button
                                    className="flex items-center font-bold lg:px-8 px-5 py-1 rounded text-amber-500 hover:text-blue-500"
                                    onClick={() => viewNumber(item._id)}
                                >
                                    <BiSolidPhoneCall className="mr-2" />
                                    <span>
                                        {viewPhone === item._id ? item.phone : "View Number"}
                                    </span>
                                </button>

                                <button
                                    className="bg-green-500 text-white px-4 py-2 font-bold w-full rounded hover:bg-green-600 transition mt-2"
                                    onClick={() => sendEnquiry(item.vendorID, item.categoryID, item.title)}
                                >
                                    Get Best Price
                                </button>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Pagination section */}
                <div className={`flex items-center justify-center pb-5`}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1} // Disable if on the first page
                        className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
                    >
                        Previous
                    </button>

                    <span className="mx-4">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0} // Disable if on the last page
                        className={`px-4 py-2 border rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
                    >
                        Next
                    </button>
                </div>


                {/* Vendor Enquiry */}
                {isVendorEnquiryOpen && (
                    <VendorEnquiry
                        onCancel={() => setIsVendorEnquiryOpen(false)}
                        onConfirm={() => setIsVendorEnquiryOpen(false)}
                        vendorID={vendorID}
                        categoryID={categoryID}
                        buyerID={user._id}
                        productName={productName}
                    />
                )}


                {/* Toast notification */}
                {toast.show && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                        <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
                    </div>
                )}
            </div>
        </>
    );
};

export default LinkProducts2;