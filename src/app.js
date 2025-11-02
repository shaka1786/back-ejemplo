import express from "express";


import cors from "cors";  // Importa CORS
import dotenv from "dotenv";
import sequelize from "./config/database.js";  // Tu conexión a la BD
// Importa tus rutas (ej: authRoutes, etc.)

//import userRoutes from "./routes/userRoutes.js"; // 👈 aquí
import authRoutes from "./routes/authRoutes.js";
import tipoMembresiaRoutes from "./routes/tipoMembresiaRoutes.js";
import horarioRoutes from "./routes/horarioRoutes.js";
import sesionRoutes from "./routes/sesionRoutes.js";
import asistenciaRoutes from "./routes/asistenciaRoutes.js";
import pagoRoutes from "./routes/pagoRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',  // Permite cualquier dominio (útil para desarrollo o APIs públicas). En producción, especifica dominios por seguridad, ej: ['https://tu-react-app.com']
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Headers que usa tu API (ej: para JWT)
  credentials: true  // Si usas cookies/sesiones, actívalo
}));



// ✅ Middleware para procesar JSON
app.use(express.json());

// Rutas
//app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api/tipoMembresia", tipoMembresiaRoutes);

app.use("/api/horarios", horarioRoutes);

app.use("/api/sesiones", sesionRoutes);

app.use("/api/asistencias", asistenciaRoutes);

app.use("/api/pagos", pagoRoutes);

sequelize.authenticate()
.then(() => {
    console.log("Conexión a la BD exitosa");
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
})
.catch(err => console.error("Error conectando a la BD:", err));
export default app;