import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";



const PhoneVerifyFPO = ({ isforgot, setSelectedComponent }) => {
     const [phone, setPhone] = useState('');
    const [userDetails, setUserDetails] = useState({
        countryCode: "",
        phoneNo: "",
    });


    useEffect(() => {
        const SignInButton = () => {
            const script = document.createElement('script');
            script.src = "https://www.phone.email/sign_in_button_v1.js";
            script.async = true;
            document.body.appendChild(script);

            const phoneEmailListener = async (userObj) => {
                const { user_country_code, user_phone_number } = userObj;
                setUserDetails({
                    countryCode: user_country_code,
                    phoneNo: user_phone_number
                });
                setPhone(user_phone_number);
                verifyPhoneNumber(user_phone_number);
            };
            window.phoneEmailListener = phoneEmailListener;

            return () => {
                document.body.removeChild(script);
            };
        };
        SignInButton();
    }, []);

    const verifyPhoneNumber = async (phoneNumber) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_FPO}/phoneVerifyFPO`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    console.log('Phone number already exists');
                    if (isforgot) {
                        setSelectedComponent({
                            link: 'Forgot-form',
                            data: phoneNumber
                        });
                    } else {
                        setSelectedComponent({
                            link: 'Login-FPO',
                            data: ''
                        });
                    }

                } else {
                    throw new Error(`Error: ${response.statusText}`);
                }
            } else {
                const serRes = await response.json();
                console.log('serRes :', serRes);
                setSelectedComponent({
                    link: 'Reg-FPO',
                    data: phoneNumber
                });
            }
        } catch (error) {
            console.log('Error:', error.message);
        }
    };


    return (
        <div className="flex justify-center items-center mb-5">
            <div data-aos="fade-up" className="flex flex-col items-center justify-center bg-white dark:bg-boxdark p-6 rounded-lg shadow-md max-w-xs">
                <img className="w-32"
                    src={
                        isforgot ? "https://res.cloudinary.com/dm71xhdxd/image/upload/v1724144120/forgot-password_vycc2l.webp"
                            : " https://res.cloudinary.com/dq7vggsop/image/upload/v1719464285/jqz80kzevq3cavjxuork.jpg"
                    }
                />
                <h1 className="text-xl font-semibold">{isforgot ? 'Reset Password' : 'Welcome'}</h1>
                <p className="text-gray-500 mb-2">Verify Phone Number</p>
                <div className="pe_signin_button" data-client-id="16031306208315887707"></div>

                <div className="flex flex-col items-center justify-center mt-2 text-center">
                    <div className="flex gap-10">
                        <Link
                            onClick={() => setSelectedComponent({
                                link: 'Login-FPO',
                                data: ''
                            })}
                            className="text-blue-600 font-semibold text-sm hover:underline">
                            Login
                        </Link>
                        <div
                            className="text-blue-600 font-semibold text-sm hover:underline">
                            {isforgot ?
                                (
                                    <Link
                                        onClick={() => setSelectedComponent({
                                            link: 'Phone-verify',
                                            data: ''
                                        })}
                                    >
                                        Register
                                    </Link>
                                )
                                :
                                (
                                    <Link
                                        onClick={() => setSelectedComponent({
                                            link: 'Forgot-pass',
                                            data: ''
                                        })}
                                    >
                                        Forgot password ?
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneVerifyFPO;
