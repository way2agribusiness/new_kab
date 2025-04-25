import express from 'express';
import {
    verifyPhoneFPO,
    registerFPO,
    loginFPO,
    logoutFPO,
    getFPOprofile,
    updateFPO,
    resetPasswordFPO,
    createFPOcontent,
    getAllFPOs,
    getFPOBySellerID,
    deleteFPOById,
    updateFPOcontent,
    getDistinctFPOFields,
    getFPOByNameAndTaluk,
    getFPOByDistrict,
    getAllFPOAdmin,
    getFPOBySlug
} from '../Controllers/FPOControllers.js';
import { authFPO } from '../Middleware/commonMiddleware.js';

const router = express.Router();

router.post('/phoneVerifyFPO', verifyPhoneFPO);

router.post('/registerFPO', registerFPO);

router.post('/loginFPO', loginFPO);

router.post('/logoutFPO', authFPO, logoutFPO);

router.get('/getbyId', authFPO, getFPOprofile);

router.put('/update/:id', updateFPO);

router.put('/resetPasswordFPO', resetPasswordFPO);

router.post('/data/post', createFPOcontent);

router.get('/data/get', getAllFPOs);

router.get('/data/getbyseller/:sellerID', getFPOBySellerID);

router.delete('/data/delete/:id', deleteFPOById);

router.put('/data/update/:id', updateFPOcontent);

router.get('/data/getdistrict', getDistinctFPOFields);

router.post('/data/get-fpo-by-name-taluk', getFPOByNameAndTaluk);

router.get('/data/district/:district', getFPOByDistrict);

router.get('/data/getall', getAllFPOAdmin);

router.get('/data/fpocontent/:slug', getFPOBySlug);

export default router;