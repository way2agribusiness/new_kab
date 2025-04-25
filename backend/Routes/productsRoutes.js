import express from 'express';
import { 
    saveProducts, updateProductById, deleteProductById,
    getProductById, toggleApproval, getAllCitiesFromApprovedProducts,
    getStatistics, AllProductController, searchController, getLocations, productController,
    adminProductController, createRating, getRatings, toggleActiveStatus, updateAllProducts
 }
 from '../Controllers/productsControllers.js';
import upload from '../Middleware/uploadFileMiddleware.js';
import {auth} from '../Middleware/commonMiddleware.js';

const router = express.Router();

router.post('/post',  upload.single('photo'), saveProducts);

router.put('/updatebyid/:productID', upload.single('photo'), updateProductById);

router.delete('/deletebyid/:productID/:vendorID', deleteProductById);

router.get('/getpid/:productID',  getProductById);

router.patch('/approval/:id', auth, toggleApproval);

router.get('/allcity', getAllCitiesFromApprovedProducts);

router.get('/dashboard/data', getStatistics);

router.get('/locations', getLocations);


// Define the route for getting the product list
router.get('/products', async (req, res) => {
    try {
        const payload = {
            size: req.query.size, // Get size from query parameters
            page: req.query.page, // Get page from query parameters
            searchString: req.query.searchString, // Get search string from query parameters
            headers: req.headers // Pass headers if needed
        };

        const result = await AllProductController.getList(payload); // Call the controller method
        res.status(200).json(result); // Send the response back to the client
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors appropriately
    }
});




// Define the route for getting the product list
router.get('/search', async (req, res) => {
    try {
        const payload = {
            size: req.query.size, // Get size from query parameters
            page: req.query.page, // Get page from query parameters
            searchString: req.query.searchString, // Get search string from query parameters
            city: req.query.city, // Get city from query parameters
            headers: req.headers // Pass headers if needed
        };

        const result = await searchController.getList(payload); // Call the controller method
        res.status(200).json(result); // Send the response back to the client
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors appropriately
    }
});



// Define the route for getting products by vendor ID
router.get('/vendor/:vendorID', async (req, res) => {
    try {
        const payload = {
            vendorID: req.params.vendorID, // Get vendorID from route parameters
            size: req.query.size, // Get size from query parameters
            page: req.query.page, // Get page from query parameters
            searchString: req.query.searchString, // Get search string from query parameters
            headers: req.headers // Pass headers if needed for localization
        };

        const result = await productController.getProductsByVendorId(payload); // Call the controller method
        res.status(200).json(result); // Send the response back to the client
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors appropriately
    }
});



// Define the route for getting products by vendor ID
router.get('/getall', async (req, res) => {
    try {
        const payload = {
            vendorID: req.params.vendorID, // Get vendorID from route parameters
            size: req.query.size, // Get size from query parameters
            page: req.query.page, // Get page from query parameters
            searchString: req.query.searchString, // Get search string from query parameters
            headers: req.headers // Pass headers if needed for localization
        };

        const result = await adminProductController.getAllProducts(payload); // Call the controller method
        res.status(200).json(result); // Send the response back to the client
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors appropriately
    }
});



// POST: Add a rating to a product
router.post('/ratings/:id', createRating);

// GET: Get all ratings for a product
router.get('/ratings/getbyId/:id', getRatings);

// Activate  product API route
router.put('/activate/:id', auth, toggleActiveStatus);

// update all product isActive false or true
router.put('/updateAll/active', updateAllProducts);

export default router;
