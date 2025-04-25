import express from 'express';
import { 
    getAllUsersWithDetails, getUserProfileById, StatsController, toggleBlockStatus, getBlockedUsers

} from '../Controllers/adminControllers.js';
import { auth } from '../Middleware/commonMiddleware.js';

const router = express.Router();

router.get('/users/get', getAllUsersWithDetails);

router.get('/getuserbyid/:id', getUserProfileById);

router.get('/dashboard', StatsController.getAllStats);

router.patch('/isblocked/:id', auth, toggleBlockStatus);

router.get('/blocked/user', getBlockedUsers);


export default router;