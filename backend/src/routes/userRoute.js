import { Router } from 'express'
import { getUser,returnX } from '../controllers/userController.js';

const router = Router()

router.get('/',getUser)
router.get('/x',returnX)


export default router;