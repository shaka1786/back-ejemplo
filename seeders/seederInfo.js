// seederInfo.js
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });
import sequelize from "../src/config/database.js";

import Rol from "../src/models/Rol.js";
import TipoPagoMembresia from "../src/models/TipoPagoMembresia.js";
import Usuario from "../src/models/User.js";
import HorarioLaboral from "../src/models/HorarioLaboral.js";
import EntrenadorHorario from "../src/models/EntrenadorHorario.js";
import Sesion from "../src/models/Sesion.js";
import Usuario_Realiza_Pago from "../src/models/Usuario_Realiza_Pago.js";
import AsistenciaUsuario from "../src/models/AsistenciaUsuario.js";
import bcrypt from "bcryptjs";

async function seederInfo() {
  try {
    console.log("Iniciando seeder con datos realistas...");
    console.log("JWT_SECRET cargado:", process.env.JWT_SECRET ? "Sí" : "No");
    console.log("DB_USER cargado:", process.env.DB_USER ? "Sí" : "No");

    // Forzar recreación de tablas para desarrollo
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ alter: true });

    console.log("Tablas sincronizadas");

    // 1. Insertar Roles
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

    const rolMap = {};
    roles.forEach(rol => {
      rolMap[rol.nombre] = rol.id;
    });

    // 2. Insertar Horarios Laborales
    const horarios = await HorarioLaboral.bulkCreate([
      { descripcion: "Lunes - Mañana (6:00 a.m. - 10:00 a.m.)" },
      { descripcion: "Lunes - Tarde (3:00 p.m. - 7:00 p.m.)" },
      { descripcion: "Martes - Mañana (6:00 a.m. - 10:00 a.m.)" },
      { descripcion: "Martes - Tarde (3:00 p.m. - 7:00 p.m.)" },
      { descripcion: "Miércoles - Mañana (6:00 a.m. - 10:00 a.m.)" },
      { descripcion: "Miércoles - Tarde (3:00 p.m. - 7:00 p.m.)" },
      { descripcion: "Jueves - Mañana (6:00 a.m. - 10:00 a.m.)" },
      { descripcion: "Jueves - Tarde (3:00 p.m. - 7:00 p.m.)" },
      { descripcion: "Viernes - Mañana (6:00 a.m. - 10:00 a.m.)" },
      { descripcion: "Viernes - Tarde (3:00 p.m. - 6:00 p.m.)" },
      { descripcion: "Sábado - Mañana (7:00 a.m. - 12:00 p.m.)" }
    ], { returning: true });
    console.log("Horarios laborales insertados");

    const horarioMap = {};
    horarios.forEach(horario => {
      // Crear un mapa simple para acceder a los IDs
      horarioMap[horario.id] = horario.id;
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

      // === CONVENIOS ===
      { tiempo: 1, valor: 11100, id_rol: rolMap["Convenio"] },
      { tiempo: 30, valor: 66700, id_rol: rolMap["Convenio"] },
      { tiempo: 90, valor: 114300, id_rol: rolMap["Convenio"] },
      { tiempo: 180, valor: 190200, id_rol: rolMap["Convenio"] },

      // === PARTICULARES ===
      { tiempo: 1, valor: 13700, id_rol: rolMap["Particular"] },
      { tiempo: 30, valor: 95700, id_rol: rolMap["Particular"] },
      { tiempo: 90, valor: 163000, id_rol: rolMap["Particular"] },
      { tiempo: 180, valor: 271800, id_rol: rolMap["Particular"] },

      // === COLABORADORES ===
      { tiempo: 1, valor: 5000, id_rol: rolMap["Colaborador"] },
      { tiempo: 30, valor: 25000, id_rol: rolMap["Colaborador"] },
      { tiempo: 90, valor: 60000, id_rol: rolMap["Colaborador"] },
      { tiempo: 180, valor: 100000, id_rol: rolMap["Colaborador"] }
    ]);
    console.log("Tipos de membresía insertados");

    // 4. Crear Usuarios con datos realistas
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // Administradores
    const admin1 = await Usuario.create({
      nombre: "María González",
      correo_electronico: "admin@gym.com",
      contrasena: hashedPassword,
      id_rol: rolMap["Admin"],
      eps: "Sura",
      peso_inicial: 65.5
    });

    const admin2 = await Usuario.create({
      nombre: "Carlos Rodríguez",
      correo_electronico: "c.rodriguez@gym.com",
      contrasena: hashedPassword,
      id_rol: rolMap["Admin"],
      eps: "Nueva EPS",
      peso_inicial: 78.2
    });

    // Estudiantes
    const estudiantes = await Usuario.bulkCreate([
      {
        nombre: "Ana López",
        correo_electronico: "ana.lopez@universidad.edu.co",
        contrasena: hashedPassword,
        programa: "Ingeniería de Sistemas",
        id_rol: rolMap["Estudiante"],
        eps: "Sura",
        peso_inicial: 58.0,
        fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        nombre: "Juan Pérez",
        correo_electronico: "juan.perez@universidad.edu.co",
        contrasena: hashedPassword,
        programa: "Medicina",
        id_rol: rolMap["Estudiante"],
        eps: "Coomeva",
        peso_inicial: 72.5,
        fecha_vencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        nombre: "Laura Martínez",
        correo_electronico: "laura.martinez@universidad.edu.co",
        contrasena: hashedPassword,
        programa: "Derecho",
        id_rol: rolMap["Estudiante"],
        eps: "Sanitas",
        peso_inicial: 61.3,
        fecha_vencimiento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        nombre: "Diego Ramírez",
        correo_electronico: "diego.ramirez@universidad.edu.co",
        contrasena: hashedPassword,
        programa: "Administración",
        id_rol: rolMap["Estudiante"],
        eps: "Nueva EPS",
        peso_inicial: 80.1,
        fecha_vencimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    ], { returning: true });

    // Egresados
    const egresados = await Usuario.bulkCreate([
      {
        nombre: "Carolina Vargas",
        correo_electronico: "carolina.vargas@gmail.com",
        contrasena: hashedPassword,
        programa: "Ingeniería Industrial",
        id_rol: rolMap["Egresado"],
        eps: "Sura",
        peso_inicial: 62.5,
        fecha_vencimiento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        nombre: "Roberto Castro",
        correo_electronico: "roberto.castro@gmail.com",
        contrasena: hashedPassword,
        programa: "Medicina",
        id_rol: rolMap["Egresado"],
        eps: "Sanitas",
        peso_inicial: 88.3,
        fecha_vencimiento: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      }
    ], { returning: true });

    // Convenios
    const convenios = await Usuario.bulkCreate([
      {
        nombre: "Alejandro Ruiz",
        correo_electronico: "alejandro.ruiz@empresa.com",
        contrasena: hashedPassword,
        id_rol: rolMap["Convenio"],
        eps: "Sura",
        peso_inicial: 76.8,
        fecha_vencimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        nombre: "Marcela Peña",
        correo_electronico: "marcela.pena@empresa.com",
        contrasena: hashedPassword,
        id_rol: rolMap["Convenio"],
        eps: "Sanitas",
        peso_inicial: 64.2,
        fecha_vencimiento: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      }
    ], { returning: true });

    // Particulares
    const particulares = await Usuario.bulkCreate([
      {
        nombre: "Jorge Gutiérrez",
        correo_electronico: "jorge.gutierrez@hotmail.com",
        contrasena: hashedPassword,
        id_rol: rolMap["Particular"],
        eps: "Sura",
        peso_inicial: 94.3,
        fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ], { returning: true });

    // Colaboradores
    const colaboradores = await Usuario.bulkCreate([
      {
        nombre: "Sandra López",
        correo_electronico: "sandra.lopez@universidad.edu.co",
        contrasena: hashedPassword,
        id_rol: rolMap["Colaborador"],
        eps: "Sura",
        peso_inicial: 61.5,
        fecha_vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ], { returning: true });

    // Entrenadores
    const entrenadores = await Usuario.bulkCreate([
      {
        nombre: "Mario Rodríguez",
        correo_electronico: "mario.rodriguez@gym.com",
        contrasena: hashedPassword,
        id_rol: rolMap["Entrenador"],
        eps: "Sura",
        peso_inicial: 85.0
      },
      {
        nombre: "Catalina Reyes",
        correo_electronico: "catalina.reyes@gym.com",
        contrasena: hashedPassword,
        id_rol: rolMap["Entrenador"],
        eps: "Sanitas",
        peso_inicial: 62.3
      },
      {
        nombre: "Héctor Suárez",
        correo_electronico: "hector.suarez@gym.com",
        contrasena: hashedPassword,
        id_rol: rolMap["Entrenador"],
        eps: "Coomeva",
        peso_inicial: 92.7
      }
    ], { returning: true });

    console.log("Usuarios insertados: 2 Admins, 4 Estudiantes, 2 Egresados, 2 Convenios, 1 Particular, 1 Colaborador, 3 Entrenadores");

    // 5. Asignar horarios a entrenadores
    await EntrenadorHorario.bulkCreate([
      // Mario Rodríguez
      { id_usuario: entrenadores[0].id, id_horario: horarios[0].id }, // Lunes mañana
      { id_usuario: entrenadores[0].id, id_horario: horarios[2].id }, // Martes mañana
      { id_usuario: entrenadores[0].id, id_horario: horarios[4].id }, // Miércoles mañana

      // Catalina Reyes
      { id_usuario: entrenadores[1].id, id_horario: horarios[1].id }, // Lunes tarde
      { id_usuario: entrenadores[1].id, id_horario: horarios[3].id }, // Martes tarde
      { id_usuario: entrenadores[1].id, id_horario: horarios[5].id }, // Miércoles tarde

      // Héctor Suárez
      { id_usuario: entrenadores[2].id, id_horario: horarios[6].id }, // Jueves mañana
      { id_usuario: entrenadores[2].id, id_horario: horarios[8].id }, // Viernes mañana
      { id_usuario: entrenadores[2].id, id_horario: horarios[10].id }  // Sábado mañana
    ]);
    console.log("Horarios asignados a entrenadores");

    // 6. Crear sesiones de entrenamiento
    const sesiones = await Sesion.bulkCreate([
      // Sesiones de Mario Rodríguez
      { id_entrenador: entrenadores[0].id, id_horario_plantilla: horarios[0].id },
      { id_entrenador: entrenadores[0].id, id_horario_plantilla: horarios[2].id },
      { id_entrenador: entrenadores[0].id, id_horario_plantilla: horarios[4].id },

      // Sesiones de Catalina Reyes
      { id_entrenador: entrenadores[1].id, id_horario_plantilla: horarios[1].id },
      { id_entrenador: entrenadores[1].id, id_horario_plantilla: horarios[3].id },
      { id_entrenador: entrenadores[1].id, id_horario_plantilla: horarios[5].id },

      // Sesiones de Héctor Suárez
      { id_entrenador: entrenadores[2].id, id_horario_plantilla: horarios[6].id },
      { id_entrenador: entrenadores[2].id, id_horario_plantilla: horarios[8].id },
      { id_entrenador: entrenadores[2].id, id_horario_plantilla: horarios[10].id }
    ], { returning: true });
    console.log("Sesiones de entrenamiento creadas");

    // 7. Registrar pagos realistas
    // Obtener tipos de pago
    const tiposPago = await TipoPagoMembresia.findAll();
    const pagoMap = {};
    tiposPago.forEach(pago => {
      pagoMap[`${pago.id_rol}_${pago.tiempo}`] = pago.id;
    });

    await Usuario_Realiza_Pago.bulkCreate([
      {
        id_usuario: estudiantes[0].id,
        id_pago: pagoMap[`${rolMap["Estudiante"]}_30`],
        descripcion: "Pago mensual estudiante - Tarjeta débito"
      },
      {
        id_usuario: egresados[0].id,
        id_pago: pagoMap[`${rolMap["Egresado"]}_90`],
        descripcion: "Pago trimestral egresado - Efectivo"
      },
      {
        id_usuario: convenios[0].id,
        id_pago: pagoMap[`${rolMap["Convenio"]}_30`],
        descripcion: "Pago mensual convenio - Transferencia"
      },
      {
        id_usuario: particulares[0].id,
        id_pago: pagoMap[`${rolMap["Particular"]}_30`],
        descripcion: "Pago mensual particular - Tarjeta crédito"
      }
    ]);
    console.log("Pagos registrados");

    // 8. Registrar asistencias realistas
    await AsistenciaUsuario.bulkCreate([
      // Ana López (estudiante)
      { id_usuario: estudiantes[0].id, id_sesion: sesiones[0].id, veces: 3 },
      { id_usuario: estudiantes[0].id, id_sesion: sesiones[1].id, veces: 2 },
      { id_usuario: estudiantes[0].id, id_sesion: sesiones[4].id, veces: 4 },

      // Juan Pérez (estudiante)
      { id_usuario: estudiantes[1].id, id_sesion: sesiones[1].id, veces: 5 },
      { id_usuario: estudiantes[1].id, id_sesion: sesiones[3].id, veces: 3 },
      { id_usuario: estudiantes[1].id, id_sesion: sesiones[5].id, veces: 2 },

      // Carolina Vargas (egresada)
      { id_usuario: egresados[0].id, id_sesion: sesiones[0].id, veces: 2 },
      { id_usuario: egresados[0].id, id_sesion: sesiones[2].id, veces: 4 },
      { id_usuario: egresados[0].id, id_sesion: sesiones[6].id, veces: 3 },

      // Alejandro Ruiz (convenio)
      { id_usuario: convenios[0].id, id_sesion: sesiones[7].id, veces: 6 },
      { id_usuario: convenios[0].id, id_sesion: sesiones[8].id, veces: 2 }
    ]);
    console.log("Asistencias registradas");

    console.log("==========================================");
    console.log("Seeder completado exitosamente!");
    console.log("Resumen de datos insertados:");
    console.log("- 7 Roles del sistema");
    console.log("- 11 Horarios laborales");
    console.log("- 20 Tipos de membresía/pago");
    console.log("- 15 Usuarios realistas");
    console.log("- 9 Asignaciones de horarios a entrenadores");
    console.log("- 9 Sesiones de entrenamiento");
    console.log("- 4 Pagos registrados");
    console.log("- 11 Registros de asistencia");
    console.log("==========================================");

  } catch (error) {
    console.error("Error en seeder:", error);
  }
}

// Ejecutar el seeder
seederInfo();