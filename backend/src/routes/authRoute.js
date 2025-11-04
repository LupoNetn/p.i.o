import { Router } from 'express';
import { googleCallbackController, googleOAuthSignupController, loginController, logoutController, refreshTokenController, signupController, verifyUser } from '../controllers/authController.js';


const router = Router()

router.post('/signup',signupController)
router.post('/login', loginController)
router.get('/refresh', refreshTokenController)
router.post('/logout',logoutController)
router.get('/me', verifyUser)

router.get('/google',googleOAuthSignupController)
router.get('/google/callback', googleCallbackController)




export default router;