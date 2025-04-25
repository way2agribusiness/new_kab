import Product from "../Models/Product/productModels.js";
import Brand from "../Models/Product/brandModels.js";
import Category2 from "../Models/Product/category2Models.js";
import Subcategory from "../Models/Product/subcategoryModels.js";
import Subsubcategory from "../Models/Product/subsubcategoryModels.js";
import Subsescategory from "../Models/Product/subsescategory.js";
import User from "../Models/User/userModels.js";
import VendorEnquiry from "../Models/Enquiry/vendorEnquiry.js";
import mongoose from "mongoose";
import AdminEnquiry from "../Models/Enquiry/adminEnquiry.js";
import commonFunctions from "../utils/commonFunctions.js";
import constants from "../utils/constants.js";
import Rating from "../Models/Product/ratingModels.js";

// Access your constants like this:
const pagination = constants.PAGINATION;
const userTypes = constants.USER_TYPES;
const helper = constants.HELPERS;
const messages = constants.MESSAGES;
const errorType = constants.ERROR_TYPES;

// Get All Approved Product.......................
export const AllProductController = {};

AllProductController.getList = async (payload) => {
  const { size, page, searchString } = payload;

  const pageNo = page || pagination.DEFAULT_PAGE;
  const pageLimit = size || pagination.DEFAULT_PAGE_LIMIT;

  try {
    const locale = payload.headers["content-language"];
    let criteria = { isDeleted: { $ne: true }, isApproved: true };

    if (searchString) {
      const filterColumns = [
        { title: { $regex: searchString, $options: "i" } },
        { description: { $regex: searchString, $options: "i" } },
        { state: { $regex: searchString, $options: "i" } },
        { city: { $regex: searchString, $options: "i" } },
        { nearby: { $regex: searchString, $options: "i" } },
      ];
      // Check for category IDs based on name
      const categories = await Category2.find({
        name: { $regex: searchString, $options: "i" },
      });
      const categoryIds = categories.map((cat) => cat._id);
      if (categoryIds.length > 0) {
        filterColumns.push({ categoryID: { $in: categoryIds } });
      }

      // Check for subcategory IDs based on name
      const subcategories = await Subcategory.find({
        name: { $regex: searchString, $options: "i" },
      });
      const subcategoryIds = subcategories.map((sub) => sub._id);
      if (subcategoryIds.length > 0) {
        filterColumns.push({ subcategoryID: { $in: subcategoryIds } });
      }

      // Check for sub-subcategory IDs based on name
      const subsubcategories = await Subsubcategory.find({
        name: { $regex: searchString, $options: "i" },
      });
      const subsubcategoryIds = subsubcategories.map((subsub) => subsub._id);
      if (subsubcategoryIds.length > 0) {
        filterColumns.push({ subsubcategoryID: { $in: subsubcategoryIds } });
      }

      // Check for subsescategory IDs based on name
      const subsescategories = await Subsescategory.find({
        name: { $regex: searchString, $options: "i" },
      });
      const subsescategoryIds = subsescategories.map((subsec) => subsec._id);
      if (subsescategoryIds.length > 0) {
        filterColumns.push({ subsescategoryID: { $in: subsescategoryIds } });
      }

      criteria.$or = filterColumns;
    }

    const count = await Product.countDocuments(criteria);
    // Fetch unique random products using aggregation
    const rows = await Product.aggregate([
      {
        $match: {
          ...criteria,
          isApproved: true, // Add isApproved check here
        },
      },
      { $sample: { size: Number(pageLimit) } }, // Ensure size is a number
      {
        $lookup: {
          from: "brands",
          localField: "brandID",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $lookup: {
          from: "users", // Assuming vendor information is stored in the 'users' collection
          localField: "vendorID",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $project: {
          isApproved: 1,
          images: 1,
          title: 1,
          price: 1,
          cutprice: 1,
          instock: 1,
          quantity: 1,
          state: 1,
          city: 1,
          nearby: 1,
          vendorID: 1, // Include vendorID in the response
          categoryID: 1, // Include categoryID in the response
          brand: { $arrayElemAt: ["$brand.name", 0] },
          phone: { $arrayElemAt: ["$vendor.phone", 0] },
        },
      },
    ]);

    const paginationData = { count, pageNo, pageLimit, rows };
    const formattedResponse =
      commonFunctions.getPaginationResponse(paginationData);

    return Object.assign(
      helper.responseHelper.createSuccessResponse(
        messages.NEWS.NEWS_LIST_FETCHED_SUCCESSFULLY,
        locale
      ),
      formattedResponse
    );
  } catch (error) {
    throw helper.responseHelper.createErrorResponse(
      error.message,
      errorType.SOMETHING_WENT_WRONG
    );
  }
};

// Get All Approved Products with Priority for City and Title Match.......................
export const searchController = {};

searchController.getList = async (payload) => {
  const { size, page, searchString, city } = payload;

  // Convert size and page to numbers to avoid MongoDB errors
  const pageNo = Number(page) || pagination.DEFAULT_PAGE;
  const pageLimit = Number(size) || pagination.DEFAULT_PAGE_LIMIT;

  try {
    const locale = payload.headers["content-language"];

    // Primary criteria for products
    let exactCriteria = { isDeleted: { $ne: true }, isApproved: true };
    let relatedCriteria = { isDeleted: { $ne: true }, isApproved: true };

    // Apply city filter (mandatory for both)
    if (city) {
      exactCriteria.city = city;
      relatedCriteria.city = city;
    }

    // Apply title filter for exact match
    if (searchString) {
      exactCriteria.title = { $regex: searchString, $options: "i" }; // Case-insensitive search
    }

    // Count documents matching the primary exact criteria
    const count = await Product.countDocuments(exactCriteria);

    // Fetch prioritized products using aggregation with facets
    const rows = await Product.aggregate([
      {
        $facet: {
          // First facet: Exact match for city and title
          exactMatches: [
            { $match: exactCriteria },
            { $sample: { size: pageLimit } }, // Randomize exact matches
            {
              $lookup: {
                from: "brands",
                localField: "brandID",
                foreignField: "_id",
                as: "brand",
              },
            },
            {
              $lookup: {
                from: "users", // Assuming vendor information is stored in the 'users' collection
                localField: "vendorID",
                foreignField: "_id",
                as: "vendor",
              },
            },
            {
              $project: {
                isApproved: 1,
                images: 1,
                title: 1,
                price: 1,
                cutprice: 1,
                instock: 1,
                quantity: 1,
                state: 1,
                city: 1,
                nearby: 1,
                vendorID: 1,
                categoryID: 1,
                brand: { $arrayElemAt: ["$brand.name", 0] },
                phone: { $arrayElemAt: ["$vendor.phone", 0] },
              },
            },
          ],
          // Second facet: Related matches for city only (exclude title matching)
          relatedMatches: [
            { $match: relatedCriteria },
            { $sample: { size: pageLimit } }, // Randomize related matches
            {
              $lookup: {
                from: "brands",
                localField: "brandID",
                foreignField: "_id",
                as: "brand",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "vendorID",
                foreignField: "_id",
                as: "vendor",
              },
            },
            {
              $project: {
                isApproved: 1,
                images: 1,
                title: 1,
                price: 1,
                cutprice: 1,
                instock: 1,
                quantity: 1,
                state: 1,
                city: 1,
                nearby: 1,
                vendorID: 1,
                categoryID: 1,
                brand: { $arrayElemAt: ["$brand.name", 0] },
                phone: { $arrayElemAt: ["$vendor.phone", 0] },
              },
            },
          ],
        },
      },
      {
        $project: {
          // Combine exact matches and related matches
          rows: { $concatArrays: ["$exactMatches", "$relatedMatches"] },
        },
      },
      { $unwind: "$rows" }, // Unwind the combined results
      { $replaceRoot: { newRoot: "$rows" } }, // Flatten the structure
      { $limit: pageLimit }, // Limit the combined results
    ]);

    const paginationData = { count, pageNo, pageLimit, rows };
    const formattedResponse =
      commonFunctions.getPaginationResponse(paginationData);

    return Object.assign(
      helper.responseHelper.createSuccessResponse(
        messages.NEWS.NEWS_LIST_FETCHED_SUCCESSFULLY,
        locale
      ),
      formattedResponse
    );
  } catch (error) {
    throw helper.responseHelper.createErrorResponse(
      error.message,
      errorType.SOMETHING_WENT_WRONG
    );
  }
};

// Get Product By VendorID....................
export const productController = {};

productController.getProductsByVendorId = async (payload) => {
  const { vendorID, size, page, searchString } = payload;
  const pageNo = page || pagination.DEFAULT_PAGE;
  const pageLimit = size || pagination.DEFAULT_PAGE_LIMIT;

  try {
    const locale = payload.headers["content-language"];
    let criteria = { vendorID };

    // If searchString is provided, add search criteria
    if (searchString) {
      // Convert to string and trim any whitespace
      const regexSearchString = String(searchString).trim();

      if (regexSearchString) {
        const filterColumns = [
          { title: { $regex: regexSearchString, $options: "i" } },
        ];

        // Check for category names and add to the filter
        const categories = await Category2.find({
          name: { $regex: regexSearchString, $options: "i" },
        });
        const categoryIds = categories.map((cat) => cat._id);
        if (categoryIds.length > 0) {
          filterColumns.push({ categoryID: { $in: categoryIds } });
        }

        // If searchString matches "approved" or "not-approved", add that condition to the filter
        if (regexSearchString.toLowerCase() === "approved") {
          filterColumns.push({ isApproved: true });
        } else if (regexSearchString.toLowerCase() === "not approved") {
          filterColumns.push({ isApproved: false });
        }

        // If searchString matches "active" or "not-active", add that condition to the filter
        if (regexSearchString.toLowerCase() === "active") {
          filterColumns.push({ isActive: true });
        } else if (regexSearchString.toLowerCase() === "not active") {
          filterColumns.push({ isActive: false });
        }

        criteria.$or = filterColumns;
      }
    }

    // Count total products based on the criteria
    const totalItems = await Product.countDocuments(criteria);

    // Fetch products with pagination
    const rows = await Product.find(criteria)
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit)
      .select("title price images description isApproved isActive quantity")
      .populate("categoryID", "name");

    if (rows.length === 0) {
      return helper.responseHelper.createErrorResponse(
        "No products found for the given criteria.",
        "NOT_FOUND"
      );
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageLimit);

    // Return paginated response in desired format
    const paginationData = {
      currentPage: pageNo,
      pageLimit: pageLimit,
      totalPages: totalPages,
      totalItems: totalItems,
    };

    const responseData = {
      status: "success",
      message: "Products fetched successfully.",
      pagination: paginationData,
      data: rows, // Rename 'rows' to 'data' to match the response structure
    };

    return helper.responseHelper.createSuccessResponse(
      "Products fetched successfully.",
      responseData
    );
  } catch (error) {
    console.error(error);
    throw helper.responseHelper.createErrorResponse(
      error.message,
      "INTERNAL_SERVER_ERROR"
    );
  }
};

// Get All Product for Admin....................
export const adminProductController = {};

adminProductController.getAllProducts = async (payload) => {
  const { size, page, searchString } = payload;
  const pageNo = page || pagination.DEFAULT_PAGE;
  const pageLimit = size || pagination.DEFAULT_PAGE_LIMIT;

  try {
    const locale = payload.headers["content-language"];
    let criteria = { isActive: true };

    // If searchString is provided, add search criteria
    if (searchString) {
      // Convert to string and trim any whitespace
      const regexSearchString = String(searchString).trim();

      if (regexSearchString) {
        const filterColumns = [
          { title: { $regex: regexSearchString, $options: "i" } },
        ];

        // Check for category names and add to the filter
        const categories = await Category2.find({
          name: { $regex: regexSearchString, $options: "i" },
        });
        const categoryIds = categories.map((cat) => cat._id);
        if (categoryIds.length > 0) {
          filterColumns.push({ categoryID: { $in: categoryIds } });
        }

        // If searchString matches "approved" or "not-approved", add that condition to the filter
        if (regexSearchString.toLowerCase() === "approved") {
          filterColumns.push({ isApproved: true });
        } else if (regexSearchString.toLowerCase() === "not approved") {
          filterColumns.push({ isApproved: false });
        }

        criteria.$or = filterColumns;
      }
    }

    // Count total products based on the criteria
    const totalItems = await Product.countDocuments(criteria);

    // Fetch products with pagination
    const rows = await Product.find(criteria)
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit)
      .select(
        "title price images description isApproved quantity createdAt updatedAt"
      )
      .populate("categoryID", "name");

    if (rows.length === 0) {
      return helper.responseHelper.createErrorResponse(
        "No products found for the given criteria.",
        "NOT_FOUND"
      );
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageLimit);

    // Return paginated response in desired format
    const paginationData = {
      currentPage: pageNo,
      pageLimit: pageLimit,
      totalPages: totalPages,
      totalItems: totalItems,
    };

    const responseData = {
      status: "success",
      message: "Products fetched successfully.",
      pagination: paginationData,
      data: rows, // Rename 'rows' to 'data' to match the response structure
    };

    return helper.responseHelper.createSuccessResponse(
      "Products fetched successfully.",
      responseData
    );
  } catch (error) {
    console.error(error);
    throw helper.responseHelper.createErrorResponse(
      error.message,
      "INTERNAL_SERVER_ERROR"
    );
  }
};

// Save All Products By Vendor
export const saveProducts = async (req, res) => {
  const {
    title,
    description,
    price,
    cutprice,
    quantity,
    instock,
    specifications,
    warranty,
    brand,
    category,
    subcategory,
    subsubcategory,
    subsescategory,
    country,
    state,
    city,
    nearby,
    postal_code,
    vendorID,
  } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is missing" });
    }

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !cutprice ||
      !brand ||
      !category ||
      !vendorID
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the Cloudinary image URL from Multer
    const photoUrl = req.file.path;

    // Handle brand
    let brandexist = await Brand.findOne({ name: brand });
    if (!brandexist) {
      brandexist = new Brand({ name: brand });
      await brandexist.save();
    }

    let categoryDoc = await Category2.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = new Category2({ name: category });
      await categoryDoc.save();
    }

    let subcategoryDoc = await Subcategory.findOne({ name: subcategory });
    if (!subcategoryDoc) {
      subcategoryDoc = new Subcategory({ name: subcategory });
      await subcategoryDoc.save();
      // Update category with new subcategory reference
      categoryDoc.subcategoriesID.push(subcategoryDoc._id);
      await categoryDoc.save();
    }

    // Handle subsubcategory
    let subsubcategoryDoc = await Subsubcategory.findOne({
      name: subsubcategory,
    });
    if (!subsubcategoryDoc) {
      subsubcategoryDoc = new Subsubcategory({ name: subsubcategory });
      await subsubcategoryDoc.save();
      // Update subcategory with new subsubcategory reference
      if (!subcategoryDoc.subsubcategoriesID.includes(subsubcategoryDoc._id)) {
        subcategoryDoc.subsubcategoriesID.push(subsubcategoryDoc._id);
        await subcategoryDoc.save();
      }
    }

    // Handle subsescategory
    let subsescategoryDoc = await Subsescategory.findOne({
      name: subsescategory,
    });
    if (!subsescategoryDoc) {
      subsescategoryDoc = new Subsescategory({ name: subsescategory });
      await subsescategoryDoc.save();
      // Update subsubcategory with new subsescategory reference
      if (!subsubcategoryDoc.subsescategoryID.includes(subsescategoryDoc._id)) {
        subsubcategoryDoc.subsescategoryID.push(subsescategoryDoc._id);
        await subsubcategoryDoc.save();
      }
    }

    // Verify vendor
    let vendorexist = await User.findById(vendorID);
    if (!vendorexist) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Handle specifications: Check if it's already an object/array
    let specificationsParsed;
    try {
      specificationsParsed =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "Invalid JSON in specifications",
          error: error.message,
        });
    }

    // Create the Product instance
    const newproduct = new Product({
      title,
      description,
      images: photoUrl,
      price,
      cutprice,
      quantity,
      instock,
      specifications: specificationsParsed,
      // specifications: JSON.parse(specifications), // Ensure this is parsed from string to array
      warranty,
      isApproved: false, // Explicitly set isApproved to false
      isActive: false, // Explicitly set isActive to false
      brandID: brandexist._id,
      categoryID: categoryDoc._id,
      subcategoryID: subcategoryDoc._id,
      subsubcategoryID: subsubcategoryDoc._id,
      subsescategoryID: subsescategoryDoc._id,
      country,
      state,
      city,
      nearby,
      postal_code,
      vendorID: vendorexist._id,
    });

    // Save the product
    await newproduct.save();

    res
      .status(201)
      .json({ message: "Product saved successfully", product: newproduct });
  } catch (error) {
    console.error("Error while saving product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// GET product by Product ID
export const getProductById = async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findById(productID)
      .populate("brandID")
      .populate("categoryID")
      .populate("subcategoryID")
      .populate("subsubcategoryID")
      .populate("subsescategoryID")
      .populate({
        path: "vendorID",
        select: "-password",
        populate: {
          path: "roleID",
          model: "Role",
        },
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE product by productID
export const updateProductById = async (req, res) => {
  const { productID } = req.params; // Use productID from the request parameters
  const {
    title,
    description,
    price,
    cutprice,
    quantity,
    instock,
    specifications,
    warranty,
    brand,
    category,
    subcategory,
    subsubcategory,
    subsescategory,
    country,
    state,
    city,
    nearby,
    postal_code,
  } = req.body;

  try {
    // Find the product by its ID
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Default photo URL (if no new photo is uploaded)
    let photoUrl = product.images;

    // If a new photo is uploaded, update the photoUrl with the new file path
    if (req.file) {
      // console.log("Uploaded file:", req.file);  // Debugging log to check uploaded file
      photoUrl = req.file.path; // Save the new file path
    } else {
      // console.log("No new photo uploaded, using existing photo.");
    }

    // Handle brand
    let brandexist = await Brand.findOne({ name: brand });
    if (brand && !brandexist) {
      brandexist = new Brand({ name: brand });
      await brandexist.save();
    }

    // Handle category
    let categoryexist = await Category2.findOne({ name: category });
    if (category && !categoryexist) {
      categoryexist = new Category2({ name: category });
      await categoryexist.save();
    }

    // Handle subcategory
    let subcategoryexist = await Subcategory.findOne({ name: subcategory });
    if (subcategory && !subcategoryexist) {
      subcategoryexist = new Subcategory({ name: subcategory });
      await subcategoryexist.save();
    }

    // Handle subsubcategory
    let subsubcategoryexist = await Subsubcategory.findOne({
      name: subsubcategory,
    });
    if (subsubcategory && !subsubcategoryexist) {
      subsubcategoryexist = new Subsubcategory({ name: subsubcategory });
      await subsubcategoryexist.save();
    }

    // Handle subses category
    let subsescategoryexist = await Subsescategory.findOne({
      name: subsescategory,
    });
    if (subsescategory && !subsescategoryexist) {
      subsescategoryexist = new Subsescategory({ name: subsescategory });
      await subsescategoryexist.save();
    }

    // Handle specifications: Check if it's already an object/array
    let specificationsParsed;
    try {
      specificationsParsed =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "Invalid JSON in specifications",
          error: error.message,
        });
    }

    // Update product details
    const updates = {
      title,
      description,
      images: photoUrl,
      price,
      cutprice,
      quantity,
      instock,
      specifications: specificationsParsed,
      warranty,
      isApproved: false,
      isActive: false,
      brandID: brandexist ? brandexist._id : product.brandID,
      categoryID: categoryexist ? categoryexist._id : product.categoryID,
      subcategoryID: subcategoryexist
        ? subcategoryexist._id
        : product.subcategoryID,
      subsubcategoryID: subsubcategoryexist
        ? subsubcategoryexist._id
        : product.subsubcategoryID,
      subsescategoryID: subsescategoryexist
        ? subsescategoryexist._id
        : product.subsescategoryID,
      country,
      state,
      city,
      nearby,
      postal_code,
    };

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("brandID")
      .populate("categoryID")
      .populate("subcategoryID")
      .populate("subsubcategoryID")
      .populate("subsescategoryID");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE product by productID and vendorID
export const deleteProductById = async (req, res) => {
  const { productID, vendorID } = req.params;

  try {
    // Verify if the product exists and belongs to the specified vendor
    const product = await Product.findOne({ _id: productID, vendorID });

    if (!product) {
      return res
        .status(404)
        .json({
          message: "Product not found or does not belong to this vendor",
        });
    }

    // Remove subsescategory if it exists
    if (product.subsescategoryID) {
      // Remove the subsescategory
      await Subsescategory.findByIdAndDelete(product.subsescategoryID);

      // Remove subsescategoryID from Subsubcategory if it exists
      const updateResult = await Subsubcategory.updateMany(
        { subsescategoryID: product.subsescategoryID },
        { $pull: { subsescategoryID: product.subsescategoryID } }
      );

      // Debugging information
      // console.log('Update Result:', updateResult);

      if (updateResult.nModified === 0) {
        console.log(
          "No documents were updated. Verify the subsescategoryID exists in Subsubcategory documents."
        );
      }
    }

    // Delete the product
    await Product.deleteOne({ _id: productID });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Product Approval
export const toggleApproval = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body; // Expecting `isApproved` from the request body

  try {
    // Validate `isApproved`
    if (typeof isApproved !== "boolean") {
      return res
        .status(400)
        .json({
          message: "Invalid value for isApproved. It must be a boolean.",
        });
    }

    // Find and update the product
    const product = await Product.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true } // Return the updated document
    );

    // If product is not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product approval status updated successfully",
    });
  } catch (err) {
    console.error("Error updating product approval status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Cities Related to Approved Products
export const getAllCitiesFromApprovedProducts = async (req, res) => {
  try {
    // Fetch only the city field from approved products
    const products = await Product.find({ isApproved: true }).select(
      "city -_id"
    );

    if (products.length === 0) {
      // If no approved products are found, return a specific message
      return res.status(404).json({
        success: false,
        message: "No cities found for approved products.",
      });
    }

    // Extract all cities and remove duplicates
    const cities = [...new Set(products.map((product) => product.city.trim()))];

    // Send a successful response with the list of cities
    res.status(200).json({ success: true, cities });
  } catch (error) {
    // Log detailed error message to the server for debugging
    console.error("Error fetching cities from approved products:", error);

    // Send a generic error response to the client
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cities from approved products",
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    });
  }
};

// Optimized function for product statistics
const getProductStatistics = async (vendorID) => {
  try {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorID);

    // Aggregation pipeline to get totalQuantity, totalApproved, and totalNotApproved
    const result = await Product.aggregate([
      { $match: { vendorID: vendorObjectId } },
      {
        $lookup: {
          from: "ratings", // Name of the collection storing ratings
          localField: "ratings",
          foreignField: "_id",
          as: "productRatings",
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$productRatings" }, 0] }, // If there are ratings
              then: { $avg: "$productRatings.rating" }, // Calculate the average rating
              else: null, // If no ratings, set to null
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: { $ifNull: ["$instock", 0] } },
          totalApproved: {
            $sum: { $cond: [{ $eq: ["$isApproved", true] }, 1, 0] },
          },
          totalNotApproved: {
            $sum: { $cond: [{ $eq: ["$isApproved", false] }, 1, 0] },
          },
          totalProductsCount: { $sum: 1 },
          avgRating: { $avg: "$avgRating" },
        },
      },
    ]);

    const stats = result[0] || {
      totalQuantity: 0,
      totalApproved: 0,
      totalNotApproved: 0,
      totalProductsCount: 0,
      avgRating: 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching product statistics:", error.message);
    throw new Error("Error fetching product statistics");
  }
};

// Optimized function for vendor enquiries
const getTotalVendorEnquiries = async (vendorID) => {
  try {
    const count = await VendorEnquiry.countDocuments({
      vendorID: new mongoose.Types.ObjectId(vendorID),
    });
    return count;
  } catch (error) {
    console.error("Error fetching total vendor enquiries:", error.message);
    throw new Error("Error fetching total vendor enquiries");
  }
};

// Optimized function for admin enquiries by categories
const getTotalEnquiriesByCategories = async (categoryIDs) => {
  try {
    if (!Array.isArray(categoryIDs) || categoryIDs.length === 0) {
      throw new Error("Invalid or empty categoryIDs array");
    }

    const objectIds = categoryIDs.map((id) => new mongoose.Types.ObjectId(id));

    const count = await AdminEnquiry.countDocuments({
      categoryID: { $in: objectIds },
    });
    return count;
  } catch (error) {
    console.error("Error fetching total admin enquiries:", error.message);
    throw new Error("Error fetching total admin enquiries");
  }
};

// API to get all statistics
export const getStatistics = async (req, res) => {
  try {
    const { vendorID, categoryIDs } = req.query;

    if (!vendorID) {
      return res.status(400).json({ error: "vendorID is required" });
    }

    // Use Promise.all to execute unrelated queries concurrently
    const [productStats, totalVendorEnquiries, totalAdminEnquiries] =
      await Promise.all([
        getProductStatistics(vendorID),
        getTotalVendorEnquiries(vendorID),
        categoryIDs
          ? getTotalEnquiriesByCategories(categoryIDs)
          : Promise.resolve(0),
      ]);

    res.json({
      totalProductQuantity: productStats.totalQuantity,
      totalApprovedProducts: productStats.totalApproved,
      totalNotApprovedProducts: productStats.totalNotApproved,
      totalProductsCount: productStats.totalProductsCount,
      totalVendorEnquiries: totalVendorEnquiries,
      totalAdminEnquiries: totalAdminEnquiries,
      averageProductRating: (productStats.avgRating || 0).toFixed(1),
    });
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get Locations based on products
export const getLocations = async (req, res) => {
  try {
    // Fetch only necessary fields and limit the results
    const products = await Product.find({ isApproved: true })
      .select("state city") // Only select state and city
      .lean(); // Convert documents to plain JavaScript objects

    // Create a Map to store unique states and their cities
    const stateCityMap = new Map();

    products.forEach((product) => {
      const { state, city } = product;

      // Check if the state already exists in the map
      if (!stateCityMap.has(state)) {
        // Initialize a new Set for cities under this state
        stateCityMap.set(state, new Set());
      }

      // Add the city to the corresponding state's Set
      stateCityMap.get(state).add(city);
    });

    // Convert Map to an array of locations
    const locations = Array.from(stateCityMap.entries()).map(
      ([state, cities]) => ({
        state,
        cities: Array.from(cities), // Convert Set of cities to an array
      })
    );

    // Send the response
    res.status(200).json({ locations });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a rating to a product
export const createRating = async (req, res) => {
  try {
    const { rating, description, userID } = req.body;
    const productId = req.params.id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be between 1 and 5 stars" });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create a new Rating document
    const newRating = new Rating({
      rating,
      description,
      userID,
    });

    // Save the new rating
    await newRating.save();

    // Add the rating to the product's ratings array
    product.ratings.push(newRating._id); // Store the ObjectId of the rating

    // Save the updated product
    await product.save();

    // Calculate the new average rating
    const totalRating = product.ratings.reduce(async (sum, ratingId) => {
      const rating = await Rating.findById(ratingId);
      return sum + rating.rating;
    }, 0);

    const averageRating = totalRating / product.ratings.length;

    // Respond with the updated ratings and average rating
    res.json({
      ratings: product.ratings,
      averageRating: averageRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// get Ratings
export const getRatings = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find product and populate ratings
    const product = await Product.findById(productId).populate({
      path: "ratings",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "userID",
        model: "User", // Ensure this matches your User model name
        select: "username", // Only fetch the 'name' field
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Calculate average rating
    const totalRatings = product.ratings.length;
    const averageRating =
      totalRatings > 0
        ? Number(
            (
              product.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
              totalRatings
            ).toFixed(1)
          )
        : null;

    res.json({
      ratings: product.ratings,
      averageRating,
      totalRatings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Product Activation
export const toggleActiveStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body; // Expecting `isActive` from the request body

  try {
    // Validate `isActive`
    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid value for isActive. It must be a boolean." });
    }

    // Find and update the product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive,
        // isApproved: false
      },
      { new: true } // Return the updated document
    );

    // If product is not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product active status updated successfully",
      product, // Optionally return the updated product
    });
  } catch (err) {
    console.error("Error updating product active status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// product update isActive false or true
export const updateAllProducts = async (req, res) => {
  const { isActive } = req.body; // Accept isActive from the request body

  try {
    // Validate `isActive`
    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid value for isActive. It must be a boolean." });
    }

    // Update all products
    const result = await Product.updateMany(
      {}, // Empty filter to update all products
      { $set: { isActive } } // Update isActive field
    );

    res.status(200).json({
      message: `${result.modifiedCount} products updated successfully.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating products:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
