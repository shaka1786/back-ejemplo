import { Router } from "express";

import { getUsers, updateUser, deleteUser } from "../controllers/EntrenadorController.js";
import { registerEntrenador } from "../controllers/EntrenadorAuthController.js";

const routerEntrenador = Router();

routerEntrenador.get("/", getUsers);
routerEntrenador.post("/", registerEntrenador);

routerEntrenador.put("/:id", updateUser)
routerEntrenador.delete("/:id", deleteUser)
export default routerEntrenador;
