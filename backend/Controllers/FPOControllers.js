import Seller from "../Models/FPO/sellerModels.js";
import AddressFPO from "../Models/FPO/addressFPO.js";
import AddFPOData from "../Models/FPO/addFpoModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to verify phone number for FPO
export const verifyPhoneFPO = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // Check if the phone number already exists in the database
    const user = await Seller.findOne({ phone: phone });

    if (user) {
      return res.status(409).json({ message: "Phone number already exists" });
    }

    return res.status(200).json({ message: "Phone number does not exist" });
  } catch (error) {
    console.error("Error while verifying phone number:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Register FPO
export const registerFPO = async (req, res) => {
  const {
    username,
    email = null, // Default to null
    password,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  // Validate required fields
  if (!phone) {
    return res.status(400).json({ msg: "Phone number is required" });
  }

  try {
    // Check if phone already exists
    const existingPhoneUser = await Seller.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(400).json({ msg: "Phone number already in use" });
    }

    // Check if email already exists (if provided and not null)
    if (email) {
      const existingEmailUser = await Seller.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    // Save the address
    const newAddress = new AddressFPO({
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    });

    await newAddress.save();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user instance
    const newUser = new Seller({
      username,
      email,
      password: hashedPassword,
      phone,
      addressID: newAddress._id, // Assign the address ID
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ message: "FPO Registered Successfully", newUser });
  } catch (err) {
    console.error("Error registering FPO:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function to Login FPO
export const loginFPO = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Check if the user exists
    let seller = await Seller.findOne({ phone });
    if (!seller) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the user is blocked
    if (seller.isBlocked) {
      return res.status(403).json({ msg: "FPO is Blocked...!!!" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Ensure the secret key is a string
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey || typeof secretKey !== "string") {
      throw new Error(
        "JWT_SECRET_KEY is not properly defined or is not a string"
      );
    }

    // Generate JWT
    const token = jwt.sign({ id: seller.id }, secretKey, { expiresIn: "30d" });

    // Save the token in the user document
    seller.token = token;
    await seller.save();

    // Return JWT as response
    res.json({ message: "FPO Logged Successfully...!", token });
  } catch (err) {
    console.error("Error logging in FPO:", err.message);
    res.status(500).send("Server Error");
  }
};

// Get FPO data based on Login
export const getFPOprofile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id)
      .select("-password")
      .populate("addressID");

    if (!seller) {
      return res.status(404).json({ msg: "FPO not found" });
    }

    res.json(seller);
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).send("Server Error");
  }
};

// update fpo profile
export const updateFPO = async (req, res) => {
  const {
    username,
    email, // Email is now optional
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  const { id } = req.params; // Get the seller ID from the URL parameters

  // Validate required fields
  if (!phone) {
    return res.status(400).json({ msg: "Phone number is required" });
  }

  try {
    // Check if the phone already exists for another user (not the current user)
    const existingPhoneUser = await Seller.findOne({ phone, _id: { $ne: id } });
    if (existingPhoneUser) {
      return res
        .status(400)
        .json({ msg: "Phone number already in use by another user" });
    }

    // Check if the email already exists for another user (not the current user), only if email is provided
    if (email) {
      const existingEmailUser = await Seller.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingEmailUser) {
        return res
          .status(400)
          .json({ msg: "Email already in use by another user" });
      }
    }

    // Find the seller to update
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ msg: "Seller not found" });
    }

    // Update the address if address fields are provided
    let updatedAddress = seller.addressID; // Retain the original address ID

    if (
      address_line1 ||
      address_line2 ||
      city ||
      state ||
      postal_code ||
      country
    ) {
      // If there are address fields to update, we update the Address document
      updatedAddress = await AddressFPO.findById(seller.addressID);
      if (updatedAddress) {
        updatedAddress.address_line1 =
          address_line1 || updatedAddress.address_line1;
        updatedAddress.address_line2 =
          address_line2 || updatedAddress.address_line2;
        updatedAddress.city = city || updatedAddress.city;
        updatedAddress.state = state || updatedAddress.state;
        updatedAddress.postal_code = postal_code || updatedAddress.postal_code;
        updatedAddress.country = country || updatedAddress.country;

        await updatedAddress.save(); // Save the updated address
      } else {
        // If there's no address, create a new one
        updatedAddress = new AddressFPO({
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          country,
        });

        await updatedAddress.save();
      }
    }

    // Update the seller document with new data
    seller.username = username || seller.username;
    seller.email = email || seller.email; // Update email only if provided
    seller.phone = phone || seller.phone;
    seller.addressID = updatedAddress._id; // Updated address ID

    await seller.save(); // Save the updated seller

    res.status(200).json({ message: "FPO Updated Successfully", seller });
  } catch (err) {
    console.error("Error updating FPO:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function to log out the FPO
export const logoutFPO = async (req, res) => {
  try {
    // Clear the token
    req.seller.token = null;
    await req.seller.save();
    res.json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Error logging out user:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function to reset password
export const resetPasswordFPO = async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    // Validate input
    if (!phone || !newPassword) {
      return res
        .status(400)
        .json({ message: "Phone number and new password are required." });
    }

    // Find the user by phone number
    const seller = await Seller.findOne({ phone });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    seller.password = hashedPassword;
    await seller.save();

    return res
      .status(200)
      .json({ message: "Password has been successfully updated." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// POST controller to handle form submission
export const createFPOcontent = async (req, res) => {
  try {
    const {
      fponame,
      taluk,
      district,
      underSchema,
      activities,
      otherActivity,
      personname,
      mobNumber,
      cropDetails,
      productDetails,
      sellerID,
    } = req.body;

    // Default values
    const activitiesValue =
      activities && activities.length > 0 ? activities : [];
    const otherActivityValue = otherActivity ? otherActivity : null;
    const underSchemaValue = underSchema || null; // Ensure default null if not provided
    const cropDetailsValue = cropDetails || null; // Ensure default null if not provided
    const productDetailsValue = productDetails || null; // Ensure default null if not provided

    // Validation: At least one of `activities` or `otherActivity` must be provided
    if (!activitiesValue && !otherActivityValue) {
      return res.status(400).json({
        message: "At least one of 'activities' or 'otherActivity' is required.",
      });
    }

    // Creating a new document
    const newFPO = new AddFPOData({
      fponame,
      taluk,
      district,
      underSchema: underSchemaValue,
      activities: activitiesValue,
      otherActivity: otherActivityValue,
      personName: personname,
      mobNumber,
      cropDetails: cropDetailsValue,
      productDetails: productDetailsValue,
      sellerID,
    });

    // Save the document in the database
    const savedFPO = await newFPO.save();

    // Success response
    res.status(201).json({
      message: "FPO data added successfully",
      data: savedFPO,
    });
  } catch (error) {
    console.error("Error in createFPOcontent:", error.message);
    res.status(500).json({
      message: "Error saving FPO data",
      error: error.message,
    });
  }
};

// Controller to get all FPO data
export const getAllFPOs = async (req, res) => {
  try {
    // Fetch all FPO records from the database
    const allFPOs = await AddFPOData.find();

    // If no FPO records are found
    if (allFPOs.length === 0) {
      return res.status(404).json({ message: "No FPO data found." });
    }

    // Send back the found FPO data
    return res.status(200).json(allFPOs);
  } catch (error) {
    // Catch any error and send a response
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Controller to get FPO data by sellerID
export const getFPOBySellerID = async (req, res) => {
  try {
    // Extract sellerID from the request parameters (e.g., /api/v1/FPO/data/:sellerID)
    const { sellerID } = req.params;

    // Fetch the FPO record based on sellerID
    const fpo = await AddFPOData.find({ sellerID });

    // If no FPO record is found for the given sellerID
    if (!fpo) {
      return res
        .status(404)
        .json({ message: `No FPO found with sellerID: ${sellerID}` });
    }

    // Send back the found FPO data
    return res.status(200).json(fpo);
  } catch (error) {
    // Catch any error and send a response
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Controller to delete FPO data by id
export const deleteFPOById = async (req, res) => {
  try {
    const { id } = req.params; // Getting the id from the request parameters

    // Find the FPO data by id and delete it
    const deletedFPO = await AddFPOData.findByIdAndDelete(id);

    // If no document is found, send a 404 error
    if (!deletedFPO) {
      return res.status(404).json({ message: "FPO data not found." });
    }

    // Send back a success response
    res.status(200).json({
      message: "FPO data deleted successfully",
      data: deletedFPO, // Optionally return the deleted document if needed
    });
  } catch (error) {
    console.error("Error deleting FPO data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update controller for fpo content
export const updateFPOcontent = async (req, res) => {
  try {
    const {
      fponame,
      taluk,
      district,
      underSchema,
      activities,
      otherActivity,
      personname,
      mobNumber,
      cropDetails,
      productDetails,
      sellerID,
    } = req.body;

    const { id } = req.params; // Assuming you're passing the FPO ID in the URL

    // Ensure that the FPO exists
    const existingFPO = await AddFPOData.findById(id);
    if (!existingFPO) {
      return res.status(404).json({
        message: "FPO not found with the provided ID.",
      });
    }

    // Default values
    const activitiesValue =
      activities && activities.length > 0 ? activities : [];
    const otherActivityValue = otherActivity ? otherActivity : null;
    const underSchemaValue =
      underSchema === null || underSchema === ""
        ? null
        : underSchema || existingFPO.underSchema;
    const cropDetailsValue = cropDetails || null; // Ensure default null if not provided
    const productDetailsValue = productDetails || null; // Ensure default null if not provided

    // Validation: At least one of `activities` or `otherActivity` must be provided
    if (!activitiesValue && !otherActivityValue) {
      return res.status(400).json({
        message: "At least one of 'activities' or 'otherActivity' is required.",
      });
    }

    // Update the fields
    existingFPO.fponame = fponame || existingFPO.fponame;
    existingFPO.taluk = taluk || existingFPO.taluk;
    existingFPO.district = district || existingFPO.district;
    existingFPO.underSchema = underSchemaValue;
    existingFPO.activities = activitiesValue;
    existingFPO.otherActivity = otherActivityValue || existingFPO.otherActivity;
    existingFPO.personName = personname || existingFPO.personName;
    existingFPO.mobNumber = mobNumber || existingFPO.mobNumber;
    existingFPO.cropDetails = cropDetailsValue || existingFPO.cropDetails;
    existingFPO.productDetails =
      productDetailsValue || existingFPO.productDetails;
    existingFPO.sellerID = sellerID || existingFPO.sellerID;

    // Save the updated document in the database
    const updatedFPO = await existingFPO.save();

    // Success response
    res.status(200).json({
      message: "FPO data updated successfully",
      data: updatedFPO,
    });
  } catch (error) {
    console.error("Error in updateFPOcontent:", error.message);
    res.status(500).json({
      message: "Error updating FPO data",
      error: error.message,
    });
  }
};

// Controller to get distinct district
export const getDistinctFPOFields = async (req, res) => {
  try {
    // Fetch distinct district from the database
    const districts = await AddFPOData.distinct("district"); // Get all distinct district values

    // If no fponames or taluks are found
    if (!districts.length) {
      return res.status(404).json({ message: "No district data found." });
    }

    // Send back the distinct fponame and taluk data
    return res.status(200).json({
      districts,
    });
  } catch (error) {
    // Catch any error and send a response
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// get fponame based on district
export const getFPOByDistrict = async (req, res) => {
  const { district } = req.params; // Fetch district from the URL parameter

  try {
    // Query the database to find all FPO names for the given district
    const fponames = await AddFPOData.find({ district })
      .select("fponame") // Only select the fponame field
      .distinct("fponame"); // Ensures we only get distinct FPO names

    // If no FPO names are found
    if (!fponames.length) {
      return res
        .status(404)
        .json({ message: `No FPO found for district: ${district}` });
    }

    // Send the response with the list of FPO names
    return res.status(200).json({
      fponames,
    });
  } catch (error) {
    // Catch any error and return a 500 response with error details
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Controller to get Content based on Taluk and fponame
export const getFPOByNameAndTaluk = async (req, res) => {
  try {
    // Get fponame and taluk from the body
    const { fponame, district } = req.body;

    // Check if both fponame and taluk are provided in the request body
    if (!fponame || !district) {
      return res
        .status(400)
        .json({ message: "Both fponame and district are required" });
    }

    // Query the database to find FPO data matching both fponame and taluk
    const fpoData = await AddFPOData.find({ fponame, district });

    // If no data is found, send a 404 response
    if (fpoData.length === 0) {
      return res
        .status(404)
        .json({
          message: "No FPO data found for the provided fponame and district",
        });
    }

    // Send the found data back in the response
    return res.status(200).json(fpoData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Controller function to get all FPO data
export const getAllFPOAdmin = async (req, res) => {
  try {
    // Fetch all FPO records from the database
    const fpoData = await AddFPOData.find();

    // Check if there are no FPO records
    if (fpoData.length === 0) {
      return res.status(404).json({
        message: "No FPO records found",
      });
    }

    // Return the FPO data
    return res.status(200).json({
      success: true,
      data: fpoData,
    });
  } catch (error) {
    // Handle any error that occurs during the database query
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching FPO records",
      error: error.message,
    });
  }
};

// Get FPO data by slug (GET)
export const getFPOBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find FPO data by slug
    const fpoData = await AddFPOData.findOne({ slug });

    if (!fpoData) {
      return res.status(404).json({
        message: "FPO data not found",
      });
    }

    res.status(200).json({
      message: "FPO data fetched successfully",
      data: fpoData,
    });
  } catch (error) {
    console.error("Error in getFPOBySlug:", error.message);
    res.status(500).json({
      message: "Error fetching FPO data",
      error: error.message,
    });
  }
};
