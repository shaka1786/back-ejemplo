import express from "express";

import userRoutes from "./routes/userRoutes.js"; // 👈 aquí



const app = express();

// ✅ Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);

app == null ?  1 :  0; //Prueba de push. Eliminar luego

export default app;
