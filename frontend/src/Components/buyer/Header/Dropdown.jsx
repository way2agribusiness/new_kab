import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";

const Dropdown = ({ category }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <a
        className="mt-4 flex items-center"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onClick={toggleDropdown}
      >
        <MdArrowDropDown className="text-2xl mb-2" />
      </a>
      {isDropdownOpen && (
        <div className="absolute right-0 w-48 bg-white text-black dark:text-bodydark dark:bg-boxdark shadow-lg rounded-md overflow-hidden z-10">
          <Link
            to={`/${category.name}`}
            className="flex items-center text-[12px] px-4 py-1 text-gray-800 hover:bg-gray-200 hover:text-success"
            onClick={() => setIsDropdownOpen(false)}
          >
            All
          </Link>
          {category.subcategoriesID.map((subcategory) => (
            <Link
              key={subcategory._id}
              to={`/${category.name}/${subcategory.name}`}
              className="flex items-center text-[12px] px-4 py-1 text-gray-800 hover:bg-gray-200 hover:text-success"
              onClick={() => setIsDropdownOpen(false)}
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
