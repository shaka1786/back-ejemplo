import { Router } from "express";
import { realizarPago } from "../controllers/pagoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.post("/", verifyToken, realizarPago);
export default router;