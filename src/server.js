import app from "./app.js";
import sequelize from "./config/database.js";
import dotenv from "dotenv";

//import { Rol, HorarioLaboral, Usuario, Sesion, TipoPagoMembresia } from "./models/index.js";
import "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la BD");

    await sequelize.sync({ alter: true }); //se cambio a force para que cree/actualice tablas. Esto borra datos, entonces en produccion debe ser false
    console.log("Modelos Sincronizados");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor ejecutando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la BD", error);
  }
}

startServer();
