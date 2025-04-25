import User from "../Models/User/userModels.js";
import Role from "../Models/User/roleModels.js";
import Category2 from "../Models/Product/category2Models.js";
import Address from "../Models/User/addressModels.js";
import Feedback from "../Models/User/feedback.js";
import About from "../Models/User/abotUs.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Function to verify phone number
export const verifyPhone = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // Check if the phone number already exists in the database
    const user = await User.findOne({ phone: phone });

    if (user) {
      return res.status(409).json({ message: "Phone number already exists" });
    }

    return res.status(200).json({ message: "Phone number does not exist" });
  } catch (error) {
    console.error("Error while verifying phone number:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Register User
export const registerUser = async (req, res) => {
  const {
    username,
    email = null, // Default to null
    password,
    phone,
    isWhatsApp,
    gstNumber = null, // Default to null
    role,
    categories,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    photo,
  } = req.body;

  // Validate required fields
  if (!phone) {
    return res.status(400).json({ msg: "Phone number is required" });
  }

  try {
    // Validate and handle role
    const roleEnum = ["Buyer", "Vendor", "Admin"];
    if (!roleEnum.includes(role)) {
      return res.status(400).json({ msg: "Role not found or not allowed" });
    }

    let roleRecord = await Role.findOne({ name: role });
    if (!roleRecord) {
      roleRecord = new Role({ name: role });
      await roleRecord.save();
    }

    // Check if phone already exists
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(400).json({ msg: "Phone number already in use" });
    }

    // Check if gstNumber already exists (if provided and not null)
    if (gstNumber !== null) {
      const existingUserWithGST = await User.findOne({ gstNumber });
      if (existingUserWithGST) {
        return res.status(400).json({ msg: "GST Number already in use" });
      }
    }

    // Check if email already exists (if provided and not null)
    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    // Validate and handle categories
    const categoryIDs = [];
    const categoryEnum = {
      AgriInput: false,
      AgriOutput: false,
      AgriServices: false,
    };

    // Update categoryEnum with incoming categories
    for (let key in categories) {
      if (categories[key]) {
        const categoryName = key; // Directly use the key as the category name
        if (categoryEnum.hasOwnProperty(categoryName)) {
          let category = await Category2.findOne({ name: categoryName });
          if (!category) {
            category = new Category2({ name: categoryName });
            await category.save();
          }
          categoryIDs.push(category._id); // Push only the ID, not an array
        }
      }
    }

    // Save the address
    const newAddress = new Address({
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
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      isWhatsApp,
      gstNumber, // Directly use gstNumber as it defaults to null
      photo, // Store the Cloudinary URL or path
      roleID: roleRecord._id, // Assign the role ID
      categoryID: categoryIDs, // Assign the category IDs as an array
      addressID: newAddress._id, // Assign the address ID
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ message: "User Registered Successfully", newUser });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function to Login User
export const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ msg: "User is Blocked...!!!" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
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
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "30d" });

    // Save the token in the user document
    user.token = token;
    await user.save();

    // Find the role document using roleID from user
    const role = await Role.findOne({ _id: user.roleID });

    // Return JWT as response
    res.json({ message: "User Logged Successfully...!", token });
  } catch (err) {
    console.error("Error logging in user:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function to reset password
export const resetPassword = async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    // Validate input
    if (!phone || !newPassword) {
      return res
        .status(400)
        .json({ message: "Phone number and new password are required." });
    }

    // Find the user by phone number
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been successfully updated." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Get User data based on Login
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password") // Exclude the password field
      .populate("roleID", "name") // Populate roleID with the name field from the Role model
      .populate("categoryID", "name") // Populate categoryID with the name field from the Category2 model
      .populate("addressID") // Populate addressID field with the address data
      .populate("aboutID")
      .populate({
        path: "categoryID",
        populate: {
          path: "subcategoriesID",
          model: "Subcategory",
          populate: {
            path: "subsubcategoriesID",
            model: "Subsubcategory",
            populate: {
              path: "subsescategoryID",
              model: "Subsescategory",
            },
          },
        },
      });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function to log out the user
export const logoutUser = async (req, res) => {
  try {
    // Clear the token
    req.user.token = null;
    await req.user.save();
    res.json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Error logging out user:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function for Update User
export const editProfile = async (req, res) => {
  const { id } = req.params; // Get the user ID from request parameters
  const {
    username,
    email,
    password,
    phone,
    isWhatsApp,
    gstNumber,
    photo,
    role,
    categories,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Optional: Validate and handle role
    if (role) {
      const roleEnum = ["Buyer", "Vendor", "Admin"];
      if (!roleEnum.includes(role)) {
        return res.status(400).json({ msg: "Role not found or not allowed" });
      }

      let roleRecord = await Role.findOne({ name: role });
      if (!roleRecord) {
        roleRecord = new Role({ name: role });
        await roleRecord.save();
      }
      user.roleID = roleRecord._id; // Update role ID
    }

    // Optional: Handle categories
    if (categories) {
      const categoryIDs = [];
      for (let key in categories) {
        if (categories[key]) {
          const categoryName = key;
          let category = await Category2.findOne({ name: categoryName });
          if (!category) {
            category = new Category2({ name: categoryName });
            await category.save();
          }
          categoryIDs.push(category._id);
        }
      }
      user.categoryID = categoryIDs; // Update category IDs
    }

    // Optional: Update address
    if (
      address_line1 ||
      address_line2 ||
      city ||
      state ||
      postal_code ||
      country
    ) {
      const addressData = {
        address_line1: address_line1 || user.addressID.address_line1,
        address_line2: address_line2 || user.addressID.address_line2,
        city: city || user.addressID.city,
        state: state || user.addressID.state,
        postal_code: postal_code || user.addressID.postal_code,
        country: country || user.addressID.country,
      };

      await Address.findByIdAndUpdate(user.addressID._id, addressData);
    }

    // Optional: Update password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Update user profile
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.isWhatsApp = isWhatsApp || user.isWhatsApp;
    user.gstNumber = gstNumber || user.gstNumber;
    user.photo = photo || user.photo;

    await user.save();
    res.json({ message: "User profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server Error");
  }
};

// Function for Updating User Photo
export const updatePhoto = async (req, res) => {
  const { id } = req.params; // Get the user ID from request parameters
  const { photo } = req.body; // Get the photo from request body

  try {
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user photo
    user.photo = photo || user.photo;

    await user.save();
    res.json({ message: "User photo updated successfully", user });
  } catch (err) {
    console.error("Error updating photo:", err.message);
    res.status(500).send("Server Error");
  }
};

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { description, serviceRating, userID } = req.body;

    if (serviceRating < 1 || serviceRating > 5) {
      return res
        .status(400)
        .json({ message: "Service rating must be between 1 and 5" });
    }

    const newFeedback = new Feedback({ description, serviceRating, userID });
    await newFeedback.save();
    res
      .status(201)
      .json({ message: "Feedback saved successfully", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Feedbacks
export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate({
      path: "userID",
      select: "username email phone", // Selecting only the fields you need
      populate: { path: "roleID", select: "name" }, // Now, populate roleID inside userID
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create About and link to User
export const createAbout = async (req, res) => {
  const { userID, keys, description } = req.body;

  try {
    // Create About entry
    const about = new About({
      keys,
      description,
    });
    const savedAbout = await about.save();

    // Link About to User
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.aboutID = savedAbout._id;
    await user.save();

    res.status(201).json({
      message: "About created and linked to user successfully",
      about: savedAbout,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating About", error: error.message });
  }
};

// Update About
export const updateAbout = async (req, res) => {
  const { userID } = req.params;
  const { keys, description } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user || !user.aboutID) {
      return res
        .status(404)
        .json({ message: "User or associated About not found" });
    }

    const updatedAbout = await About.findByIdAndUpdate(
      user.aboutID,
      { keys, description },
      { new: true }
    );

    res.status(200).json({
      message: "About updated successfully",
      about: updatedAbout,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating About", error: error.message });
  }
};

// Get About by ID
export const getAboutById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document by ID
    const aboutData = await About.findById(id);

    if (!aboutData) {
      return res.status(404).json({ message: "Data not found." });
    }

    res.status(200).json(aboutData);
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
