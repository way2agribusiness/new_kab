import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import FooterDocuments from "./documents";
import { Link, useNavigate } from "react-router-dom";
import Feedback from "./feedback";
import Toast from "./Toastify";
const Footer = ({ user }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const navigate = useNavigate("");

  // Function to open modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Function to open Form
  const openForm = () => {
    if (!user) {
      // Show the success toast
      setToast({
        show: true,
        type: "info",
        title: "info",
        message: "Please Login First!",
      });

      // Show the success toast for 1 seconds, then navigate
      setTimeout(() => {
        setToast({ show: false });
        navigate("/login");
      }, 1000);
      return;
    }
    setFormOpen(true);
  };

  // Function to close Form
  const closeForm = () => {
    setFormOpen(false);
  };

  return (
    <>
      <footer className="bottom-0 bg-green-700 text-white w-full px-4 border-t-4 dark:bg-boxdark dark:text-bodydark shadow-md dark:shadow-none">
        <div className="container mx-auto py-6 px-4 lg:px-0">
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
            <div>
              {/* intro */}

              <h3 className="text-xl font-bold mb-6">KarnatakaAgribusiness</h3>

              {/* Social + Logo Section */}
              <div className="lg:w-1/3">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex space-x-4 pl-5">
                    <a
                      href="https://www.facebook.com/people/Karnataka-Agribusiness/100057054596027/?locale=uk_UA"
                      aria-label="Facebook"
                    >
                      <FaFacebookF
                        className="text-gray-400  hover:text-white transition-colors"
                        size={20}
                      />
                    </a>
                    <a
                      href="https://x.com/KA_Agribusiness"
                      aria-label="Twitter"
                    >
                      <FaTwitter
                        className="text-gray-400 hover:text-white transition-colors"
                        size={20}
                      />
                    </a>
                    <a
                      href="https://www.instagram.com/karnataka_agribusiness/profilecard/?igsh=OGJheXpwc2l5MzQ2"
                      aria-label="Instagram"
                    >
                      <FaInstagram
                        className="text-gray-400 hover:text-white transition-colors"
                        size={20}
                      />
                    </a>
                    <a href="https://wa.me/919449004956" aria-label="WhatsApp">
                      <FaWhatsapp
                        className="text-gray-400 hover:text-white transition-colors"
                        size={20}
                      />
                    </a>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dq7vggsop/image/upload/v1711532480/jfqcm2s1ekxloucjk72p.png"
                    alt="Logo"
                    className="w-[200px] h-auto ml-6"
                  />
                </div>
              </div>
            </div>

            {/* Main Links Section */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
              {/* About Us */}
              <div>
                <h3 className="text-md font-semibold mb-4">About Us</h3>
                <ul className="space-y-2">
                  {[
                    { label: "About Us", id: "#WWA" },
                    { label: "User guidelines", id: "#UG" },
                    { label: "Disclaimer", id: "#DSLM" },
                    { label: "Address", id: "#add" },
                  ].map(({ label, id }) => (
                    <li key={label} onClick={openModal}>
                      <a
                        href={id}
                        className="text-gray-400 hover:text-yellow-300 transition-colors flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                        {label}
                      </a>
                    </li>
                  ))}
                  <li onClick={openForm}>
                    <span className="hover:cursor-pointer text-gray-400 hover:text-yellow-300 transition-colors flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Feedback
                    </span>
                  </li>
                </ul>
              </div>

              {/* Vendor Tool Kit */}
              <div>
                <h3 className="text-md font-semibold mb-4">Vendor Tool Kit</h3>
                <ul className="space-y-2">
                  <li onClick={openModal}>
                    <a
                      href="#WCV"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Who can be a Vendor?
                    </a>
                  </li>
                  <li onClick={openModal}>
                    <a
                      href="#GDPV"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Guideline for Product Vendor
                    </a>
                  </li>
                  <li onClick={openModal}>
                    <a
                      href="#GSV"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Guidelines for Service Vendor
                    </a>
                  </li>
                  <li onClick={openModal}>
                    <a
                      href="#HBU"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      How you benefit with us?
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Get your leads
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Buyers Tool Kit */}
              <div>
                <h3 className="text-md font-semibold mb-4">Buyers Tool Kit</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#enquiry"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Post your requirement
                    </a>
                  </li>
                  <li onClick={openModal}>
                    <a
                      href="#GFB"
                      className="text-gray-400 hover:text-yellow-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Guidelines for buyers
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="">
                <h3 className="text-md font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span>
                      {" "}
                      #636, BDA Block 2, APMC (RMC) Yard, Yeshwanthpura,
                      Bengaluru - 560022
                    </span>
                  </li>

                  <li className="flex items-center text-gray-400">
                    9449004956
                  </li>
                  <li className="flex items-center text-gray-400">
                    karnatakaagribusiness@gmail.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Map Section */}
        <div>
          <div className="mt-4 flex justify-center items-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7774.622049300553!2d77.5425519!3d13.015855!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d16cdf05995%3A0x3710354fdabf9e1b!2sWay2Agribusiness%20India%20Pvt%20LTD!5e0!3m2!1sen!2sin!4v1729484414022!5m2!1sen!2sin"
              width="70%" // Responsive width
              height="200" // Height adjusted to match your design
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KarnatakaAgribusiness"
              className="rounded-2xl shadow-lg"
            ></iframe>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-4">
          <div className="text-center text-gray-400 text-sm pb-3">
            <p>
              © Way2Agribusiness {new Date().getFullYear()}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Conditionally render the modal */}
      {isModalOpen && <FooterDocuments closeModal={closeModal} />}

      {/* Conditionally render the Form */}
      {isFormOpen && <Feedback closeForm={closeForm} userID={user._id} />}

      {/* Toast notification */}
      {toast.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast({ show: false })}
          />
        </div>
      )}
    </>
  );
};

export default Footer;
