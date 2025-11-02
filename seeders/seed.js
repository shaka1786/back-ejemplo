import dotenv from "dotenv";
dotenv.config({ path: '../.env' });
import sequelize from "../src/config/database.js";

import Rol from "../src/models/Rol.js";
import TipoPagoMembresia from "../src/models/TipoPagoMembresia.js";
import usuario from "../src/models/User.js"; // Ajusta si es User.js o Usuario.js
import HorarioLaboral from "../src/models/HorarioLaboral.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("JWT_SECRET cargado:", process.env.JWT_SECRET ? "Sí" : "No");  // Debug
    console.log("DB_USER cargado:", process.env.DB_USER ? "Sí" : "No");  // Debug
    // Forzar recreación de tablas para desarrollo (cuidado: elimina datos existentes)
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
await sequelize.drop();
await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
await sequelize.sync({ alter: true });

    console.log("Tablas sincronizadas");

/* Insertar Roles 
1. Admin
2. Estudiantes
3. Egresados
4. Familiares y convenio
5. Particulares
6. Colaboradores
7. Entrenadores*/
    const roles = await Rol.bulkCreate([
      { nombre: "Admin" },
      { nombre: "Estudiante" },
      { nombre: "Egresado" },
      { nombre: "Convenio" },
      { nombre: "Particular" },
      { nombre: "Colaborador" },
      { nombre: "Entrenador" }
    ], { returning: true });
    console.log("Roles insertados");
// 2. Horarios Laborales
    await HorarioLaboral.bulkCreate([
  { descripcion: "Lunes - Mañana (10:00 a.m. - 2:00 p.m.)" },
  { descripcion: "Lunes - Tarde (3:00 p.m. - 7:00 p.m.)" },
  { descripcion: "Martes - Mañana (7:00 a.m. - 2:00 p.m.)" },
  { descripcion: "Martes - Tarde (3:00 p.m. - 6:00 p.m.)" },
  { descripcion: "Miércoles - Mañana (10:00 a.m. - 2:00 p.m.)" },
  { descripcion: "Miércoles - Tarde (3:00 p.m. - 7:00 p.m.)" },
  { descripcion: "Jueves - Mañana (7:00 a.m. - 2:00 p.m.)" },
  { descripcion: "Jueves - Tarde (3:00 p.m. - 6:00 p.m.)" },
  { descripcion: "Viernes - Mañana (7:00 a.m. - 2:00 p.m.)" },
  { descripcion: "Viernes - Tarde (3:00 p.m. - 5:30 p.m.)" }
]);
console.log("Horarios laborales insertados");

const rolMap = {};
    roles.forEach(rol => {
      rolMap[rol.nombre] = rol.id;
    });
 // 3. Tipos de Membresía por Rol
    await TipoPagoMembresia.bulkCreate([
      // === ESTUDIANTES ===
      { tiempo: 1, valor: 9700, id_rol: rolMap["Estudiante"] },
      { tiempo: 30, valor: 35500, id_rol: rolMap["Estudiante"] },
      { tiempo: 90, valor: 68200, id_rol: rolMap["Estudiante"] },
      { tiempo: 180, valor: 108900, id_rol: rolMap["Estudiante"] },

      // === EGRESADOS ===
      { tiempo: 1, valor: 11200, id_rol: rolMap["Egresado"] },
      { tiempo: 30, valor: 39700, id_rol: rolMap["Egresado"] },
      { tiempo: 90, valor: 68200, id_rol: rolMap["Egresado"] },
      { tiempo: 180, valor: 122300, id_rol: rolMap["Egresado"] },

      // === CONVENIOS Y FAMILIARES ===
      { tiempo: 1, valor: 11100, id_rol: rolMap["Convenio"] },
      { tiempo: 30, valor: 66700, id_rol: rolMap["Convenio"] },
      { tiempo: 90, valor: 114300, id_rol: rolMap["Convenio"] },
      { tiempo: 180, valor: 190200, id_rol: rolMap["Convenio"] },

      // === PARTICULARES ===
      { tiempo: 1, valor: 13700, id_rol: rolMap["Particular"] },
      { tiempo: 30, valor: 95700, id_rol: rolMap["Particular"] },
      { tiempo: 90, valor: 163000, id_rol: rolMap["Particular"] },
      { tiempo: 180, valor: 271800, id_rol: rolMap["Particular"] },
    ]);

    console.log("Tipos de membresía insertados");

    // 4. Admin
    const hashed = await bcrypt.hash("admin123", 10);
    await usuario.create({
      nombre: "Admin Gym",
      correo_electronico: "admin@gym.com",
      contrasena: hashed,
      id_rol: rolMap["Admin"],
      id_horario_laboral: 1,
      programa: "Administración",
      eps: "Ninguno",
      peso_inicial: 0,
      fecha_vencimiento: null
    });
    console.log("Usuario Admin insertado");



    console.log("Seed completado con éxito");
  } catch (error) {
    console.error("Error en seeder:", error);
  }
}

seed();

//C:\Users\Aqua\Desktop\Tareas\API_Gym\back-ejemplo