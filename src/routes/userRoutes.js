import { Router  } from "express";

import { obtenerUsuarios,registrarUsuario } from "../controllers/userController.js";

// Crear el enrutador
const router = Router();



// Definir rutas
router.get("/", obtenerUsuarios);
router.post("/", registrarUsuario);

// Exportar el router
export default router;