import React, { useState, useEffect } from "react";
import RegisterRoles from "./registerRoles";
import LoginRoles from "./loginRoles";
import { Link } from "react-router-dom";
import ForgotPassword from "./forgotPassword";


const PhoneVerify = ({ isforgot }) => {
  const [phone, setPhone] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneExist, setPhoneExist] = useState(false);
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
        setIsAuthenticated(true);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/phoneVerify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          console.log('Phone number already exists');
          setPhoneExist(true);
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      } else {
        const serRes = await response.json();
        console.log('serRes :', serRes);

        if (serRes.exists) {
          setPhoneExist(true);
        } else {
          setPhoneExist(false);
        }
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  };


  return (
    <div className="flex justify-center items-center mb-5">
      {!isAuthenticated && (
        <div data-aos="fade-up" className="flex flex-col items-center justify-center mt-6 bg-white dark:bg-boxdark p-6 rounded-lg shadow-md max-w-xs">
          <img className="w-32 mb-4"
            src={
              isforgot ? "https://res.cloudinary.com/dm71xhdxd/image/upload/v1724144120/forgot-password_vycc2l.webp"
                : " https://res.cloudinary.com/dq7vggsop/image/upload/v1719464285/jqz80kzevq3cavjxuork.jpg"
            }
          />
          <h1 className="text-xl font-semibold mb-2">{isforgot ? 'Reset Password' : 'Welcome'}</h1>
          <p className="text-gray-500 mb-4">Verify Phone Number</p>
          <div className="pe_signin_button" data-client-id="16031306208315887707"></div>

          <div className="flex flex-col items-center justify-center mt-4 text-center">
            <div className="flex gap-10">
              <Link to="/login"
                className="text-blue-600 font-semibold text-sm hover:underline">
                Login
              </Link>
              <Link
              to="/forgot-password" 
              className="text-blue-600 font-semibold text-sm hover:underline">
                {isforgot ? '' : 'Forgot password ?'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated && !phoneExist && (
        <RegisterRoles phone={phone} />
      )}

      {isAuthenticated && phoneExist && (
        isforgot ? <ForgotPassword phone={phone} /> : <LoginRoles phone={phone} />
      )}
    </div>
  );
};

export default PhoneVerify;
