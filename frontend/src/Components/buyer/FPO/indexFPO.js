import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DropdownMenu from "./dropdown";
import HomeFPO from "./home";
import MyFPOList from "./myFPOlist";
import AddFPO from "./addFPO";
import RegisterFPO from "./register";
import LoginFPO from "./login";
import PhoneVerifyFPO from "./phoneVerifyFPO";
import ForgotPasswordFPO from "./forgotPassFPO";
import axios from "axios";
import { TbPointFilled } from "react-icons/tb";
import { Helmet } from "react-helmet";


const IndexFPO = () => {
    const { slug } = useParams();  // Getting the slug from the URL params
    console.log('log-data :', slug);

    const [selectedComponent, setSelectedComponent] = useState({
        link: slug ? 'Login-FPO' : 'Home',  // Default to 'Home' if no slug
        data: ''
    });

    const [user, setUser] = useState('');

    // Function to get the token from local storage
    const getToken = () => localStorage.getItem('token2');

    useEffect(() => {
        const getFPOprofile = async () => {
            try {
                const token = getToken();
                if (token) {
                    const response = await axios.get(`${process.env.REACT_APP_API_FPO}/getbyId`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };

        getFPOprofile();
    }, []);

    useEffect(() => {
        if (slug) {
            // Update the selected component when the slug is available
            setSelectedComponent({
                link: user ? 'Home' : 'Login-FPO',  // If the user is logged in, show Home
                data: `Data related to ${slug}`  // Example: Show slug-related data
            });
        } else {
            // If no slug is available, fallback to showing the home or login
            setSelectedComponent({
                link: user ? 'Home' : 'Login-FPO',
                data: ''
            });
        }
    }, [slug, user]);  // Re-run when slug or user status changes

    const handleSelectComponent = (component) => {
        setSelectedComponent({
            link: component,
            data: ''
        });
    };

    return (
        <>
            <Helmet>
                <title>
                    FPO Connect, Karnataka Agribusiness, Famer Producer Organisation,
                    Agricultural market access for FPOs, Sustainable agriculture through FPOs,
                    output supply and input requirements
                </title>
                <meta
                    name="description"
                    content="Join FPO Connect on Karnataka Agribusiness to empower FPOs and FPCs. 
                    Expand market reach, access resources, and grow your agribusiness effectively."
                />
                <meta
                    name="keywords"
                    content="FPO, Famer Producer Organisation, FPOs, FPCs, FIGs, Crop cluster, 
                    Farmer Producer Companies registration on FPO Connect, Karnataka FPO network 
                    and market expansion opportunities, output supply and input requirements for the 
                    farmers "
                />
                <meta
                    name="robots"
                    content="index, follow"
                />
                <meta
                    property="og:description"
                    content="FPO Connect on Karnataka Agribusiness offers FPO profiles with direct access to 
                    agri inputs, outputs, and services, empowering FPOs and farmers to grow efficiently."
                />
            </Helmet>

            <div className="mt-5 mb-5">
                <h1 className="text-center font-bold text-success">Farmer Produce Organization (FPO) Services</h1>
            </div>

            <div className="mx-10 mb-5 text-sm bg-white shadow-md rounded-md dark:bg-boxdark">
                <div className="p-5">
                    <p className="mb-3 text-justify">
                        Farmer Producer Organizations (FPOs), Farmer Producer Companies (FPCs), and Farmer
                        Interest Groups (FIGs) are central to promoting collective growth, sustainability,
                        and market access in agriculture. FPO Connect, hosted on the Karnataka Agribusiness
                        platform, provides a comprehensive space where farmers, vendors, and service
                        providers can connect, expand their reach, and access vital resources.
                        This platform enables FPOs to register their Farmer Producer Companies,
                        manage crop details, and track input requirements in real-time, ensuring their
                        profiles are consistently updated. By keeping these profiles current, FPOs can
                        engage in direct, efficient market transactions and build valuable relationships
                        with suppliers, buyers, and service providers. With streamlined access to
                        agricultural markets under respective pages, FPOs can easily buy and sell crops,
                        agricultural inputs, and services, facilitating growth for all stakeholders.
                    </p>
                    <p className="text-justify">
                        Joining FPO Connect offers Farmer Producer Companies exclusive access to the
                        Karnataka FPO network and valuable market expansion opportunities. The platform
                        supports crop clusters by providing targeted tools and resources that enable
                        farmers to focus on region-specific crops and enhance productivity. With an
                        emphasis on sustainable agriculture through FPOs, the platform offers access
                        to eco-friendly solutions and innovative farming techniques. FPOs can effortlessly
                        update their crop and input details to remain competitive, meet market needs, and
                        streamline their supply chains. As FPOs strengthen their position in the market,
                        FPO Connect serves as a crucial platform, empowering them to manage their operations,
                        expand their market reach, and ensure continued growth and sustainability.
                    </p>
                </div>
            </div>

            <div className="mx-4 md:mx-24 mb-5">
                <div className="bg-green-200 shadow-md rounded dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between mx-10 p-2">
                        {/* Left side - FPO Home */}
                        <div className="mb-2 md:mb-0">
                            <Link
                                className={`text-sm font-semibold hover:text-success 
                                    ${selectedComponent.link === 'Home' ? 'text-success' : ''}`
                                }
                                onClick={() => handleSelectComponent('Home')}
                            >
                                FPO Content
                            </Link>
                        </div>

                        {/* Right side - Other links */}
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            {user ? (
                                <>
                                    <Link
                                        className={`text-sm font-semibold hover:text-success 
                                            ${selectedComponent.link === 'My-List' ? 'text-success' : ''}`
                                        }
                                        onClick={() => handleSelectComponent('My-List')}
                                    >
                                        View Content
                                    </Link>
                                    <Link
                                        className={`text-sm font-semibold hover:text-success 
                                            ${selectedComponent.link === 'Add-FPO' ? 'text-success' : ''}`
                                        }
                                        onClick={() => handleSelectComponent('Add-FPO')}>
                                        Add FPO Content
                                    </Link>
                                    <DropdownMenu
                                        setSelectedComponent={setSelectedComponent}
                                        user={user}
                                    />
                                </>
                            ) : (
                                // If user is not logged in, show Login and Register links
                                <>
                                    <Link
                                        className={`text-sm font-semibold hover:text-success 
                                            ${selectedComponent.link === 'Login-FPO' ? 'text-success' : ''}`
                                        }
                                        onClick={() => handleSelectComponent('Login-FPO')}
                                    >
                                        Login
                                    </Link> /
                                    <Link
                                        className={`text-sm font-semibold hover:text-success 
                                            ${selectedComponent.link === 'Phone-verify' ? 'text-success' : ''}`
                                        }
                                        onClick={() => handleSelectComponent('Phone-verify')}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* Render the selected component */}
                {selectedComponent.link === 'Home' && <HomeFPO />}
                {selectedComponent.link === 'My-List' && <MyFPOList
                    user={user}
                    setSelectedComponent={setSelectedComponent}
                />}
                {selectedComponent.link === 'Add-FPO' && <AddFPO
                    user={user}
                    selectedComponent={selectedComponent}
                />}
                {selectedComponent.link === 'Login-FPO' && <LoginFPO setSelectedComponent={setSelectedComponent} />}
                {selectedComponent.link === 'Reg-FPO' && <RegisterFPO
                    setSelectedComponent={setSelectedComponent}
                    selectedComponent={selectedComponent ? selectedComponent : ''}
                />}
                {selectedComponent.link === 'Phone-verify' && <PhoneVerifyFPO
                    setSelectedComponent={setSelectedComponent}
                />}
                {selectedComponent.link === 'Forgot-pass' && <PhoneVerifyFPO
                    isforgot={true}
                    setSelectedComponent={setSelectedComponent}
                />}
                {selectedComponent.link === 'Forgot-form' && <ForgotPasswordFPO
                    setSelectedComponent={setSelectedComponent}
                    selectedComponent={selectedComponent}
                />}
            </div>

            <div className="mb-5 bg-green-200 shadow-md rounded-md dark:bg-boxdark mx-10">
                <div className="text-sm p-5">
                    <h4 className="font-semibold mb-2">Registration process for FPO profile creation:</h4>
                    <ul>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                Visit “FPO Connect” page
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                Submit your mobile number; the initial registration form will appear. Enter your name and OTP to proceed.
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                Create a username and password you can easily recall, then submit the other required details.
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                Click on login, enter your mobile number, and input the password.
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                After logging in, a form to add FPO content will appear, where you need to enter all your FPO data.
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                An edit option will be available to update the current data.
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                Since no direct transaction provision is made, you must register separately in the name of the FPO for supplying outputs and sourcing inputs and services.
                            </span>
                        </li>
                        <li className="flex">
                            <TbPointFilled className="text-xl" />
                            <span>
                                Individual farmers can register separately but not under “FPO Connect.”
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    )
};
export default IndexFPO;