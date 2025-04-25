import React, { useState, useEffect } from "react";
import RegisterRoles from "../../commons/registerRoles";
import { FaEdit } from 'react-icons/fa';
import axios from "axios";


const UserProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(user?.aboutID?.description || '');
    const [keywords, setKeywords] = useState(user?.aboutID?.keys.map(key => key.keywords) || ['', '', '', '', '']);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVendor, setIsVendor] = useState(user && user.roleID.name === 'Vendor' ? true : false);

    useEffect(() => {
        if (user?.aboutID) {
            setDescription(user?.aboutID?.description || '');
            setKeywords(user?.aboutID?.keys.map(key => key.keywords) || ['', '', '', '', '']);
        }
    }, [user]);

    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const handleKeywordsChange = (index, e) => {
        const updatedKeywords = [...keywords];
        updatedKeywords[index] = e.target.value;
        setKeywords(updatedKeywords);
    };

    // Function to handle creating or updating About data
    const handleAboutSubmit = async () => {
        setIsLoading(true);
        const aboutData = {
            description,
            keys: keywords.map(keyword => ({ keywords: keyword }))
        };

        const url = user?.aboutID
            ? `${process.env.REACT_APP_API_URL}/about/update/${user._id}`  // PUT if aboutID exists
            : `${process.env.REACT_APP_API_URL}/about/post`;  // POST if aboutID doesn't exist

        const method = user?.aboutID ? 'put' : 'post';

        try {
            const response = await axios({
                method,
                url,
                data: {
                    userID: user._id,  // Ensure you're sending the correct userID
                    ...aboutData
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert(user?.aboutID ? 'About updated successfully!' : 'About created successfully!');
                setIsEditingAbout(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error in submitting about data:', error);
            alert('Error while saving about data!');
        } finally {
            setIsLoading(false);
        }
    };


    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };


    return (
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <section>
                <img
                    src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1735623001/KAB-web-banner-update_es9uvx.png"
                    alt="home.pic"
                    className="object-cover"
                    style={{
                        width: "100%",
                        cursor: "pointer",
                        height: "100%"
                    }}
                />
            </section>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                <div className="relative z-30 mx-auto -mt-8 sm:-mt-22 h-16 w-full max-w-16 rounded-full p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                    <div className="relative drop-shadow-2">
                        {user && user.photo ? (
                            <img
                                src={user.photo}
                                alt="profile"
                                className="w-16 h-16 sm:w-full sm:h-28 md:h-36 rounded-full"
                            />
                        ) : (
                            <div className="bg-green-300 w-16 h-16 sm:w-full sm:h-28 md:h-36  flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold text-white">
                                {`${user && user.username.charAt(0) || ''}${user && user.username.split(' ')[1]?.charAt(0) || ''}`}
                            </div>
                        )}
                    </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-600 dark:text-white">{user && user.username}</h3>
                <span className="block text-base font-medium text-body-dark">{user && user.roleID.name}</span>


                <div className={`${isVendor ? 'block' : 'hidden'} border rounded-lg shadow-md p-4 mb-6`}>
                    <h4 className="text-green-600 font-bold">" About Us "</h4>
                    <div className="mb-2">
                        {isEditingAbout ? (
                            <textarea
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder="write a description about your business..."
                                className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                rows="4"
                            />
                        ) : (
                            <p className="text-sm mb-2">{description}</p>
                        )}
                    </div>

                    <div>
                        <h4 className="text-green-600 font-bold">" Key Highlights "</h4>
                        <div className="mt-2">
                            {isEditingAbout ? (
                                <>
                                    {keywords.map((keyword, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={keyword}
                                            onChange={(e) => handleKeywordsChange(index, e)}
                                            placeholder="key-highlights..."
                                            className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                                        />
                                    ))}
                                </>
                            ) : (
                                <p className="flex flex-wrap justify-center gap-2 text-black text-sm">
                                    {keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="bg-green-200 px-5 py-1 rounded-md"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        {isEditingAbout ? (
                            <>
                                <button
                                    onClick={handleAboutSubmit}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-white bg-amber-500 hover:bg-amber-600 border border-slate-200 rounded-lg mr-2"
                                >
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                                <button
                                    onClick={() => setIsEditingAbout(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <FaEdit
                                onClick={() => setIsEditingAbout(true)}
                                className="cursor-pointer text-amber-500"
                            />
                        )}
                    </div>
                </div>


                <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                    <button
                        onClick={handleEditClick}
                        className="flex items-center justify-center rounded-md border 
                        border-success bg-transparent px-5 py-2.5 text-base font-medium
                        hover:bg-success hover:text-white"
                    >
                        <FaEdit className="mr-2" /> {/* Add the edit icon here */}
                        Edit Profile
                    </button>
                </div>
                {isEditing && <RegisterRoles user={user} />}
            </div>
        </div>
    );
};

export default UserProfile;
