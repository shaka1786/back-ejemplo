import { Router } from "express";
import { getHorarios } from "../controllers/horarioController.js";

const router = Router();
router.get("/", getHorarios); // Público
export default router;