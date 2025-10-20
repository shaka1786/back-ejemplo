import express from "express";

//import userRoutes from "./routes/userRoutes.js"; // 👈 aquí
import authRoutes from "./routes/authRoutes.js";


const app = express();

// ✅ Middleware para procesar JSON
app.use(express.json());

// Rutas
//app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
