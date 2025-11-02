

import {Router} from 'express';
import { login,register,getUsuarios,eliminarUsuario,getCurrentUser,getRoles  } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();


router.get("/roles", verifyToken, getRoles); // Nueva ruta para roles
router.post("/login",login);
router.post("/usuarios", verifyToken, (req, res, next) => {
  if (req.user.rol !== "Admin") {
    return res.status(403).json({ message: "Acceso denegado: solo Admin puede registrar" });
  }
  next();
}, register);

//router.get("/usuarios", getUsuarios); // ← nueva ruta para listar usuarios

router.get("/usuarios", verifyToken, getUsuarios);
router.delete("/usuarios/:id", verifyToken, eliminarUsuario);
router.get("/me", verifyToken, getCurrentUser);

export default router;