import { Helmet } from "react-helmet";


// For Link1 Page
export const Link1SEO = ({ slug }) => {
    return (
        <>
            {slug && slug === 'AgriInput' ? (
                    <Helmet>
                        <title>
                            Agri Inputs, Fertilizers, Pesticides, Farm Machinery & Implements
                            Organic and bio fertilizers for farmers, High-yield hybrid seeds for sustainable
                            farming, Top-quality pesticides for pest management in crops, best quality
                            farm machineries and implements at competitive price
                        </title>
                        <meta
                            name="description"
                            content="Explore Karnataka Agribusiness for organic and bio fertilizers, 
            premium quality seeds and plants, irrigation tools, pesticides, 
            farm machinery and implements."
                        />
                        <meta
                            name="keywords"
                            content="Fertilizer, Pesticides, Farm machinery, Implements, Seeds and plants, 
            Irrigation, Fertilizers and pesticides, crop protection products, agritech products, 
            high quality farm machinery"
                        />
                        <meta
                            name="robots"
                            content="index, follow"
                        />
                        <meta
                            property="og:description"
                            content="Karnataka Agribusiness is a leading platform offering comprehensive solutions
            to farmers, vendors, and service providers in the agriculture industry. 
            We provide a wide array of high-quality agri inputs, including seeds and plants, 
            irrigation tools, fertilizers, pesticides, farm machinery, primary processing 
            equipment, power and energy solutions, and implements. Products by our vendors are 
            designed to enhance productivity, sustainability, and profitability for farmers, 
            while also ensuring top-notch quality at competitive prices."
                        />
                    </Helmet>
            )
                : slug === 'AgriOutput' ? (
                        <Helmet>
                            <title>
                                Buy healthy  fruits, fresh vegetables, groceries near me,
                                fruits, vegetables, groceries  online in Karnataka
                            </title>
                            <meta
                                name="description"
                                content="Find fresh fruits, vegetables, and groceries on Karnataka Agribusiness Platform. 
                        Connect with sellers, post your requirements, and get the best farm-fresh agricultural produce 
                        easily!"
                            />
                            <meta
                                name="keywords"
                                content="Fresh vegetables and fruits, buy groceries,
                        Fresh Fruits, Vegetables and groceries near me"
                            />
                            <meta
                                name="robots"
                                content="index, follow"
                            />
                            <meta
                                property="og:description"
                                content="Explore fresh fruits, vegetables, and groceries on Karnataka Agribusiness. 
                        Connect with local sellers and access farm-fresh produce delivered right to you. Order healthy,
                        high-quality produce today!"
                            />
                        </Helmet>
                )
                    : (
                            <Helmet>
                                <title>
                                    Off-farm & On-farm Services, Agri services, Agribusiness Solutions,
                                    DPR services for agribusiness projects, Best solutions for farm management,
                                    Crop planning guidance for maximizing yields & returns
                                </title>
                                <meta
                                    name="description"
                                    content="Discover Karnataka Agribusiness Services: Farm management, Technology identification, 
            government subsidies, marketing support, project reports, and more."
                                />
                                <meta
                                    name="keywords"
                                    content="Agri Services, Project Report Services, Technology Identification, On-farm and Off-farm 
            Services, On-farm and Off-farm Services, Crop Selection Guide, Agricultural 
            technology solutions"
                                />
                                <meta
                                    name="robots"
                                    content="index, follow"
                                />
                                <meta
                                    property="og:description"
                                    content="Explore Karnataka Agribusiness Solutions offering off-farm services like detailed 
            project reports, technology identification, government subsidies, marketing support, 
            agribusiness consultancy, and on-farm management services to boost your agricultural success."
                                />
                            </Helmet>
                    )}
        </>
    )
};


// For Link2 Page
export const Link2SEO = ({ subslug }) => {
    return (
        <>
            {subslug && subslug === 'Seeds-and-Plants' ? (
                <Helmet>
                    <title>
                        Horticulture Plants, High-Yield Seeds, Grow Bags & More,
                        Horticulture plants for creating sustainable gardens
                    </title>
                    <meta
                        name="description"
                        content="Discover our  wide range of seeds and plants, including arecanut, coconut, ornamental plants and vegetable seeds with quality growing media and covers for healthy growth."
                    />
                    <meta
                        name="keywords"
                        content="Horticulture plants, high-yield vegetable seeds, soil media, grow bags, protective covers, seeds, plants, vermiculite, plant containers, shade nets "
                    />
                    <meta
                        name="robots"
                        content="index, follow"
                    />
                    <meta
                        property="og:description"
                        content="Discover a wide range of horticulture plants, including arecanut, coconut, ornamental plants, and high-yield vegetable seeds. Explore quality growing media like coco peat, vermiculite, and compost, along with plant containers such as plastic pots and grow bags. Enhance plant growth with protective covers like shade nets and polyfoils. Available from top suppliers like Ashoka Seeds and more."
                    />
                </Helmet>
            )
                :
                subslug === 'Irrigation' ? (
                    <Helmet>
                        <title>
                            Irrigation Systems, Fertigation & Water Pumps for Farms,
                            Affordable irrigation solutions for small-scale farming, affordable fertigation solutions for farmers, durable water pumps for irrigation in large fields
                        </title>
                        <meta
                            name="description"
                            content="Discover efficient irrigation systems, fertigation solutions, and high-quality water pumps to optimize water usage and boost your agricultural productivity."
                        />
                        <meta
                            name="keywords"
                            content="Irrigation System & Products, Fertigation, Water Pumps,Irrigation hoses, fertilizer injectors, irrigation fertilization"
                        />
                        <meta
                            name="robots"
                            content="index, follow"
                        />
                        <meta
                            property="og:description"
                            content="Find top-quality irrigation systems, fertigation solutions, and water pumps at Karnataka Agribusiness. From drip irrigation systems to sprinklers, hydraulic pumps, and fertigation solutions, optimize your farm's water usage and enhance productivity with products from renowned companies like Sujay, Mobitech, and Rivulis."
                        />
                    </Helmet>
                )
                    :
                    subslug === 'Fertilizer' ? (
                        <Helmet>
                            <title>
                                Organic & Inorganic Fertilizers for Higher Yield & Soil,
                                Fertilizer for higher yield, Organic fertilizers for  soil enrichment, liquid bio fertilizers for better result,
                            </title>
                            <meta
                                name="description"
                                content="Explore a wide range of organic, bio, and inorganic fertilizers including Dr soil health, bio-NPK, bio-potash, and calsan to enhance soil fertility and crop growth.
                                Organic and bio fertilizer like Dr soil health areca special, bio NPK, bio potash, humisan, humigreen, micro speed, python-T  
                                Inorganic fertilizer such as Calsan, borosan c) Supplying companies like Samarth,  Amruth Organics and other companies."
                            />
                            <meta
                                name="keywords"
                                content="Organic & bio fertilizers, Inorganic fertilizers, Natural soil amendments, Phosphorus-rich fertilizers,"
                            />
                            <meta
                                name="robots"
                                content="index, follow"
                            />
                            <meta
                                property="og:description"
                                content="Explore a comprehensive range of organic, bio, and inorganic fertilizers including Dr. Soil Health, Bio NPK, Bio Potash, Humisan, Humigreen, Micro Speed, Python-T, Calsan, and Borosan. Enhance soil fertility and boost crop growth with fertilizers from trusted suppliers like Samarth and Amruth Organics."
                            />
                        </Helmet>
                    )
                        :
                        subslug === 'Pesticides' ? (
                            <Helmet>
                                <title>
                                    Bio & Organic Pesticides for Crop & Pest Control Solutions,
                                    Organic pesticides for areca nut, Pest Control by inorganic pesticides,
                                </title>
                                <meta
                                    name="description"
                                    content="Discover a wide range of organic and inorganic pesticides on Karnataka Agribusiness platform. Ensure effective pest control with quality solutions for your crops.
                                    Organic-bio pesticides: Power plus, alnym, alderm, navarathna, samrakshak, almonas, Supplying companies like Amruth Organics, Samarth"
                                />
                                <meta
                                    name="keywords"
                                    content="Bio pesticides, Organic pest control, Chemical pesticides,
                                    Best organic pesticides for crops, Inorganic pesticides for orchards "
                                />
                                <meta
                                    name="robots"
                                    content="index, follow"
                                />
                                <meta
                                    property="og:description"
                                    content="Explore a wide selection of organic and inorganic pesticides for effective pest control at Karnataka Agribusiness. Featuring top-quality products like Power Plus, Alnym, and Samrakshak for your agricultural needs."
                                />
                            </Helmet>
                        )
                            :
                            subslug === 'Farm-Machinery' ? (
                                <Helmet>
                                    <title>
                                        De-Weeders, Sprayers & Harvesters for Efficient Farming,
                                        Manual and automatic de-weeder for crops, Sprayers for weed and pest control in orchards, Tractor-mounted harvesters for row crops
                                    </title>
                                    <meta
                                        name="description"
                                        content="Explore quality farm machinery like de-weeder, sprayers, harvesters, and maintenance equipment on Karnataka Agribusiness platform to enhance farming efficiency .
                                        De-weeder: Brush cutter, power weeder from Texas, Honda, Makita, Sprayer & fumigation: HTTP sprayer, power sprayers, battery sprayers, portable sprayer
                                        Maintenance: Lawn mower, Concrete Vibrator, pole saw, earth auger, chain saw d) Harvesting Machines"
                                    />
                                    <meta
                                        name="keywords"
                                        content="De-weeder, sprayers, harvesters, Machinery for weed control in crops, Automatic sprayers for pest and disease control"
                                    />
                                    <meta
                                        name="robots"
                                        content="index, follow"
                                    />
                                    <meta
                                        property="og:description"
                                        content="Explore top-quality farm machinery including de-weeders, sprayers, harvesters, and maintenance equipment on Karnataka Agribusiness platform. Enhance efficiency with manual and automatic de-weeders, sprayers for pest and weed control, and tractor-mounted harvesters for row crops. Our selection features brands like Texas, Honda, and Makita, ensuring durable and reliable solutions for all your agricultural needs."
                                    />
                                </Helmet>
                            )
                                :
                                subslug === 'Agritech-Solutions' ? (
                                    <Helmet>
                                        <title>
                                            Robots, Drones & Precision Farming for Smart Agriculture,
                                            drones for spraying , AI-powered farming robots for precision agriculture
                                        </title>
                                        <meta
                                            name="description"
                                            content="Discover innovative agri-tech solutions with robots, drones, precision farming products, and AI/ML-based app solutions. Revolutionize your farming with cutting-edge technology .
                                            Robots and drones, Precision farming products c) AI-ML based app solution"
                                        />
                                        <meta
                                            name="keywords"
                                            content="Robots and Drones, Precision farming products, Drones for pest control and crop spraying, AI solutions for farm optimization"
                                        />
                                        <meta
                                            name="robots"
                                            content="index, follow"
                                        />
                                        <meta
                                            property="og:description"
                                            content="Explore the latest in agricultural technology with robots, drones, and precision farming products. Our AI/ML-powered solutions enhance farm optimization, pest control, and crop spraying, ensuring efficient farming practices that lead to higher yields and reduced resource wastage."
                                        />
                                    </Helmet>
                                )
                                    :
                                    subslug === 'Primary-Processing' ? (
                                        <Helmet>
                                            <title>
                                                Chaff Cutter, Milking Machine & Wood Chipper for Farms,
                                                Best chaff cutter for small farms, High-efficiency wood chippers for clearing land, Durable milking machines for cows and goats
                                            </title>
                                            <meta
                                                name="description"
                                                content="Explore reliable primary processing equipment including chaff cutters, milking machines, and wood chippers. Boost efficiency in farming and production with durable solutions.
                                                Equipment for animal husbandry includes the chaff cutter, milking machine from Bushra, Kisan Dairy companies  respectively, Wood chipper"
                                            />
                                            <meta
                                                name="keywords"
                                                content="Chaff cutter, milking machine, wood chipper, Livestock feed cutters, Agricultural cutters, Automatic milker, Milk harvesting tools "
                                            />
                                            <meta
                                                name="robots"
                                                content="index, follow"
                                            />
                                            <meta
                                                property="og:description"
                                                content="Discover high-quality primary processing equipment for farming and animal husbandry at Karnataka Agribusiness. Our range includes durable chaff cutters, milking machines from Bushra and Kisan Dairy, and wood chippers. Enhance productivity and efficiency on your farm with trusted solutions designed for modern agriculture."
                                            />
                                        </Helmet>
                                    )
                                        :
                                        subslug === 'Power-and-Energy' ? (
                                            <Helmet>
                                                <title>
                                                    Generators & Solar-Powered Engines for Agricultural Use,
                                                    Honda portable generators, solar power engines for agricultural use
                                                </title>
                                                <meta
                                                    name="description"
                                                    content="Discover reliable power and energy solutions, including Honda generators, engines, and solar power engines. Ensure efficiency and sustainability for your energy needs. Also include the following in “SEO content
                                                    , Generators, Engines, Solar-powered engines"
                                                />
                                                <meta
                                                    name="keywords"
                                                    content="Generators, Solar-powered engines, Backup power generators, reliable engines for farms"
                                                />
                                                <meta
                                                    name="robots"
                                                    content="index, follow"
                                                />
                                                <meta
                                                    property="og:description"
                                                    content="Explore reliable power solutions with Honda portable generators, backup power generators, and solar-powered engines for agricultural use. Ensure efficiency and sustainability for your farming and energy needs with durable engines."
                                                />
                                            </Helmet>

                                        )
                                            :
                                            subslug === 'Implements' ? (
                                                <Helmet>
                                                    <title>
                                                        Garden Tools, Attachments & Fencing Materials for Farms,
                                                        Best garden tools for home gardening, Eco-friendly fencing materials for farm
                                                    </title>
                                                    <meta
                                                        name="description"
                                                        content="Explore a wide range of implements including garden tools, attachments, equipment, and fencing materials to enhance your farming and gardening efficiency.
                                                        Garden tools: Sickle, khurpi, kudali, billhook, mamooty, hand weeder, coconut dehusker, hand fork spin, attachment, equipment, material, accessories"
                                                    />
                                                    <meta
                                                        name="keywords"
                                                        content="Garden tools, attachments, equipment, fencing material, Outdoor tools for home gardening, farm fencing solutions"
                                                    />
                                                    <meta
                                                        name="robots"
                                                        content="index, follow"
                                                    />
                                                    <meta
                                                        property="og:description"
                                                        content="Explore a comprehensive selection of garden tools, attachments, equipment, and eco-friendly fencing materials. From sickles and khurpis to fencing solutions, enhance your gardening and farming efficiency with high-quality products. Discover outdoor tools for home gardening, farm fencing, and more at Karnataka Agribusiness."
                                                    />
                                                </Helmet>
                                            )
                                                : subslug === 'Vegetables' ? (
                                                    <Helmet>
                                                        <title>
                                                            Fresh Vegetables, Leafy & Exotic Varieties for Farming,
                                                            Fresh vegetables for healthy eating, Nutrient-rich vegetables for cooking, Leafy vegetables for winter gardening, Growing leafy vegetables at home, Benefits of growing exotic vegetables
                                                        </title>
                                                        <meta
                                                            name="description"
                                                            content="Discover a variety of vegetables, exotic vegetables, and leafy greens like tomatoes, potatoes, and onions. Enjoy fresh, nutritious food for a healthy lifestyle. 
                                                            Major vegetables: Brinjal, carrot, chilli, beans, ginger, lemon , Leafy vegetables: Coriander, curry leaves, chakota leaf, palak leaf ,
                                                            Exotic vegetables: baby corn, broccoli, capsicum, milky mushroom."
                                                        />
                                                        <meta
                                                            name="keywords"
                                                            content="Vegetables, leafy vegetables, exotic vegetables , Fresh produce, Healthy vegetables, Specialty crops, Gourmet vegetables, Rare crops "
                                                        />
                                                        <meta
                                                            name="robots"
                                                            content="index, follow"
                                                        />
                                                        <meta
                                                            property="og:description"
                                                            content="Discover a wide variety of fresh and nutrient-rich vegetables, including popular varieties like brinjal, carrot, beans, and exotic vegetables such as baby corn, broccoli, and capsicum. Enjoy organic leafy vegetables like coriander, curry leaves, and palak leaf for a healthy, balanced diet."
                                                        />
                                                    </Helmet>
                                                )
                                                    : subslug === 'Fruits' ? (
                                                        <Helmet>
                                                            <title>
                                                                Healthy Fruits, Seasonal & Exotic Varieties for Wellness,
                                                                Best seasonal fruits for each season’s health benefits, Fresh and healthy fruits for daily consumption, Unique exotic fruits for special diets
                                                            </title>
                                                            <meta
                                                                name="description"
                                                                content="Discover a variety of vegetables, exotic vegetables, and leafy greens like tomatoes, potatoes, and onions. Enjoy fresh, nutritious food for a healthy lifestyle. 
                                                                Fruits : Banana, orange, papaya , Seasonal fruits: Mango, Jack fruit,  grapes, water melon , Exotic fruits: dragon fruit, fig, cherry, kiwi fruit, strawberry"
                                                            />
                                                            <meta
                                                                name="keywords"
                                                                content="Fruits, seasonal fruits, exotic fruits ,Exotic fruit delivery, Natural fruit snacks, Fruit nutrition  "
                                                            />
                                                            <meta
                                                                name="robots"
                                                                content="index, follow"
                                                            />
                                                            <meta
                                                                property="og:description"
                                                                content="Discover a variety of fresh fruits, including seasonal options like mango, jackfruit, and watermelon, as well as exotic fruits such as dragon fruit, fig, cherry, and kiwi. Enhance your diet with healthy, protein-rich fruits for overall well-being."
                                                            />
                                                        </Helmet>
                                                    )
                                                        : subslug === 'Groceries' ? (
                                                            <Helmet>
                                                                <title>
                                                                    Grains, Pulses, Spices & Condiments for Healthy Cooking,
                                                                    : High-quality spices for curries and stews, Protein-rich pulses for vegan diets
                                                                </title>
                                                                <meta
                                                                    name="description"
                                                                    content="Discover high-quality grains, pulses, millets, spices and condiments for healthy cooking. Shop protein-rich pulses for vegan diets and premium spices for curries and stews. Enjoy convenient bulk grocery shopping and buy whole grains and pulses online for nutritious meals. 
                                                                    Grains and millets: basmati rice, bengal gram, chickpea dal, finger millets, Spices: black pepper, cinnamon, dry ginger , Oil seeds: Almond, cardamom, mustard seeds, pista, cashew."
                                                                />
                                                                <meta
                                                                    name="keywords"
                                                                    content="grains, pluses, millets, spices, condiments , Bulk grocery shopping, Whole grains and pulses online "
                                                                />
                                                                <meta
                                                                    name="robots"
                                                                    content="index, follow"
                                                                />
                                                                <meta
                                                                    property="og:description"
                                                                    content="Shop a wide range of groceries, including fresh spices, flavorful condiments, nutritious pulses, and healthy millets. Find quality ingredients for your everyday cooking needs, including basmati rice, chickpea dal, finger millets, black pepper, cinnamon, and more."
                                                                />
                                                            </Helmet>
                                                        )
                                                            : subslug === 'Off-Farms' ? (
                                                                <Helmet>
                                                                    <title>
                                                                        Project Reports, Govt. Subsidies & Marketing Support Services,
                                                                        Consultancy services for detailed project reports, Effective marketing support for agricultural products
                                                                    </title>
                                                                    <meta
                                                                        name="description"
                                                                        content="Explore off-page solutions with detailed project reports, government subsidies, marketing support, and project management consultancy to drive your business success. 
                                                                        Detailed project report , Technology identification , Govt.-subsidies, Marketing support , Project management consultancy , Crop planning & Selection , Bank funding g) Primary-processing, Labor Supply."
                                                                    />
                                                                    <meta
                                                                        name="keywords"
                                                                        content="Detail project report, govt. subsidies, marketing support ,project management consultancy
                                                                        Promotion and branding support , Detailed project analysis"
                                                                    />
                                                                    <meta
                                                                        name="robots"
                                                                        content="index, follow"
                                                                    />
                                                                    <meta
                                                                        property="og:description"
                                                                        content="Discover expert consultancy services for detailed project reports, government subsidies, marketing support, and project management. Get assistance with crop planning, technology identification, bank funding, and more to ensure the success of your agricultural business."
                                                                    />
                                                                </Helmet>
                                                            )
                                                                : (
                                                                    <Helmet>
                                                                        <title>
                                                                            Field Intel Management & Consultancy for Farm Projects,
                                                                            Field Intel management solutions for agricultural projects, Consultancy services for on-farm project management
                                                                        </title>
                                                                        <meta
                                                                            name="description"
                                                                            content="Enhance your farm's productivity with our comprehensive services, including Field Intel management, expert field visits, and project management consultancy. Optimize your farming operations for better results.
                                                                            Field Intel management solution , Field visit , Project management consultancy."
                                                                        />
                                                                        <meta
                                                                            name="keywords"
                                                                            content="Field Intel management, field visits, project management consultancy, Farm productivity enhancement, data-driven farming solutions "
                                                                        />
                                                                        <meta
                                                                            name="robots"
                                                                            content="index, follow"
                                                                        />
                                                                        <meta
                                                                            property="og:description"
                                                                            content="Boost farm productivity with our tailored Field Intel management solutions, expert field visits, and comprehensive project management consultancy. We provide data-driven solutions for optimal farming results."
                                                                        />
                                                                    </Helmet>
                                                                )
            }
        </>
    )
};
