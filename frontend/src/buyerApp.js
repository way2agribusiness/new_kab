import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhoneVerify from './Components/commons/phoneVerify';
import Home from './Components/buyer/home/home';
import Header from './Components/buyer/Header/index';
import LoginRoles from './Components/commons/loginRoles';
import UserProfile from './Components/buyer/profile/userProfile';
import Footer from './Components/commons/footer';
import EnquiryBuyer from './Components/buyer/home/enquiry';
import CategoriesWiseProducts from './Components/buyer/product/categoryWise';
import ProductDetails from './Components/buyer/product/productDetails';
import ScrollToTop from './Components/commons/scrollTop';
import LinkProducts1 from './Components/buyer/Link-products/link1';
import LinkProducts2 from './Components/buyer/Link-products/link2';
import LinkProducts3 from './Components/buyer/Link-products/link3';
import SearchLink from './Components/buyer/Link-products/searchLink';
import NonRegEnquiry from './Components/commons/nonRegEnquiry';
import IndexFPO from './Components/buyer/FPO/indexFPO';
import FpoListByName from './Components/buyer/FPO/fpoListByName';


const Buyer = ({ user }) => {
  const [isproPage, setIsproPage] = useState(true);
  const [isNonRegEnquiryIOpen, setIsNonRegEnquiryIOpen] = useState(false);


  useEffect(() => {

    if (user) {
      setIsNonRegEnquiryIOpen(false); // Ensure the modal is not open if the user exists
      return; // Exit the useEffect if the user is logged in
    }

    // Open modal after 10 minutes on the first render
    const firstTimer = setTimeout(() => {
      setIsNonRegEnquiryIOpen(true); // Open modal after 10 minutes
    }, 600000); // 10 minutes in milliseconds

    // After the first 10 minutes, start the interval for subsequent timings
    const secondTimer = setTimeout(() => {
      setIsNonRegEnquiryIOpen(true); // Open modal after 10 minutes
      // Start the interval for subsequent opens every 10 minutes
      const interval = setInterval(() => {
        setIsNonRegEnquiryIOpen(true); // Open modal every 10 minutes
      }, 600000); // 10 minutes in milliseconds

      // Cleanup interval on unmount or re-render
      return () => clearInterval(interval);
    }, 720000); // 12 minutes in milliseconds

    // Cleanup the timers when component unmounts
    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, [user]); // Empty dependency array to run only once when the component mounts

  return (
    <Router>
      <div className=" text-black dark:bg-boxdark-2 dark:text-bodydark">
        <Header user={user} />
        <ScrollToTop /> {/* Add ScrollToTop here */}

        <main className="max-w-screen-2xl">
          <Routes>
            <Route exact path="/" element={<Home user={user} isproPage={isproPage} />} />
            <Route exact path="/register" element={<PhoneVerify />} />
            <Route exact path="/login" element={<LoginRoles />} />
            <Route exact path="/forgot-password" element={<PhoneVerify isforgot={true} />} />
            <Route exact path="/buyer/profile" element={<UserProfile user={user} />} />
            <Route exact path="/:slug" element={<LinkProducts1 user={user} />} />
            <Route exact path="/:slug/:subslug" element={<LinkProducts2 user={user} />} />
            <Route exact path="/:slug/:subslug/:subsubslug" element={<LinkProducts3 user={user} />} />
            <Route exact path="/search/:productname/:city" element={<SearchLink user={user} />} />
            <Route exact path="/location/:city/:productname" element={<CategoriesWiseProducts user={user} />} />
            <Route exact path="/products" element={<CategoriesWiseProducts user={user} />} />
            <Route exact path="/view/:pname" element={<ProductDetails user={user} />} />
            <Route exact path="/:category/:slug" element={<CategoriesWiseProducts user={user} />} />
            <Route exact path="/fpo-connect" element={<IndexFPO />} />
            <Route exact path="/fpo-connect/user/:slug" element={<IndexFPO />} />
            <Route exact path="/fpo-connect/:slug" element={<FpoListByName />} />
          </Routes>
        </main>
        <div>
          <EnquiryBuyer buyerID={user._id} />
        </div>
        <div>
          <Footer user={user} />
        </div>

        {/* Non Reg, Enquiry */}
        {isNonRegEnquiryIOpen && (
          <NonRegEnquiry
            onCancel={() => setIsNonRegEnquiryIOpen(false)}
            onConfirm={() => setIsNonRegEnquiryIOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default Buyer;
