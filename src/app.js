import express from "express";

import userRoutes from "./routes/userRoutes.js"; // 👈 aquí



const app = express();

// ✅ Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);

export default app;
