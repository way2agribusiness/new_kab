import axios from "axios";
import React, { useState } from "react";
import { FaRegUser, FaUserAlt, FaEdit, FaAngleDown } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const DropdownMenu = ({ setSelectedComponent, user, setSelectedID }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [timer, setTimer] = useState(null);

    const handleMouseEnter = () => {
        if (timer) clearTimeout(timer);
        setTimer(setTimeout(() => setIsDropdownOpen(true), 100)); // Add delay before opening
    };
    
    const handleMouseLeave = () => {
        if (timer) clearTimeout(timer);
        setTimer(setTimeout(() => setIsDropdownOpen(false), 100)); // Delay before closing
    };
    
    const openDropDown = () => setIsDropdownOpen(true);

    const navigate = useNavigate();

    const handleMouseClick = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(false);
    };

    // Function to get the token from local storage
    const getToken = () => localStorage.getItem('token2');

    // Function to log out the user
    const logoutUser = async () => {
        try {
            const token = getToken();
            if (!token) {
                alert('No token found, please log in first');
                return;
            }

            // Make request to backend to clear the token
            await axios.post(`${process.env.REACT_APP_API_FPO}/logoutFPO`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove token from local storage
            localStorage.removeItem('token2');
            console.log('FPO logged out successfully');
            navigate(window.location.reload()); // Reloads the page after logging out

        } catch (err) {
            console.error('Error logging out user:', err);
        }
    };

    const editFPO = (userData) => {
        setSelectedComponent({
            link: 'Reg-FPO',
            data: userData
        });
    };

    return (
        <div
            className="relative" // To position dropdown relative to this container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMouseClick}
        >
            {/* User Icon */}
            <button className="flex gap-2 font-semibold hover:text-success">
                <FaRegUser /> 
                <span className="text-sm">Profile</span>
                <Link className="mt-1" 
                onClick={openDropDown}><FaAngleDown /></Link>
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
                <div className="absolute top-4 left-0 w-40 bg-white shadow-md dark:bg-boxdark rounded-md z-50 mt-2">
                    <ul className="text-gray-700">
                        <li>
                            <Link
                                className="flex items-center px-4 py-2 hover:bg-slate-100 hover:text-success"
                            >
                                <FaUserAlt className="mr-2 text-lg" />
                                <span>{user && user.username}</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => editFPO(user)}
                                className="flex items-center px-4 py-2 hover:bg-slate-100 hover:text-success"
                            >
                                <FaEdit className="mr-2 text-lg" />
                                <span>Edit</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={logoutUser}
                                className="flex items-center px-4 py-2 hover:bg-slate-100 hover:text-success"
                            >
                                <MdLogin className="mr-2 text-lg" />
                                <span>LogOut</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
