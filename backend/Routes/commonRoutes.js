import  express from 'express';
import { getUserProfile, loginUser, logoutUser, registerUser, verifyPhone,
    editProfile, updatePhoto, resetPassword, createFeedback, getFeedback,
    createAbout, updateAbout, getAboutById
 } from '../Controllers/commonControllers.js';
 import { saveCategories, getAllCategory, getAllCategoryfirst, getAgriServicesCategory } from '../Controllers/categoryaddControllers.js';
import { auth } from '../Middleware/commonMiddleware.js';
import upload from '../Middleware/uploadFileMiddleware.js';


const router = express.Router();

router.post('/phoneVerify', verifyPhone);

router.post('/register',  upload.single('photo'), registerUser);

router.post('/login', loginUser);

router.post('/resetPassword', resetPassword);

router.get('/getuser', auth, getUserProfile);

router.post('/logout',auth, logoutUser);

router.put('/editprofile/:id', editProfile);

router.put('/updateprofilepic/:id', updatePhoto);

router.post('/category', saveCategories);

router.get('/category/all', getAllCategory);

router.get('/category/get', getAllCategoryfirst);

router.get('/category/Agriservices', getAgriServicesCategory);

router.post('/feedback/post', createFeedback);

router.get('/feedback/get', getFeedback);

router.post('/about/post', createAbout);

router.put('/about/update/:userID', updateAbout);

router.get('/about/get/:id', getAboutById);

export default router;