import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from "./Components/admin/Sidebar";
import Header from "./Components/admin/Header";
import DashboardAdmin from './Components/admin/dashboardAdmin.js';
import ProductAdmin from './Components/admin/products/productAdmin.js';
import EnquiriesAdmin from "./Components/admin/Enquiry/enquiriesAdmin.js";
import LeadManagersAdmin from './Components/admin/leadManagersAdmin.js';
import ProductDetails from "./Components/admin/products/productDetails.js";
import VendorList from "./Components/admin/List/vendorlist.js";
import BuyerList from "./Components/admin/List/buyerlist.js";
import VendorDetails from "./Components/admin/List/vendorDetails.js";
import BuyerDetails from "./Components/admin/List/buyerDetails.js";
import { FaArrowLeft } from "react-icons/fa";
import UserProfile from "./Components/buyer/profile/userProfile.js";
import EnquiryDetails from "./Components/admin/Enquiry/enquiryDetails.js";
import FeedbackList from "./Components/admin/List/feedback.js";
import GeneralEnquiries from "./Components/admin/Enquiry/generalEnquiries.js";
import GeneralEnquiryDetails from "./Components/admin/Enquiry/genEnquiriesDetails.js";
import AddEnquiries from "./Components/admin/Enquiry/addEnquiries.js";
import BlockedUsers from "./Components/admin/List/blockedUser.js";
import AddFPOAdmin from "./Components/admin/FPO-Admin/addFPO.js";
import FPOListAdmin from "./Components/admin/FPO-Admin/listFPO.js";

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

const AdminApp = ({ user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isNonRegEnquiryIOpen, setIsNonRegEnquiryIOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState();

    return (
        <Router>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
                <div className="flex h-screen overflow-hidden">
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        setIsNonRegEnquiryIOpen={setIsNonRegEnquiryIOpen}
                    />
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
                        <main className=" max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            <BackButton />
                            <Routes>
                                <Route exact path="/" element={<DashboardAdmin />} />
                                <Route exact path="/dashboard" element={<DashboardAdmin />} />
                                <Route exact path="/admin/profile" element={<UserProfile user={user} />} />
                                <Route exact path="/products" element={<ProductAdmin />} />
                                <Route exact path="/admin/products/details/:id" element={<ProductDetails />} />
                                <Route exact path="/vendors" element={<VendorList />} />
                                <Route exact path="/vendors/details/:id" element={<VendorDetails />} />
                                <Route exact path="/buyers" element={<BuyerList />} />
                                <Route exact path="/buyers/details/:id" element={<BuyerDetails />} />
                                <Route exact path="/blocked/list" element={<BlockedUsers />} />
                                <Route exact path="/registered/enquiries" element={<EnquiriesAdmin />} />
                                <Route exact path="/registered/enquiries/details/:id" element={<EnquiryDetails />} />
                                <Route exact path="/general/enquiries" element={<GeneralEnquiries user={user} />} />
                                <Route exact path="/general/enquiries/details/:id" element={<GeneralEnquiryDetails />} />
                                <Route exact path="/lead-managers" element={<LeadManagersAdmin />} />
                                <Route exact path="/feedback" element={<FeedbackList />} />
                                <Route exact path="/fpo-connect/add-content" element={<AddFPOAdmin
                                    user={user}
                                    selectedComponent={selectedComponent}
                                    setSelectedComponent={setSelectedComponent}
                                />}
                                />
                                <Route exact path="/fpo-connect/list-content" element={<FPOListAdmin setSelectedComponent={setSelectedComponent} />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </div>

            {/* Non Reg, Enquiry */}
            {isNonRegEnquiryIOpen && (
                <AddEnquiries
                    onCancel={() => setIsNonRegEnquiryIOpen(false)}
                    onConfirm={() => setIsNonRegEnquiryIOpen(false)}
                />
            )}
        </Router>
    );
};

export default AdminApp;
