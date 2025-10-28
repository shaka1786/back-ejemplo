import { Router } from "express";
import { createSesion, getSesiones,eliminarSesion } from "../controllers/sesionController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.post("/", verifyToken, createSesion); // Solo autenticados
router.get("/", getSesiones); // Público o protegido
router.delete("/:id", verifyToken, eliminarSesion);

export default router;  
