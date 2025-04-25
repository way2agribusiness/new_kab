import User from "../Models/User/userModels.js";
import Product from "../Models/Product/productModels.js";
import AdminEnquiry from "../Models/Enquiry/adminEnquiry.js";

// Get All Vendor User data for Admin
export const getAllUsersWithDetails = async (req, res) => {
  try {
    // Fetch data from the database
    const users = await User.find()
      .select("username phone categoryID isBlocked createdAt updatedAt")
      .populate("roleID", "name") // Only fetch the role name
      .populate("categoryID", "name") // Only fetch the category name
      .lean(); // Use lean for performance

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server Error");
  }
};

// Get User data by ID
export const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Perform user and totalProducts queries in parallel
    const [user, totalProducts] = await Promise.all([
      User.findById(userId)
        .select("username phone categoryID isBlocked photo")
        .populate("roleID", "name")
        .populate("categoryID", "name")
        .populate("addressID")
        .lean(), // Use lean() for better performance
      Product.countDocuments({ vendorID: userId }),
    ]);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user data with product count
    res.json({ user, totalProducts });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).send("Server Error");
  }
};

export const StatsController = {
  async getAllStats(req, res) {
    try {
      // Run all the queries concurrently using Promise.all
      const [
        totalProductInstocks,
        totalProducts,
        totalAdminEnquiries,
        totalBuyers,
        totalVendors,
        totalBlockedUsers,
      ] = await Promise.all([
        // Use aggregation for calculating total in-stock quantity
        Product.aggregate([
          {
            $group: {
              _id: null,
              totalInstocks: { $sum: { $ifNull: ["$instock", 0] } }, // Sum instock instead of quantity
            },
          },
        ]).then((result) => (result[0] ? result[0].totalInstocks : 0)),

        // Count total products
        Product.countDocuments(),

        // Count total admin enquiries
        AdminEnquiry.countDocuments(),

        // Count total buyers
        User.countDocuments({ roleID: "66ee66e095ccb527a5315c89" }),

        // Count total vendors
        User.countDocuments({ roleID: "66e2c6e5209d560074e7c8d4" }),

        // Count total blocked users
        User.countDocuments({ isBlocked: true }),
      ]);

      // Return the statistics in the response
      res.status(200).json({
        totalProductInstocks, // Total in-stock products
        totalProducts,
        totalAdminEnquiries,
        totalBuyers,
        totalVendors,
        totalBlockedUsers,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching statistics", error: err.message });
    }
  },
};

// Controller to get users with isBlocked: true
export const getBlockedUsers = async (req, res) => {
  try {
    // Query to find users with isBlocked: true
    const blockedUsers = await User.find({ isBlocked: true })
      .select("username phone categoryID isBlocked createdAt updatedAt")
      .populate("roleID", "name") // Only fetch the role name
      .populate("categoryID", "name") // Only fetch the category name
      .lean(); // Use lean for performance

    res.status(200).json({
      success: true,
      data: blockedUsers,
      message: "Fetched all users with isBlocked: true.",
    });
  } catch (error) {
    console.error("Error fetching blocked users:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching blocked users.",
    });
  }
};

// Toggle User Block Status
export const toggleBlockStatus = async (req, res) => {
  const { id } = req.params; // User ID from the request parameters
  const { isBlocked } = req.body; // Expecting `isBlocked` from the request body

  try {
    // Validate `isBlocked`
    if (typeof isBlocked !== "boolean") {
      return res
        .status(400)
        .json({
          message: "Invalid value for isBlocked. It must be a boolean.",
        });
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true } // Return the updated document
    );

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User block status updated successfully",
      user, // Optionally return the updated user object
    });
  } catch (err) {
    console.error("Error updating user block status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
