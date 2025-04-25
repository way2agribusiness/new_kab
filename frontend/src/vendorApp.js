import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Components/vendor/Header/index.js';
import Sidebar from './Components/vendor/Sidebar/index.js';
import DashboardVendor from './Components/vendor/dashboardVendor.js';
import ProductVendor from './Components/vendor/products/productVendor.js';
import EnquiriesVendor from './Components/vendor/Enquiry/enquiriesVendor.js';
import LeadManagersVendor from './Components/vendor/Enquiry/leadManagersVendor.js';
import AddNewProduct from './Components/vendor/products/addNewProduct.js';
import { FaArrowLeft } from "react-icons/fa";
import UserProfile from './Components/buyer/profile/userProfile.js';
import ProductDetails from './Components/vendor/products/productDetails.js';
import LeadEnquiryDetails from './Components/vendor/Enquiry/leadEnquiryDetails.js';
import VendorEnquiryDetails from './Components/vendor/Enquiry/enquiryVdetails.js';
import GeneralEnquiryVendor from './Components/vendor/Enquiry/generalEnquiries.js';
import GeneralEnquiryDetailsVendor from './Components/vendor/Enquiry/genEnqDetails.js';



const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-4">
      <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline dark:text-blue-400">
        <FaArrowLeft className="inline-block mr-2" />
        Back
      </button>
    </div>
  );
};


const VendorApp = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="text-black dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
            <main className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <BackButton />
              <Routes>
                <Route exact path="/" element={<DashboardVendor user={user} />} />
                <Route exact path="/dashboard" element={<DashboardVendor user={user} />} />
                <Route exact path="/products" element={<ProductVendor user={user} />} />
                <Route exact path="/products/:slug" element={<ProductVendor user={user} />} />
                <Route exact path="/add-new-products/category/:selectedcategories" element={<AddNewProduct user={user} />} />
                <Route exact path="/add-new-products/:id" element={<AddNewProduct user={user} />} />
                <Route exact path='/vendor/products/details/:id' element={<ProductDetails />} />
                <Route exact path="/enquiries" element={<EnquiriesVendor user={user} />} />
                <Route exact path="/enquiries/vendor/details/:id" element={<VendorEnquiryDetails />} />
                <Route exact path="/general/enquiry" element={<GeneralEnquiryVendor user={user} />} />
                <Route exact path="/general/enquiry/details/:id" element={<GeneralEnquiryDetailsVendor />} />
                <Route exact path="/lead-managers" element={<LeadManagersVendor user={user} />} />
                <Route exact path="/lead-managers/enquiry/details/:id" element={<LeadEnquiryDetails />} />
                <Route exact path="/vendor/profile" element={<UserProfile user={user} />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default VendorApp;