import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../commons/Toastify";

const AddNewProduct = ({ user }) => {
  let { id, selectedcategories } = useParams();
  const [productID, setProductID] = useState(id && id || null);
  const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
  const [selectedcategory, setSelectedcategory] = useState(selectedcategories || '');


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL_PRO}/getpid/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedcategory(data.categoryID.name);
          // setSelectedQuality(data.quantity);
          setFormData({
            ...formData,
            title: data.title || '',
            description: data.description || '',
            photo: data.images || '',
            price: data.price || '',
            cutprice: data.cutprice || '',
            quantity: data.quantity || '',
            instock: data.instock || '',
            warranty: data.warranty || '',
            brand: data.brandID.name || '',
            subsubcategory: data.subsubcategoryID.name || '',
            subsescategory: data.subsescategoryID.name || '',
          });
          setSpecifications(data.specifications || [{ title: "", desc: "" }]);
          setSelectedCategory(data.categoryID.name || '');
          setSelectedSubcategory(data.subcategoryID.name || '');
        } else {
          console.error('Error fetching product:', await response.json());
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(selectedcategory && selectedcategory || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState('');
  const [selectedSubsescategory, setSelectedSubsescategory] = useState('');



  const [subcategories, setSubcategories] = useState([]);
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [subsescategories, setSubsescategories] = useState([]);

  const [specifications, setSpecifications] = useState([{ title: "", desc: "" }]);

  const [selectedQuality, setSelectedQuality] = useState('');

  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: '',
    price: '',
    cutprice: '',
    quantity: '',
    instock: '',
    warranty: selectedcategory && selectedcategory === "AgriOutput" ? "N/A" : '',
    brand: '',
    category: '',
    subcategory: '',
    subsubcategory: '',
    subsescategory: '',
    country: user?.addressID.country,
    state: user?.addressID.state,
    city: user?.addressID.city,
    nearby: user?.addressID.address_line1,
    postal_code: user?.addressID.postal_code,
    vendorID: user?._id
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setCategories(user?.categoryID || [])
  }, [user])


  // Handle category selection
  useEffect(() => {
    const category = categories.find(cat => cat.name === selectedCategory);
    if (category && category.subcategoriesID) {
      setSubcategories(category.subcategoriesID || []);
    } else {
      setSubcategories([]);
    }
    setSelectedSubcategory('');
  }, [selectedCategory, categories]);

  // Handle subcategory selection
  useEffect(() => {
    const subcategory = subcategories.find(cat => cat.name === selectedSubcategory);
    if (subcategory && subcategory.subsubcategoriesID) {
      setSubsubcategories(subcategory.subsubcategoriesID || []);
    } else {
      setSubsubcategories([]);
    }
    setSelectedSubsubcategory('');
  }, [selectedSubcategory, subcategories]);

  // Handle subsubcategory selection
  useEffect(() => {
    const subsubcategory = subsubcategories.find(cat => cat.name === selectedSubsubcategory);
    if (subsubcategory && subsubcategory.subsescategoryID) {
      setSubsescategories(subsubcategory.subsescategoryID || []);
    } else {
      setSubsescategories([]);
    }
    setSelectedSubsescategory('');
  }, [selectedSubsubcategory, subsubcategories]);

  // Update formData when selectedCategory or selectedSubcategory changes
  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      subsubcategory: selectedSubsubcategory,
      subsescategory: selectedCategory !== "AgriInput" ? formData.title : formData.subsescategory,
      quantity: selectedCategory === "AgriOutput" ? selectedQuality : formData.quantity
    }));
  }, [selectedCategory, selectedSubcategory, selectedSubsubcategory, selectedSubsescategory, selectedQuality]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file && file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        photo: 'File size should be less than 1MB.',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, photo: file }));
    setErrors((prev) => ({ ...prev, photo: '' })); // Clear error

    // Optional: Show preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photoPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };




  const handleSpecificationsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSpecs = [...specifications];
    updatedSpecs[index][name] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { title: "", desc: "" }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      let formattedValue = value.replace(/\/kg|\/day/g, ''); // Remove existing /kg or /day

      if (selectedcategory === "AgriOutput") {
        formattedValue += "/kg"; // Append /kg for AgriOutput
      }

      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };



  const validateForm = () => {
    const newErrors = {};
    // Basic fields
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Valid price is required";

    if (selectedcategory === 'AgriInput' || selectedcategory === 'AgriOutput') {
      if (!formData.instock) {
        newErrors.instock = 'Valid in-stock is required';
      }
    }


    if (selectedcategory !== 'AgriInput') {
      if (!formData.quantity) {
        newErrors.quantity = 'Valid quantity is required';
      }
    }

    if (!formData.subsubcategory) newErrors.subsubcategory = "Product Type is required";
    if (!formData.subsescategory) newErrors.subsescategory = "Product Name is required";
    if (!agree) newErrors.agree = "You must agree to the terms and conditions";

    // Additional validations
    if (specifications.length === 0) {
      newErrors.specifications = "At least one specification is required";
    } else {
      specifications.forEach((spec, index) => {
        if (!spec.title) newErrors[`specTitle_${index}`] = "Specification title is required";
        if (!spec.desc) newErrors[`specDesc_${index}`] = "Specification description is required";
      });
    }

    if (!formData.brand) newErrors.brand = "Brand is required";
    // if (!formData.warranty) newErrors.warranty = "Warranty is required";
    if (selectedcategory !== "AgriOutput" && !formData.warranty) {
      newErrors.warranty = "Warranty is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare the FormData object
    const productData = new FormData();
    productData.append('title', formData.title);
    productData.append('description', formData.description);
    productData.append('photo', formData.photo);
    productData.append('price', formData.price);
    productData.append('cutprice', formData.cutprice);
    productData.append('quantity', formData.quantity);
    productData.append('instock', formData.instock);
    productData.append('specifications', JSON.stringify(specifications)); // Convert specifications to JSON string
    productData.append('warranty', formData.warranty);
    productData.append('brand', formData.brand);
    productData.append('category', formData.category);
    productData.append('subcategory', formData.subcategory);
    productData.append('subsubcategory', formData.subsubcategory);
    productData.append('subsescategory', formData.subsescategory);
    productData.append('country', formData.country);
    productData.append('state', formData.state);
    productData.append('city', formData.city);
    productData.append('nearby', formData.nearby);
    productData.append('postal_code', formData.postal_code);
    productData.append('vendorID', formData.vendorID);

    // console.log('FormData contents:', formData);
    // for (let [key, value] of productData.entries()) {
    //   console.log(`${key}:`, value);
    // };


    try {
      // Determine the request URL and method
      const url = productID
        ? `${process.env.REACT_APP_API_URL_PRO}/updatebyid/${productID}`
        : `${process.env.REACT_APP_API_URL_PRO}/post`;

      const method = productID ? 'PUT' : 'POST';

      // Send the request
      const response = await fetch(url, {
        method,
        body: productData,
      });

      const result = await response.json();
      if (response.ok) {
        // console.log('Success:', result);

        // Show the success toast
        setToast({
          show: true,
          type: 'success',
          title: 'Success',
          message: !productID ? 'Product added successfully!' : 'Product updated successfully!',
        });

        // Reset the form data
        resetdata();

        setSpecifications([{ title: "", desc: "" }]);
        setAgree(false);

        // Show the success toast for 1 seconds, then navigate
        setTimeout(() => {
          navigate('/products');
        }, 1000);

      } else {
        console.error('Error:', result);

        // Show the error toast
        setToast({
          show: true,
          type: 'error',
          title: 'Error',
          message: result.message || 'Failed to add or update product.',
        });

        // Show the success toast for 1 seconds, then navigate
        setTimeout(() => {
          setToast({ show: false });
        }, 1000); // Hide toast after 1 seconds
      }
    } catch (error) {
      console.error('Error adding product:', error);

      // Show the error toast
      setToast({
        show: true,
        type: 'error',
        title: 'Error',
        message: error.message || 'An error occurred. Please try again.',
      });

      setTimeout(() => {
        setToast({ show: false });
      }, 1000); // Hide toast after 1 seconds
    }
  };

  const resetdata = () => {
    setFormData({
      title: '',
      description: '',
      photo: '',
      price: '',
      cutprice: '',
      quantity: '',
      instock: '',
      specifications: '',
      warranty: '',
      brand: '',
      category: '',
      subcategory: '',
      subsubcategory: '',
      subsescategory: '',
      country: user?.addressID?.country || '',
      state: user?.addressID?.state || '',
      city: user?.addressID?.city || '',
      nearby: user?.addressID?.address_line1 || '',
      postal_code: user?.addressID?.postal_code || '',
      vendorID: user?._id || ''
    });
    setSpecifications([{ title: "", desc: "" }]);
    setAgree(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">{productID ? 'Edit Product' : 'Add New Product'}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          {/* Title */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={selectedcategory && selectedcategory === "AgriServices" ? "Enter Service title" : "Enter product title"}
              className={`w-full rounded border-[1.5px] ${errors.title ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder={selectedcategory && selectedcategory === "AgriServices" ? "Enter Service description" : "Enter product description"}
              className={`w-full rounded border-[1.5px] ${errors.description ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
            />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>

          {/* Price and Quantity */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2 relative">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2 relative">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {selectedcategory && selectedcategory === "AgriServices" ? "Charge Fees" : "Sell Price"}
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price.replace(/\/kg|\/day/g, '')}
                    onChange={handleInputChange}
                    placeholder={selectedcategory && selectedcategory === "AgriServices" ? "Enter services Fees" : "Enter product price"}
                    className={`w-full rounded border-[1.5px] ${errors.price ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                  />
                  {selectedcategory && selectedcategory === "AgriOutput" && <span className="absolute inset-y-0 right-0 flex items-center lg:text-xl pr-3 mt-8">/kg</span>}
                  {/* {selectedcategory && selectedcategory === "AgriServices" && <span className="absolute inset-y-0 right-0 flex items-center lg:text-xl pr-3 mt-8">/day</span>} */}
                  {errors.price && <p className="text-red-500">{errors.price}</p>}
                </div>

                <div className="w-full xl:w-1/2 relative">
                  {/* cuuted Price */}
                  <label className="mb-2.5 block text-black dark:text-white">
                    {selectedcategory && selectedcategory === "AgriServices" ? "Actual Fees" : "Actual Price"}
                  </label>
                  <input
                    type="text"
                    name="cutprice"
                    value={formData.cutprice}
                    onChange={handleInputChange}
                    placeholder={`₹999`}
                    className={`w-full rounded border-[1.5px] ${errors.price ? 'border-red-500' : 'border-stroke'}
                     bg-transparent py-3 px-5 text-black outline-none transition focus:border-success
                      dark:border-form-strokedark dark:bg-form-input dark:text-white
                       dark:focus:border-success placeholder:line-through line-through
                       `}
                  />
                </div>
              </div>
            </div>

            {/*  In Stock */}
            <div className="w-full xl:w-1/2 relative">
              <div className={`${selectedcategory !== 'AgriServices' ? 'mb-4.5 flex flex-col gap-6 xl:flex-row' : ''}`}>
                {(selectedcategory === 'AgriInput' || selectedcategory === 'AgriOutput') && (
                  <div className="w-full xl:w-1/2 relative">
                    <label className="mb-2.5 block text-black dark:text-white">
                      In Stock
                    </label>
                    <input
                      type="number"
                      name="instock"
                      value={formData.instock}
                      onChange={handleInputChange}
                      placeholder="Enter number of stock"
                      className={`w-full rounded border-[1.5px] ${errors.instock ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                    />
                    {errors.instock && <p className="text-red-500">{errors.instock}</p>}
                  </div>
                )}

                {/* Quantity */}
                <div
                  className={`${selectedcategory !== 'AgriServices' ? 'w-full xl:w-1/2 relative"' : ''}`}
                >
                  <label className="mb-2.5 block text-black dark:text-white">
                    {
                      selectedcategory === "AgriOutput"
                        ? 'Quality'
                        : selectedcategory === "AgriServices"
                          ? 'Booking'
                          : 'Quantity'
                    }
                  </label>

                  {
                    selectedcategory && selectedcategory === "AgriOutput" ? (
                      <select
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                        required
                      >
                        <option value="">Select a quality</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder={
                          selectedcategory === "AgriServices" ? "Enter prior booking" : "Enter a quantity"
                        }
                        className={`w-full rounded border-[1.5px] ${errors.quantity ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                      />
                    )
                  }
                  {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Brand  and Warranty */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                {
                  selectedcategory && selectedcategory === "AgriServices" ? "Transportation" : "Brand"
                }
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder={
                  selectedcategory && selectedcategory === "AgriServices" ? "Enter Place" : "Enter your company name"
                }
                className={`w-full rounded border-[1.5px] ${errors.brand ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
              />
              {errors.brand && <p className="text-red-500">{errors.brand}</p>}
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                {
                  selectedcategory === "AgriOutput"
                    ? 'Optional field'
                    : selectedcategory === "AgriServices"
                      ? 'Service Area'
                      : 'Warranty'
                }
              </label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                disabled={selectedcategory === "AgriOutput" ? true : false}
                onChange={handleInputChange}
                placeholder={
                  selectedcategory === "AgriOutput"
                    ? 'Enter product warranty details'
                    : selectedcategory === "AgriServices"
                      ? 'Enter your service area'
                      : 'Enter product warranty details'
                }
                className={`w-full rounded border-[1.5px] ${errors.warranty ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
              />
              {errors.warranty && <p className="text-red-500">{errors.warranty}</p>}
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Specifications (format: title: desc, one per line)
            </label>
            {specifications && specifications.map((spec, index) => (
              <div key={index} className="flex items-center mb-2 gap-4">
                <input
                  type="text"
                  name="title"
                  value={spec.title}
                  onChange={(e) => handleSpecificationsChange(e, index)}
                  placeholder="title"
                  className={`w-1/2 rounded border-[1.5px] ${errors[`specTitle_${index}`] ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                />
                {errors[`specTitle_${index}`] && <p className="text-red-500">{errors[`specTitle_${index}`]}</p>}
                <input
                  type="text"
                  name="desc"
                  value={spec.desc}
                  onChange={(e) => handleSpecificationsChange(e, index)}
                  placeholder="description"
                  className={`w-1/2 ml-2 rounded border-[1.5px] ${errors[`specDesc_${index}`] ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                />
                {errors[`specDesc_${index}`] && <p className="text-red-500">{errors[`specDesc_${index}`]}</p>}
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecification}
              className="text-blue-500"
            >
              Add Specification
            </button>
            {errors.specifications && <p className="text-red-500">{errors.specifications}</p>}
          </div>

          {/* Category and Subcategory */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">Category</label>
              {selectedcategory && selectedcategory ? (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                  required
                >
                  <option value="">Select a category</option>
                  {categories && categories.map(category => (
                    <option key={category._id}>
                      {category.name === selectedcategory ? selectedcategory : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                  required
                >
                  <option value="">Select a category</option>
                  {categories && categories.map(category => (
                    <option key={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">Subcategory</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                required
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {subcategories && subcategories.map(subcategory => (
                  <option key={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">Subsubcategory</label>
              {selectedcategory && selectedcategory === "AgriOutput" ? (
                <input
                  type="text"
                  name="subsubcategory"
                  value={formData.subsubcategory}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={`w-full rounded border-[1.5px] ${errors.subsubcategory ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                  required
                />
              ) : (
                <select
                  value={selectedSubsubcategory}
                  onChange={(e) => setSelectedSubsubcategory(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success"
                  required
                  disabled={!selectedSubcategory}
                >
                  <option value="">Select a subcategory</option>
                  {subsubcategories && subsubcategories.map(subsubcategory => (
                    <option key={subsubcategory._id}>
                      {subsubcategory.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={`w-full xl:w-1/2 ${selectedcategory && selectedcategory === "AgriInput" ? 'block' : 'hidden'}`}>
              <label className="mb-2.5 block text-black dark:text-white">Product name</label>
              <input
                type="text"
                name="subsescategory"
                value={formData.subsescategory}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className={`w-full rounded border-[1.5px] ${errors.subsescategory ? 'border-red-500' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-success dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-success`}
                required
              />
              {errors.subsescategory && <p className="text-red-500">{errors.subsescategory}</p>}
            </div>
          </div>


          {/* Photo URL Input */}
          <div className="mb-4.5">
            <div className="mb-6">
              <label className="text-gray-800 text-[12px] block">Upload product photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-gray-800 text-[12px] border border-gray-300 rounded-md p-1"
              />
              {errors.photo && <p className="text-red-500 text-xl mt-1">{errors.photo}</p>}
              <p className="text-[10px] text-warning">
                product image should be less than 1mb *
              </p>
              {formData.photoPreview ? (
                <img
                  src={formData.photoPreview} // Use the preview URL
                  alt="Profile Preview"
                  className="h-32 w-32 object-cover rounded-full"
                />
              ) : formData.photo ? (
                <img
                  src={formData.photo} // Create an object URL for the selected photo
                  alt="Profile Preview"
                  className="h-32 w-32 object-cover rounded-full"
                />
              ) : (
                <p>No photo selected</p>
              )}
            </div>
            {errors.images && <p className="text-red-500">{errors.images}</p>}
          </div>

          {/* Agree to terms */}
          <div className="mb-4.5 flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="h-5 w-5 rounded border-stroke bg-transparent text-success focus:border-success dark:border-form-strokedark dark:bg-form-input"
            />
            <label className="text-black dark:text-white">I Agree with Terms & Conditions*</label>
            {errors.agree && <p className="text-red-500">{errors.agree}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded bg-success py-3 px-5 text-center text-white transition hover:bg-green-600 focus:outline-none"
          >
            {productID ? 'Update Product' : 'Add Product'}
          </button>
        </div >
      </form >

      {/* Toast notification */}
      {
        toast.show && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast({ show: false })} />
          </div>
        )
      }

    </div >
  );
};

export default AddNewProduct;