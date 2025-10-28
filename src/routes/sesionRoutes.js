import { Router } from "express";
import { createSesion, getSesiones } from "../controllers/sesionController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.post("/", verifyToken, createSesion); // Solo autenticados
router.get("/", getSesiones); // Público o protegido
export default router;