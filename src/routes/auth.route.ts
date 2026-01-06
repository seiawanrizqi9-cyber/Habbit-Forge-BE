import { Router } from "express";
import * as authController from '../controller/auth.controller'


const router = Router()

router.post('/login', authController.login )

router.post('/register', authController.register)

router.get('/me', authController.meController)

// untuk log itu urusan FE dengan menambahkan 
// const logout = () => {
//   localStorage.removeItem('token');
//   window.location.href = '/login';
// };
export default router