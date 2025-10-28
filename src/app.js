import express from "express";

//import userRoutes from "./routes/userRoutes.js"; // 👈 aquí
import authRoutes from "./routes/authRoutes.js";
import tipoMembresiaRoutes from "./routes/tipoMembresiaRoutes.js";
import horarioRoutes from "./routes/horarioRoutes.js";
import sesionRoutes from "./routes/sesionRoutes.js";
import asistenciaRoutes from "./routes/asistenciaRoutes.js";
import pagoRoutes from "./routes/pagoRoutes.js";

const app = express();
// ✅ Middleware para procesar JSON
app.use(express.json());

// Rutas
//app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tipoMembresia", tipoMembresiaRoutes);
export default app;

app.use("/api/horarios", horarioRoutes);

app.use("/api/sesiones", sesionRoutes);

app.use("/api/asistencias", asistenciaRoutes);

app.use("/api/pagos", pagoRoutes);

