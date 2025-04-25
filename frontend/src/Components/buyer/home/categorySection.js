import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

// Update Icons to an array
const Icons = [
  "https://res.cloudinary.com/dm71xhdxd/image/upload/v1722493862/Capture_wg3tob.png",
  "https://res.cloudinary.com/dm71xhdxd/image/upload/v1722494946/Capture2_kaizot.png",
  "https://res.cloudinary.com/dm71xhdxd/image/upload/v1722495439/Capture4_ynegrt.png"
];

const CategorySection = () => {
  const [data, setData] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [firstcatvalue, setFirstCatValue] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/category/all`);

        if (!categoryResponse.ok) {
          throw new Error(`HTTP error! Status: ${categoryResponse.status}`);
        }

        const categoryData = await categoryResponse.json();

        setData(categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (id) => {
    setHoveredCategoryId(id);
    setHovered(true);
  };


  const handleMouseLeave = () => setHoveredCategoryId(null);

  const getsubcategoriesID = (id) => {
    const category = data.find(cat => cat._id === id);
    return category ? category.subcategoriesID : [];
  };


  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    const category = data.find(cat => cat._id === hoveredCategoryId);

    if (category) {
      setFirstCatValue(category.name);
    } else {
      setFirstCatValue('');
    }
  }, [hoveredCategoryId, data]);


  return (
    <>
      <div
        className="mb-2"
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid lg:grid-cols-5 sm:grid-cols-2 mx-auto bg-white dark:bg-boxdark shadow-md dark:shadow-none cursor-pointer">
          {data.map((category, index) => (
            <Link
              to={`/${category.name}`}
              key={category._id}
              className="flex space-x-2 space-y-5 ms-5 p-1 lg:ms-40 w-full hover:bg-green-500 hover:text-white"
              onMouseEnter={() => {
                handleMouseEnter(category._id);
              }}
            >
              <img
                src={Icons[index % Icons.length]} // Show icons one by one
                className="w-16 h-16 rounded-full"
                alt="icon"
              />
              <a

                className="font-bold text-sm"
              >
                {category.name.substring(4)}
              </a>
            </Link>
          ))}
          <div className="flex ms-5 lg:ms-40 w-full hover:bg-green-500 hover:text-white">
            <img
              src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1726026793/GS-Agriculture-logo_l1n13s.svg"
              alt="GS Agriculture Logo"
              className="w-16"
            />
            <Link
              to="/products"
              className="flex font-bold mt-5 ms-2 whitespace-nowrap">
              All Categories
              <IoIosArrowForward className="mt-1 ms-3" />
            </Link>
          </div>

        </div>
        {hoveredCategoryId && (
          <div className={`flex space-x-3 bg-gray-100 p-4 border-t-2 bg-white dark:bg-boxdark shadow-md dark:shadow-none mb-2 cursor-pointer
          ${!hovered ? 'hidden' : 'block'}`}>
            {getsubcategoriesID(hoveredCategoryId).map((subcategory) => (
              <div key={subcategory._id} className="p-2">
                <h4 className="font-bold text-[13px]">{subcategory.name}</h4>
                <div className={`${subcategory.name === 'Off-Farms' ? 'grid grid-cols-2 gap-4' : ''}`}>
                  {subcategory.subsubcategoriesID && subcategory.subsubcategoriesID.length > 0 ? (
                    subcategory.subsubcategoriesID.map((sub) => (
                      <Link to={`/${firstcatvalue}/${subcategory.name}/${sub.name}`} key={sub.id}>
                        <p className={`p-2 text-[12px] hover:text-success hover:underline
                          ${sub.subsescategoryID.length > 0 ? 'block' : 'hidden'}`}>
                          {sub.name}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p>No subcategoriesID available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategorySection;
