import React from "react";

const FooterDocuments = ({ closeModal }) => {
    return (
        <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] bg-black bg-opacity-50">
            <div
                className="w-[90%] sm:w-[90%] lg:max-w-6xl bg-white text-black shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto
                 dark:bg-boxdark dark:text-white">
                <div className="flex items-center text-white border-b border-gray-300 sticky top-0 p-4 bg-success">
                    <h3 className="text-center text-xl font-bold flex-1">Platform Informations And Guidelines</h3>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 ml-2 cursor-pointer shrink-0 fill-white hover:fill-red-500"
                        viewBox="0 0 320.591 320.591"
                        onClick={closeModal} // Add your close logic here
                    >
                        <path
                            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                        ></path>
                        <path
                            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                        >
                        </path>
                    </svg>
                </div>

                <div className="mx-10">
                    <div className=" text-md leading-relaxed mb-5 font-serif" id="WWA" style={{ paddingTop: '64px' }}>
                        <h4 className="text-sm md:text-2xl font-extrabold scroll-mt-24">Who We Are?</h4>
                        <p className="mb-3">
                            “Karnataka Agribusiness - Your Gateway to Agri Inputs, Output & Services" is an
                            innovative platform, www.karnatakaagribusiness.com, dedicated to transforming
                            agriculture into agribusiness by connecting farmers, traders, and other
                            agribusiness participants. By integrating agri inputs, output, and services, we
                            empower the agribusiness community, including farmers, to thrive in today’s
                            competitive environment.
                        </p>
                        <p className="mb-3">
                            As a one-stop solution, www.karnatakaagribusiness.com offers fertilizers,
                            pesticides, farm machinery, implements, and output such as groceries, fruits,
                            and vegetables, while also providing access to essential agribusiness services.
                            This exclusive platform primarily serves agribusiness participants from
                            Karnataka and neighboring states like Andhra Pradesh, Tamil Nadu, and Kerala,
                            with its reach extending across the country.
                        </p>
                        <p className="mb-3">
                            Our goal is to deliver comprehensive solutions - products and services that
                            enable farmers and agribusinesses to make informed decisions when buying or
                            selling. We connect users to a wide range of quality products and services,
                            promoting sustainable agriculture through innovative solutions and expertise
                            that support the agribusiness community.
                        </p>
                    </div>

                    <div className=" text-md leading-relaxed mb-5 font-serif" id="UG" style={{ paddingTop: '64px' }}>
                        <h4 className="text-sm md:text-2xl font-extrabold">User Guidelines</h4>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">1. Registration and Account Setup </h4>
                            To access the full range of services offered
                            under www.karnatakaagribusiness.com, users and vendors must create an account by
                            registering with valid phone number and accurate personal details in the ‘Register’
                            option available. Ensure that the information provided is accurate and verifiable.

                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">2. Accessing Services </h4>
                            Once registered, you can login using your credentials to explore the platform's services.
                            Use your registered phone number and password to login to the <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a>.
                            Upon successful login, you will have access to the user and vendor dashboard.
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">3. Using the Platform</h4>
                            <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a> designed for ease of use, allowing users to navigate the
                            website and make informed decisions based on the data and services provided. Users can
                            easily browse the platform to find agri inputs, agri output and agri services. Each product
                            or service has detailed descriptions, specifications, and pricing information while making
                            their transaction.
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">4. Compliance and Ethics</h4>
                            <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a> operates under ethical guidelines, and all users
                            expected to follow these principles while using the platform. Strictly follow
                            all the instructions provided on the platform for accessing services or data.
                        </p>
                    </div>

                    <div className=" text-md leading-relaxed mb-5 font-serif" id="DSLM" style={{ paddingTop: '64px' }}>
                        <h4 className="text-sm md:text-2xl font-extrabold">Disclaimer</h4>
                        <p className="mb-3">
                            Karnataka Agribusiness serves as a platform to connect buyers and sellers of
                            agricultural products and services. By accessing or using this platform,
                            <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a>, all users including buyers, sellers, and service
                            providers - agree to the terms and conditions outlined below:
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">•	Platform maintenance fee: </h4>
                            The fees charged to sellers and service providers on www.karnatakaagribusiness.com are
                            primarily for maintaining and enhancing the platform, which is non-refundable.
                            This fee help to cover operational costs such as website upkeep, technical support,
                            and promotional efforts to increase the visibility of sellers and service providers.
                            While we strive to improve platform performance and attract more buyers and sellers,
                            we do not guarantee the volume or quality of leads. To understand leads generation
                            progress, the vendor can utilize the trial period of one month from the date of their
                            account registration.
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">•	Efforts to provide good leads: </h4>
                            We make diligent efforts to provide quality leads by expanding our network and
                            promoting the platform to reach a wider audience of buyers and sellers. However,
                            we cannot be held responsible for the quantity or quality of leads that sellers
                            or service providers may receive. The outcome of inquiries and transactions
                            depends on factors such as market demand, product or service quality, and the
                            responsiveness of vendors.
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">•	Buyer and seller responsibilities: </h4>
                            Buyers, sellers, and service providers are encouraged to conduct their own due
                            diligence before entering into any transaction. While the platform connects
                            buyers and sellers, we do not verify the authenticity, quality, or legality of
                            the products and services. All transactions, agreements, and any disputes are
                            the sole responsibility of the involved parties. &nbsp;
                            <b>Users are advised to independently verify all relevant details before
                                proceeding with any transactions.
                            </b>
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">•	Limitations of liability: </h4>
                            <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a> will not be held liable for any losses, damages,
                            or disputes arising from the use of the platform. This includes but is not
                            limited to:
                            <ul className="list-decimal list-inside">
                                <li>1. Miscommunication between buyers and sellers</li>
                                <li>2. Failed transactions</li>
                                <li>3. Non-fulfillment of orders or services</li>
                                <li>4. Issues related to product or service quality</li>
                                <li>5. Misleading information both by the buyers or sellers</li>
                            </ul>
                        </p>
                        <p className="mb-3">
                            <h4 className="md:text-md font-extrabold">•	Jurisdiction for Legal Actions: </h4>
                            Any legal claims, disputes, or actions arising from the use of
                            &nbsp; <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a> will be subject to the exclusive jurisdiction
                            of the courts in Bengaluru, Karnataka. By using this platform, users agree that
                            any legal proceedings will take place within the jurisdiction of Bengaluru’s
                            courts.
                        </p>
                    </div>

                    <div className=" text-md leading-relaxed mb-5 font-serif">
                        <h4 className="text-sm md:text-2xl font-extrabold text-center border-b-2 border-t-2">VENDOR TOOL KIT</h4>

                        <div className=" text-md leading-relaxed mb-5 font-serif" id="WCV" style={{ paddingTop: '64px' }}>
                            <h4 className="text-sm md:text-2xl font-extrabold">Who can be a Vendor?</h4>
                            <p className="mb-3">
                                <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a>
                                a wide range of vendors from the agriculture sector who can contribute to its mission of providing
                                comprehensive agri solutions. Vendors can belong to one of the following categories: agri inputs or
                                agri output or agri services or combination any of these.
                                <ul className="list-decimal list-inside">
                                    <li><b>1. Agri input vendors: &nbsp;</b>
                                        <span>
                                            These vendors supply essential products required for farming
                                            activities. This category includes suppliers of seeds,
                                            fertilizers, pesticides, bio-fertilizers, farm machinery,
                                            irrigation equipment, implements and others that support crop
                                            production and farm operations.
                                        </span>
                                    </li>
                                    <li><b>2. Agri output vendors: &nbsp;</b>
                                        <span>
                                            Vendors in this category are those involved in the sale and
                                            distribution of agricultural produce. This includes farmers,
                                            aggregators, and traders who deal in crops categories such as
                                            fruits, vegetables, grains, pulses, and other farm products.
                                        </span>
                                    </li>
                                    <li><b>3. Agri services vendors: &nbsp;</b>
                                        <span>
                                            This category is for businesses and individuals offering services
                                            related to agriculture, such as farm management consultancy,
                                            soil testing services, crop advisory services, and machinery
                                            maintenance providers and other service vendors. Vendors who
                                            provide farm machinery hiring services will also fall under
                                            this category.
                                        </span>
                                    </li>
                                </ul>
                            </p>
                            <p className="mb-3">
                                The vendor can effectively utilize the provision of trial period of one
                                month to understand the functionality and leads generation progress. On
                                completion of the trial period, the vendor need to subscribe for further
                                access to their vendor account. By collaborating with Karnataka Agribusiness,
                                vendors from these categories can expand their market reach and connect with
                                farmers and agribusiness enterprises across the country mainly in southern
                                states.
                            </p>
                        </div>

                        <div className=" text-md leading-relaxed mb-5 font-serif" id="GDPV" style={{ paddingTop: '64px' }}>
                            <h4 className="text-sm md:text-2xl font-extrabold">Guidelines for product vendor</h4>
                            <p className="mb-3">
                                Follow these easy steps to register and log into your vendor account. This
                                process ensures that you can quickly access your dashboard and manage your
                                account without hassle.
                                <ul className="list-decimal list-inside">
                                    <li><b>Step 1 - Click on register (verify phone number page appears)</b></li>
                                    <li><b>Step 2 - Verify your phone number with OTP</b></li>
                                    <li><b>Step 3 - Signup into your account (Fill all the required details correctly)</b>
                                        <ul className="ml-14">
                                            <li>A.	In role, choose vendor</li>
                                            <li>
                                                B.	In categories, please choose at least one of them or
                                                more based on your requirement (agri inputs, & agri output -
                                                GST Number is not mandatory for agri output vendors)
                                            </li>
                                        </ul>
                                    </li>
                                    <li><b>Step 4 - Login with your verified number and password</b>
                                        <ul className="ml-14">
                                            <li>A.	After login you will be redirected to vendor dashboard</li>
                                            <li>
                                                B.	In categories, please choose at least one of them or
                                                more based on your requirement (agri inputs, & agri output -
                                                GST Number is not mandatory for agri output vendors)
                                            </li>
                                            <li>• Click on forgot password</li>
                                            <li>• Again verify your phone number with OTP (Your registered mobile number)</li>
                                            <li>• Reset password page will appear, then enter your new password</li>
                                            <li>• After registering with new password, it will redirect to login page again</li>
                                            <li>• Login with your phone number and new password</li>
                                            <li>• After login you will have the access to the vendor dashboard</li>
                                        </ul>
                                    </li>
                                    <li><b>Step 5 - Inside MENU you have four options on left side for your account overview. </b>
                                        <ul className="ml-14">
                                            <li>i.	Dashboard</li>
                                            <li>ii.	Your Products</li>
                                            <li>iii.	Buyer Enquiries</li>
                                            <li>iv.	Lead Enquiries</li>
                                        </ul>
                                    </li>
                                </ul>
                            </p>
                            <p className="mb-3">
                                The vendor can effectively utilize the provision of trial period of one
                                month to understand the functionality and leads generation progress. On
                                completion of the trial period, the vendor need to subscribe for further
                                access to their vendor account. By collaborating with Karnataka Agribusiness,
                                vendors from these categories can expand their market reach and connect with
                                farmers and agribusiness enterprises across the country mainly in southern
                                states.
                            </p>
                        </div>

                        <div className=" text-md leading-relaxed mb-5 font-serif" id="GSV" style={{ paddingTop: '64px' }}>
                            <h4 className="text-sm md:text-2xl font-extrabold">Guidelines for Service Vendor</h4>
                            <p className="mb-3">
                                To register and access your account, follow the steps below. Once completed,
                                you will have a complete access to the vendor dashboard and all of the
                                functionality you need to effectively manage.
                                <ul className="list-decimal list-inside">
                                    <li><b>Step 1 – Click on register (verify phone number page appears)</b></li>
                                    <li><b>Step 2 – Verify your phone number with OTP</b></li>
                                    <li><b>Step 3 – Signup into your account (Fill all the required details correctly)</b>
                                        <ul>
                                            <li>A.	In role, choose vendor</li>
                                            <li>
                                                B.	In categories, please choose agri services
                                            </li>
                                        </ul>
                                    </li>
                                    <li><b>Step 4 – Login with your verified number and password</b>
                                        <ul>
                                            <li>A.	After login you will be redirected to vendor dashboard</li>
                                            <li>
                                                B.	If you have any issues in login to your account, you can use
                                                forgot password option to change your old password
                                            </li>
                                            <li>• Click on forgot password</li>
                                            <li>• Again verify your phone number with OTP (Your registered mobile number)</li>
                                            <li>• Reset password page will appear, then enter your new password</li>
                                            <li>• After registering with new password, it will redirect to login page again</li>
                                            <li>• Login with your phone number and new password</li>
                                            <li>• After login you will have the access to the vendor dashboard</li>

                                            <li><b>Step 5 - Inside MENU you have four options on left side for your account overview.</b>
                                                <ul>
                                                    <li>a. Dashboard</li>
                                                    <li>b. Your Products</li>
                                                    <li>c. Buyer Enquiries</li>
                                                    <li>d. Lead Managers</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </p>
                        </div>


                        <div className=" text-md leading-relaxed mb-5 font-serif" id="HBU" style={{ paddingTop: '64px' }}>

                            {/* Header Section */}
                            <header className="py-6 text-center">
                                <h1 className="text-sm md:text-2xl font-extrabold text-center border-b-2 border-t-2">How You Benefit with Us?</h1>
                            </header>

                            {/* Main Content Section */}
                            <main className="container mx-auto p-6 space-y-8">
                                <section>
                                    <h2 className="text-sm md:text-2xl font-extrabold">For Vendors</h2>
                                    <p className="text-lg leading-relaxed">
                                        <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a> provides a valuable platform to showcase and sell their agricultural products and services.
                                    </p>
                                </section>

                                {/* Vendor Benefits List */}
                                <section className="">
                                    <h3 className="text-sm md:text-2xl font-extrabold">Vendor Benefits:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                Each listing allows vendors to display their product details, pricing, and unique selling points, reaching a broad audience of potential buyers in the categories such as:
                                            </span>
                                        </li>
                                        <ul className="pl-6 space-y-2">
                                            <li><strong className="font-semibold">Agri Input:</strong> seeds & plants, irrigation, fertilizer, pesticides, farm machinery, agri-tech solutions, primary processing, power & energy, implements.</li>
                                            <li><strong className="font-semibold">Agri Output:</strong> vegetables, fruits, groceries.</li>
                                            <li><strong className="font-semibold">Agri Services:</strong> on-farm, off-farm services.</li>
                                        </ul>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                The website is targeted specifically to the Karnataka and neighboring regions of the agribusiness market, providing local vendors with direct access to buyers within the region, helping them grow their customer base without extensive advertising costs.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                By appearing on a dedicated agribusiness platform, vendors can enhance their brand visibility and gain credibility among local farmers and agribusinesses looking for reliable suppliers.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                Vendors can use the platform to manage customer inquiries, follow-up on potential leads, and provide after-sales support, all of which enhance customer satisfaction and repeated business.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                An additional benefit of capturing inquiries from:
                                                <ul className="pl-6 space-y-2">
                                                    <li><strong>a)</strong> Unregistered buyers – through forms</li>
                                                    <li><strong>b)</strong> With Way2Agribusiness network, progressively boosting buyer participation on the platform.</li>
                                                </ul>
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                Through the platform, vendors gain insights into trending products, demand fluctuations, and seasonal needs. This information can guide them in adjusting their inventory or promotional strategies to align with market demands.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                The website offers promotional opportunities or featured listings for vendors, helping them stand out to buyers who are browsing the site. This is especially beneficial during peak agricultural seasons.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                Listing on the site is generally more affordable than traditional advertising or setting up a standalone e-commerce site, allowing vendors to connect with buyers with minimal upfront costs.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                An exclusive platform to promote and reach out to targeted agribusiness customers, unlike IndiaMart and other platforms which are also highly paid for product listings and services.
                                            </span>
                                        </li>

                                        <li className="flex items-start space-x-3">
                                            <span className="">•</span>
                                            <span>
                                                As part of the Karnataka Agribusiness platform community, Way2Agribusiness India Pvt Ltd is committed to providing unwavering support until vendors become self-sufficient.
                                            </span>
                                        </li>
                                    </ul>
                                </section>
                            </main>
                        </div>
                    </div>


                    <div className="text-md leading-relaxed mb-5 font-serif">
                        <h4 className="text-sm md:text-2xl font-extrabold text-center border-b-2 border-t-2">BUYER TOOL KIT</h4>

                        <div className=" text-md leading-relaxed mb-5 font-serif" id="GFB" style={{ paddingTop: '64px' }}>
                            <h4 className="text-sm md:text-2xl font-extrabold">Guidelines for Buyer</h4>
                            <p className="mb-3">
                                To register, login, and explore agri products and services, just complete the steps listed below.
                                After registering, you can look for products and services, narrow your search by region,
                                and send direct inquiries to sellers.
                                <ul className="list-decimal list-inside">
                                    <li><b>Step 1 - Click on register option available</b></li>
                                    <li><b>Step 2 - Verify your phone number with OTP</b></li>
                                    <li><b>Step 3 - Signup into your account (Fill all the required details correctly)</b></li>
                                    <li><b>Step 4 - After registration, you will be redirected to login page</b></li>
                                    <li><b>Step 5 - Login with your verified number and password </b></li>
                                    <li><b>Step 6 - You will be redirected to HOME page.</b>
                                        <ul className="ml-14">
                                            <li>• Agri input </li>
                                            <li>• Agri output</li>
                                            <li>• Agri services</li>
                                        </ul>
                                    </li>
                                    <li><b>Step 7 - You can search your products. </b></li>
                                </ul>
                            </p>
                            <p className="mb-3">
                                <h4><b>Note:</b></h4>
                                <ul>
                                    <li>1. Without login, buyer can’t view the vendor details including their contact information  </li>
                                    <li>2. Buyers can filter products based on location or city</li>
                                    <li>3. Enquiries through both message and phone call is possible under <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a></li>
                                    <li>4. Buyers can post their products requirement to find the desired suppliers</li>
                                </ul>
                            </p>
                        </div>
                    </div>

                    <div className=" text-md leading-relaxed mb-5 font-serif" id="HBU2" style={{ paddingTop: '64px' }}>
                        {/* Header Section */}
                        <header className="py-6 text-center">
                            <h1 className="text-sm md:text-2xl font-extrabold text-center border-b-2 border-t-2">How You Benefit with Us?</h1>
                        </header>

                        {/* Main Content Section */}
                        <main className="container mx-auto p-6 space-y-8">
                            <section>
                                <h2 className="text-sm md:text-2xl font-extrabold">For Buyers</h2>
                                <p className="text-lg leading-relaxed">
                                    <a href="https://www.karnatakaagribusiness.com/" className="text-primary underline">www.karnatakaagribusiness.com</a> provides buyers with a variety of solutions for purchasing
                                    agricultural products & services tailored to their needs.
                                </p>
                            </section>

                            {/* Buyers Benefits List */}
                            <section className="">
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            The site organizes a wide range of agricultural products by categorizing them into Agri Inputs, Agri
                                            Output and Agri Services. Buyers can easily browse these categories & find products meet their needs.
                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            Each product listing provides specific detail such a specifications, pricing, supplier information allowing
                                            buyers to make informed decisions.
                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            The plaƞorm connects buyers with a list of verified suppliers making it easier for buyers to connect
                                            with manufacturers, distributors, and retailers for further negotiations or inquiries.

                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            The site offers products insights and trends, such as demand and pricing information, which helps
                                            buyers make data-driven purchasing decisions.
                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            Through forms or contact openions, buyers can directly reach out to suppliers or request additional
                                            product details. This personalized support enhances the purchasing process.

                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            Buyers even have access to product reviews, ratings, and comparisons that allow them to evaluate the
                                            quality and performance of various products. This feature helps in selecƟng the best openions that meet
                                            specific needs and quality standards.

                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            Buyers can communicate directly with sellers or customer support through integrated messaging or
                                            calling openions, resolving queries in real-time. This feature ensures that buyers have all the necessary
                                            information before making a purchase.
                                        </span>
                                    </li>

                                    <li className="flex items-start space-x-3">
                                        <span className="">•</span>
                                        <span>
                                            Many products, especially machinery, come with warranties and return policies, giving buyers peace of
                                            mind and assurance of product quality and durability.
                                        </span>
                                    </li>
                                </ul>
                                <div className="mt-5">
                                    <p>
                                        In summary, www.karnatakaagribusiness.com acts as a one-stop resource for buyers by offering product
                                        access and supplier information, all of which streamline the buying process of agri products and services.

                                    </p>
                                </div>
                            </section>
                        </main>
                    </div>

                    <div className="text-md leading-relaxed mb-5 font-serif" id="add" style={{ paddingTop: '64px' }}>
                        <h4 className="text-sm md:text-2xl font-extrabold text-center border-b-2 border-t-2">Address</h4>
                        <p><b>Way2Agribusiness India Pvt Ltd.</b></p>
                        <p>
                            ಕೃಷಿ ಮಿತ್ರ/ Krushi Mithra, <br />
                            #636, BDA Block 2, APMC (RMC) Yard, <br />
                            Yeshwanthpura, Bengaluru - 560022
                        </p>
                        <p>
                            Contact: 9449004956 / 8277078435 / 8095000388
                        </p>
                        <p>
                            Email: <br />
                            karnatakaagribusiness@gmail.com, <br />
                            way2agritech@way2agribusiness.com, <br />
                            way2agribusiness@gmail.com
                        </p>
                    </div>

                </div>

                <div className="border-t border-gray-300 pt-6 flex justify-end gap-4 mb-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                        onClick={closeModal} // Add your close logic here
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FooterDocuments;
