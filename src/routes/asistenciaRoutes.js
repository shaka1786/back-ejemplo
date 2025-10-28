import { Router } from "express";
import { registrarAsistencia, getAsistencias } from "../controllers/asistenciaController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.post("/", verifyToken, registrarAsistencia);
router.get("/", verifyToken, getAsistencias);
export default router;