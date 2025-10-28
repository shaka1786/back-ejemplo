

import {Router} from 'express';

import { login,register,getUsuarios  } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();

router.post("/usuarios",register);

router.post("/login",login);

//router.get("/usuarios", getUsuarios); // ← nueva ruta para listar usuarios

router.get("/usuarios", verifyToken, getUsuarios);

export default router;