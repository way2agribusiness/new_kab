import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import DropdownUser from "./DropdownUser";
import DarkModeSwitcher from "./DarkModeSwitcher";
import Dropdown from "./Dropdown";

const Header = ({ user }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/category/all`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Function to format the category name
  const formatCategoryName = (name) => {
    return name.length > 4 ? `${name.slice(0, 4)}  ${name.slice(4)}` : name;
  };

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white dark:bg-boxdark shadow-md dark:shadow-none">
      <div className="flex items-center justify-between w-full px-4 py-4 md:px-6 2xl:px-11">
        {/* Hamburger Toggle Button */}
        <button
          aria-controls="mobile-menu"
          onClick={() => setNavOpen(!navOpen)}
          className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-success"
        >
          <MdMenu className="w-6 h-6" />
        </button>

        {/* Logo for Mobile Screens */}
        <Link className="block lg:hidden" to="/">
          <img
            src="https://res.cloudinary.com/dq7vggsop/image/upload/v1711532480/jfqcm2s1ekxloucjk72p.png"
            alt="Logo"
            className="w-10 h-10"
          />
        </Link>

        {/* Logo for Larger Screens */}
        <Link className="hidden lg:block flex-shrink-0" to="/">
          <img
            src="https://res.cloudinary.com/dq7vggsop/image/upload/v1711532480/jfqcm2s1ekxloucjk72p.png"
            alt="Logo"
            className="w-12 h-12 me-18"
          />
        </Link>

        {/* Navigation Links for Larger Screens */}
        <nav className="hidden lg:flex items-center gap-12 flex-grow">
          <Link
            to="/"
            className={`text-gray-800 font-bold dark:text-gray-100 hover:text-success dark:hover:text-success ${
              isActive("/") ? "text-success" : ""
            }`}
          >
            Home
          </Link>
          {categories.map((category) => (
            <div key={category._id} className="flex items-center">
              <Link
                to={`/${category.name}`}
                className={`text-gray-800 font-bold dark:text-gray-100 hover:text-success dark:hover:text-success ${
                  isActive(`/${category.name}`) ? "text-success" : ""
                }`}
              >
                {formatCategoryName(category.name)}
              </Link>
              <Dropdown category={category} />
            </div>
          ))}
          <Link
            to="/fpo-connect"
            className={`text-gray-800 font-bold dark:text-gray-100 hover:text-success dark:hover:text-success ${
              isActive("/fpo-connect") ? "text-success" : ""
            }`}
          >
            FPO Connect
          </Link>
        </nav>

        {/* User and Notification Icons */}
        <div className="flex items-center gap-10">
          <ul className="flex items-center gap-6">
            <DarkModeSwitcher />
          </ul>
          <DropdownUser user={user} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-white dark:bg-boxdark border-t border-gray-200 dark:border-gray-700 transform transition-transform ${
          navOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Logo in Mobile Menu */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dq7vggsop/image/upload/v1711532480/jfqcm2s1ekxloucjk72p.png"
                alt="Logo"
                className="w-10 h-10"
              />
            </Link>
            <button
              onClick={() => setNavOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-success"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center justify-center flex-grow space-y-4 mt-4">
            <Link
              to="/"
              className={`text-gray-800 dark:text-gray-100 hover:text-success dark:hover:text-success text-xl ${
                isActive("/") ? "text-success" : ""
              }`}
              onClick={() => setNavOpen(false)}
            >
              Home
            </Link>
            {categories.map((category) => (
              <div
                key={category._id}
                className="text-gray-800 dark:text-gray-100 hover:text-success dark:hover:text-success text-xl"
                onClick={() => setNavOpen(false)}
              >
                <Link
                  to={`/${category.name}`}
                  className={`${
                    isActive(`/${category.name}`) ? "text-success" : ""
                  }`}
                >
                  {formatCategoryName(category.name)}
                </Link>
              </div>
            ))}
            <Link
              to="/fpo-connect"
              className={`text-gray-800 font-bold dark:text-gray-100 hover:text-success dark:hover:text-success ${
                isActive("/fpo-connect") ? "text-success" : ""
              }`}
              onClick={() => setNavOpen(false)}
            >
              FPO Connect
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
