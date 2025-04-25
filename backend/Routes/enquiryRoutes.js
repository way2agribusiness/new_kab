import express from "express";
import {
    createVendorEnquiry, getEnquiriesByVendorID, createAdminEnquiry,
    getEnquiriesByAdmin, getEnquiryById, toggleEnquiryApproval, getApprovedEnquiries,
    getEnquiriesByID, viewedEnquiry, viewedAdminEnquiry, createGeneralEnquiry, getAllGeneralEnquiries,
    getGeneralEnquiryById, createAddEnquiry, getAllAddEnquiries, getAddEnquiryById, viewedAddEnquiry,
    addVendorToIsRemoved

} from "../Controllers/enquiryControllers.js";
import { auth } from '../Middleware/commonMiddleware.js';

const router = express.Router();

router.post('/vendor', createVendorEnquiry);

router.get('/list/:vendorID', getEnquiriesByVendorID);

router.post('/admin', createAdminEnquiry);

router.get('/chart', getEnquiriesByAdmin);

router.get('/getbyId/:id', getEnquiryById);

router.patch('/approval/:id', auth, toggleEnquiryApproval);

router.get('/approved/getall', getApprovedEnquiries);

router.get('/getbyId/details/:id', getEnquiriesByID);

router.patch('/views/:enquiryId', viewedEnquiry);

router.patch('/views/buyer/:enquiryId', viewedAdminEnquiry);

router.post('/general/post', createGeneralEnquiry);

router.get('/general/get', getAllGeneralEnquiries);

router.get('/general/getbyId/:id', getGeneralEnquiryById);

router.post('/addEnquiry/post', createAddEnquiry);

router.get('/addEnquiry/get/:vendorID', getAllAddEnquiries);

router.get('/addEnquiry/getbyId/:id', getAddEnquiryById);

router.patch('/addEnquiry/views/:enquiryId', viewedAddEnquiry);

router.put('/addEnquiry/remove/:enquiryID', addVendorToIsRemoved);

export default router;