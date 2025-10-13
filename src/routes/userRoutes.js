import { Router } from "express";

import { getUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { register } from "../controllers/authController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", register);

router.put("/:id",updateUser)
router.delete("/:id",deleteUser)
export default router;
