import VendorEnquiry from "../Models/Enquiry/vendorEnquiry.js";
import AdminEnquiry from "../Models/Enquiry/adminEnquiry.js";
import Category2 from "../Models/Product/category2Models.js";
import GeneralEnquiry from "../Models/Enquiry/generallEnquiry.js";
import AddEnquiry from "../Models/Enquiry/addEnquiry.js";
import mongoose from "mongoose";


// POST request to create a new vendor enquiry
export const createVendorEnquiry = async (req, res) => {
    try {
        const { vendorID, productName, description, categoryID, buyerID, mobNumber } = req.body;


        if (!vendorID || !productName || !categoryID || !buyerID || !mobNumber) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newEnquiry = new VendorEnquiry({
            vendorID,
            productName,
            description: description || '',
            categoryID,
            buyerID,
            mobNumber,
            isViews: false
        });

        const savedEnquiry = await newEnquiry.save();
        res.status(201).json(savedEnquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET request to retrieve vendor enquiries by vendor ID
export const getEnquiriesByVendorID = async (req, res) => {
    try {
        const vendorID = req.params.vendorID;

        if (!mongoose.Types.ObjectId.isValid(vendorID)) {
            return res.status(400).json({ message: 'Invalid vendor ID' });
        }

        const enquiries = await VendorEnquiry.find({ vendorID })
            .populate('categoryID', 'name')
            .populate({
                path: 'vendorID',
                select: 'username email phone isWhatsApp photo addressID',
                populate: [
                    {
                        path: 'addressID',
                        model: 'Address'
                    },
                    {
                        path: 'roleID',
                        model: 'Role'
                    }
                ]
            })
            .populate({
                path: 'buyerID',
                select: 'username email phone isWhatsApp photo addressID',
                populate: [
                    {
                        path: 'addressID',
                        model: 'Address'
                    },
                    {
                        path: 'roleID',
                        model: 'Role'
                    }
                ]
            });

        res.status(200).json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// POST request to create a new Admin enquiry
export const createAdminEnquiry = async (req, res) => {
    try {
        const { productName, description, categoryID, buyerID } = req.body;

        if (!productName || !description || !categoryID || !buyerID) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let categoryDoc = await Category2.findById(categoryID);
        if (!categoryDoc) {
            return res.status(400).json({ message: 'CategoryId not Matched' });
        }

        const newEnquiry = new AdminEnquiry({
            productName,
            description,
            isApproved: false,
            categoryID: categoryDoc._id,
            buyerID
        });

        const savedEnquiry = await newEnquiry.save();
        res.status(201).json(savedEnquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET request to retrieve enquiries by Admin
export const getEnquiriesByAdmin = async (req, res) => {
    try {
        const enquiries = await AdminEnquiry.find()
            .populate('categoryID', 'name')
            .populate({
                path: 'buyerID',
                select: 'username email phone isWhatsApp photo addressID',
                populate: [
                    {
                        path: 'addressID',
                        model: 'Address'
                    },
                    {
                        path: 'roleID',
                        model: 'Role'
                    }
                ]
            });
        res.status(200).json(enquiries);
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'An error occurred while retrieving enquiries', error: error.message });
    }
};



// GET request to retrieve an enquiry by ID
export const getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the enquiry by ID
        const enquiry = await AdminEnquiry.findById(id)
            .populate('categoryID', 'name')
            .populate({
                path: 'buyerID',
                select: 'username email phone isWhatsApp photo addressID',
                populate: [
                    {
                        path: 'addressID',
                        model: 'Address'
                    },
                    {
                        path: 'roleID',
                        model: 'Role'
                    }
                ]
            });

        // Check if the enquiry exists
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        // Send the enquiry data in the response
        res.status(200).json(enquiry);
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'An error occurred while retrieving the enquiry', error: error.message });
    }
};


// Toggle Enquiry Approval
export const toggleEnquiryApproval = async (req, res) => {
    const { id } = req.params;
    const { isApproved } = req.body; // Expecting `isApproved` from the request body

    try {
        // Validate `isApproved`
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({ message: 'Invalid value for isApproved. It must be a boolean.' });
        }

        // Find the enquiry
        const enquiry = await AdminEnquiry.findById(id);

        // If enquiry is not found
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        // Toggle the approval status
        enquiry.isApproved = !enquiry.isApproved;

        // Save the updated enquiry
        const updatedEnquiry = await enquiry.save();

        res.status(200).json({
            message: 'Enquiry approval status updated successfully',
            enquiry: updatedEnquiry
        });
    } catch (err) {
        console.error('Error updating enquiry approval status:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// GET request to retrieve approved enquiries by Admin
export const getApprovedEnquiries = async (req, res) => {
    try {
        const enquiries = await AdminEnquiry.find({ isApproved: true })
            .populate('categoryID', 'name')
            .populate({
                path: 'buyerID',
                select: 'username email phone isWhatsApp photo addressID',
                populate: [
                    {
                        path: 'addressID',
                        model: 'Address'
                    },
                    {
                        path: 'roleID',
                        model: 'Role'
                    }
                ]
            });
        res.status(200).json(enquiries);
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'An error occurred while retrieving enquiries', error: error.message });
    }
};


// Get enquiry details by Id 
export const getEnquiriesByID = async (req, res) => {
    try {
        // Extract the ID from the request parameters
        const { id } = req.params;

        // Find the enquiry by ID, populating related fields
        const enquiries = await VendorEnquiry.findById({ _id: id })
            .populate('categoryID', 'name') // Populate the category name
            .populate({
                path: 'buyerID', // Populate buyer details
                select: 'username email phone isWhatsApp photo addressID', // Select specific buyer fields
                populate: [
                    {
                        path: 'addressID', // Populate the address details
                        model: 'Address'
                    },
                    {
                        path: 'roleID', // Populate the role details
                        model: 'Role'
                    }
                ]
            });

        // Send the enquiry details in the response
        res.status(200).json(enquiries);
    } catch (error) {
        // Handle any errors by sending a 500 status and the error message
        res.status(500).json({ message: error.message });
    }
};


// Route to mark an enquiry as viewed
export const viewedEnquiry = async (req, res) => {
    const { enquiryId } = req.params;

    try {
        // Find the enquiry by ID
        const enquiry = await VendorEnquiry.findById(enquiryId);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        // Update the isViews field to true
        enquiry.isViews = true;
        await enquiry.save();

        res.status(200).json({ message: "Enquiry marked as viewed", enquiry });
    } catch (error) {
        res.status(500).json({ message: "Error marking enquiry as viewed", error });
    }
};


// Example route to mark an enquiry as viewed
export const viewedAdminEnquiry = async (req, res) => {
    const { enquiryId } = req.params;
    const { vendorID } = req.body; // Assuming buyerId is passed in the request body

    try {
        const enquiry = await AdminEnquiry.findById(enquiryId);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        // Check if the buyer has already viewed the enquiry
        const alreadyViewed = enquiry.views.some(view => view.vendorID.equals(vendorID));
        if (!alreadyViewed) {
            enquiry.views.push({ vendorID: vendorID, viewedAt: new Date() });
            await enquiry.save();
        }

        res.status(200).json({ message: "Enquiry viewed successfully", enquiry });
    } catch (error) {
        res.status(500).json({ message: "Error viewing enquiry", error });
    }
};


// Create a new General Enquiry
export const createGeneralEnquiry = async (req, res) => {
    try {
        const { username, mobNumber, categoryID, productName, description, city, taluk } = req.body;

        // Validate required fields
        if (!username || !mobNumber || !categoryID || !productName || !city || !taluk) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Check if the category exists or create a new one
        let categoryDoc = await Category2.findOne({ name: categoryID });
        if (!categoryDoc) {
            categoryDoc = new Category2({ name: categoryID });
            await categoryDoc.save();
        }

        // Create the new enquiry
        const newEnquiry = new GeneralEnquiry({
            username,
            mobNumber,
            categoryID: categoryDoc._id, // Reference the category's ObjectId
            productName,
            description,
            city,
            taluk,
            isApproved: false
        });

        const savedEnquiry = await newEnquiry.save();

        res.status(201).json({
            message: "Enquiry created successfully.",
            data: savedEnquiry,
        });
    } catch (error) {
        console.error("Error creating enquiry:", error);
        res.status(500).json({ message: "Failed to create enquiry.", error: error.message });
    }
};


// Get all General Enquiries with populated categoryID
export const getAllGeneralEnquiries = async (req, res) => {
    try {
        // Fetch all enquiries and populate the categoryID field
        const enquiries = await GeneralEnquiry.find().populate("categoryID", "name"); // Populate only the 'name' field of Category2

        res.status(200).json({
            message: "Enquiries fetched successfully.",
            data: enquiries,
        });
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({
            message: "Failed to fetch enquiries.",
            error: error.message,
        });
    }
};


// Get a single General Enquiry by ID
export const getGeneralEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the enquiry by ID and populate the categoryID field
        const enquiry = await GeneralEnquiry.findById(id).populate("categoryID", "name");

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found." });
        }

        res.status(200).json({
            message: "Enquiry fetched successfully.",
            data: enquiry,
        });
    } catch (error) {
        console.error("Error fetching enquiry:", error);
        res.status(500).json({
            message: "Failed to fetch enquiry.",
            error: error.message,
        });
    }
};


// Create a new Add Enquiry
export const createAddEnquiry = async (req, res) => {
    try {
        const { username, mobNumber, categoryID, productName, description, city, taluk } = req.body;

        // Validate required fields
        if (!username || !mobNumber || !categoryID || !productName || !city || !taluk) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Check if the category exists or create a new one
        let categoryDoc = await Category2.findOne({ name: categoryID });
        if (!categoryDoc) {
            categoryDoc = new Category2({ name: categoryID });
            await categoryDoc.save();
        }

        // Create the new enquiry
        const newEnquiry = new AddEnquiry({
            username,
            mobNumber,
            categoryID: categoryDoc._id, // Reference the category's ObjectId
            productName,
            description,
            city,
            taluk
        });

        const savedEnquiry = await newEnquiry.save();

        res.status(201).json({
            message: "Enquiry created successfully.",
            data: savedEnquiry,
        });
    } catch (error) {
        console.error("Error creating enquiry:", error);
        res.status(500).json({ message: "Failed to create enquiry.", error: error.message });
    }
};


// Get Enquiries for a Vendor with Optional Category Filtering
export const getAllAddEnquiries = async (req, res) => {
    const { vendorID } = req.params; // Vendor ID passed as a route parameter
    const { categoryIDs } = req.query; // categoryIDs from query params (optional)

    try {
        // Prepare the category filter
        const categoryFilter = categoryIDs ? categoryIDs.split(',') : [];

        // Build the query
        const query = {
            isRemoved: {
                $not: {
                    $elemMatch: { vendorID } // Exclude enquiries where vendorID is in the `isRemoved` array
                }
            }
        };

        // Add category filter if categoryIDs are provided
        if (categoryFilter.length > 0) {
            query.categoryID = { $in: categoryFilter };
        }

        // Fetch enquiries with the constructed query and populate the categoryID field
        const enquiries = await AddEnquiry.find(query)
            .populate("categoryID", "name"); // Populate only the 'name' field of Category2

        res.status(200).json({
            success: true,
            message: "Enquiries fetched successfully.",
            data: enquiries
        });
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enquiries.",
            error: error.message,
        });
    }
};


// Get a single Add Enquiry by ID
export const getAddEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the enquiry by ID and populate the categoryID field
        const enquiry = await AddEnquiry.findById(id).populate("categoryID", "name");

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found." });
        }

        res.status(200).json({
            message: "Enquiry fetched successfully.",
            data: enquiry,
        });
    } catch (error) {
        console.error("Error fetching enquiry:", error);
        res.status(500).json({
            message: "Failed to fetch enquiry.",
            error: error.message,
        });
    }
};


// Example route to mark an enquiry as viewed
export const viewedAddEnquiry = async (req, res) => {
    const { enquiryId } = req.params;  // Get enquiryId from the request params
    const { vendorID } = req.body;    // Assuming vendorID is passed in the request body

    try {
        // Find the enquiry by ID
        const enquiry = await AddEnquiry.findById(enquiryId);

        // If enquiry not found, return a 404 response
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        // Check if the vendor has already viewed the enquiry
        const alreadyViewed = enquiry.isViews.some(view => view.vendorID.equals(vendorID));

        if (!alreadyViewed) {
            // If not already viewed, push the vendor's view into the isViews array
            enquiry.isViews.push({ vendorID, viewedAt: new Date() });
            await enquiry.save();  // Save the enquiry with the updated views
        }

        // Return a success response with the updated enquiry
        res.status(200).json({ message: "Enquiry viewed successfully", enquiry });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ message: "Error viewing enquiry", error });
    }
};


// Add Vendor to isRemoved
export const addVendorToIsRemoved = async (req, res) => {
    const { enquiryID } = req.params;
    const { vendorID } = req.body;

    try {
        // Validate enquiryID format
        if (!mongoose.Types.ObjectId.isValid(enquiryID)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID format.",
            });
        }

        // Find the enquiry by ID
        const enquiry = await AddEnquiry.findById(enquiryID);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }

        // Check if the vendorID is already in the isRemoved array
        const isAlreadyRemoved = enquiry.isRemoved.some(
            (entry) => entry.vendorID.toString() === vendorID
        );

        if (isAlreadyRemoved) {
            return res.status(400).json({
                success: false,
                message: "Vendor is already marked as removed for this enquiry.",
            });
        }

        // Add the vendorID to the isRemoved array
        enquiry.isRemoved.push({ vendorID });
        await enquiry.save();

        res.status(200).json({
            success: true,
            message: "Vendor added to isRemoved successfully.",
            data: enquiry,
        });
    } catch (error) {
        console.error("Error updating enquiry:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update enquiry.",
            error: error.message,
        });
    }
};