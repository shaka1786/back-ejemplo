import { Router } from "express";
import { getTiposPago, createTipoPago } from "../controllers/tipoMembresiaController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.get("/", getTiposPago);
router.post("/", verifyToken, createTipoPago)
export default router;