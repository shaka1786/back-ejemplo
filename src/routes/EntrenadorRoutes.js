import { Router } from "express";

import { getUsers, updateUser, deleteUser } from "../controllers/EntrenadorController.js";
import { register } from "../controllers/EntrenadorAuthController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", register);

router.put("/:id",updateUser)
router.delete("/:id",deleteUser)
export default router;
