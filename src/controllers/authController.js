// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import rol from "../models/Rol.js";
import "../models/index.js";
import Sesion from "../models/Sesion.js";
import TipoPagoMembresia from "../models/TipoPagoMembresia.js";
import Usuario_Realiza_Pago from "../models/Usuario_Realiza_Pago.js";
import sequelize from "../config/database.js"; // Para transacciones
// Asegúrate de importar los modelos necesarios para las asociaciones (aunque index.js debería manejarlas si se carga primero)

// ====== REGISTRO ======
export const register = async (req, res) => {
    // 💡 CAMBIO CRUCIAL: Usamos 'let' para poder reasignar valores (limpieza de datos)
    let { 
        nombre, 
        apellido, 
        email, 
        password, 
        id_rol, 
        programa, 
        id_horarios,
        // Agrega aquí todas las demás variables (ej. eps, peso_inicial) si las usas
        fecha_vencimiento = null
    } = req.body; 
    let t;
    // ...
    // ...
  try {
    t = await sequelize.transaction();
    let { nombre, correo_electronico, contrasena, programa, id_rol, eps, peso_inicial, id_horarios, fecha_vencimiento = null } = req.body; // <-- Cambiado a let
    id_rol = Number(id_rol);
// ...
    // Validaciones obligatorias
    if (!nombre || !correo_electronico || !contrasena || !id_rol) {
      await t.rollback();
      return res.status(400).json({ message: "Faltan campos obligatorios: nombre, correo_electronico, contrasena, id_rol" });
    }
    
    // Validaciones condicionales
    if (id_rol === 2 && !programa) { // Estudiante requiere programa
      return res.status(400).json({ message: "Programa académico es requerido para Estudiantes" });
    }
    if (id_rol === 7 && (!id_horarios || !Array.isArray(id_horarios) || id_horarios.length === 0)) {
      await t.rollback();
      return res.status(400).json({ message: "Horario laboral (id_horarios) es requerido como array para Entrenadores" });
    }
    
    // Validar que id_rol sea uno de los permitidos (1-7)
    if (![1, 2, 3, 4, 5, 6, 7].includes(id_rol)) {
      return res.status(400).json({ message: "id_rol inválido. Debe ser entre 1 y 7" });
    }
    if (id_rol !== 2 || !programa) {
             programa = null;
        }
    if (id_rol !== 7) {
       id_horarios = []; // Asegurarse que no se procese si no es Entrenador
    }

    const userExist = await User.findOne({ where: { correo_electronico } });
    if (userExist) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const newUser = await User.create({
      nombre, correo_electronico, contrasena: hashedPassword, programa, id_rol, eps, peso_inicial, fecha_vencimiento
      // La columna id_horario_laboral ya no existe [cf. 41]
    }, { transaction: t });
    const userSafe = newUser.toJSON();
    delete userSafe.contrasena;
    if (id_rol === 7 && id_horarios.length > 0) {
      // Sequelize nos da este método "setHorarios" gracias al alias "as: 'horarios'"
      await newUser.setHorarios(id_horarios, { transaction: t });
    }

    await t.commit(); // Confirmar la transacción

    res.status(201).json({ message: "Usuario registrado con éxito", user: userSafe });
  } catch (error) {
        // 🚨 CAMBIO CRUCIAL: Muestra el mensaje de error real de la DB
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor. Revisar logs para detalles.",
            // 💡 Esta línea te devolverá el mensaje de error exacto de la base de datos (p. ej., "NOT NULL constraint failed")
            db_error_detail: error.message 
        });
    }
};
// ====== OBTENER ROLES (nuevo endpoint para lista desplegable) ======
export const getRoles = async (req, res) => {
  try {
    const roles = await rol.findAll({ attributes: ['id', 'nombre'] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener roles", error: error.message });
  }
};

// ====== LOGIN ======
export const login = async (req, res) => {
  try {
    const { correo_electronico, password } = req.body;

    // 🟡 Validación básica
    if (!correo_electronico || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }

    // 🔍 Buscar usuario por correo
    const user = await User.findOne({
      where: { correo_electronico },
      include: [{ model: rol, attributes: ["nombre"] }]
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (!user.rol || !user.rol.nombre) {
      return res.status(500).json({ message: "Rol no encontrado para el usuario" });
    }

    // 🔑 Validar contraseña
    const isValid = await bcrypt.compare(password, user.contrasena);
    if (!isValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 🧩 Crear payload para el JWT
    const payload = {
      id: user.id,
      correo_electronico: user.correo_electronico,
      rol: user.rol.nombre
    };

    // 🔐 Crear token con clave secreta del .env
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 🟢 Respuesta final al frontend
    res.json({
      message: "Login exitoso",
      token, // el JWT
      user: {
        id: user.id,
        nombre: user.nombre,
        correo_electronico: user.correo_electronico,
        rol: user.rol.nombre,
        fecha_vencimiento: user.fecha_vencimiento
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// GET /api/auth/me - Devuelve details del user autenticado
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {  // req.user viene de verifyToken middleware
      include: [{ model: rol, attributes: ["nombre"] }]
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user.id,
      nombre: user.nombre,
      correo_electronico: user.correo_electronico,
      rol: user.rol.nombre
      // Agrega más fields si necesitas, pero solo los esenciales
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

// ====== OBTENER TODOS LOS USUARIOS ======
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      include: [{ model: rol, attributes: ["nombre"] }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ====== ELIMINAR USUARIO (SOLO ADMIN) ======
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.rol !== "Admin") {
      return res.status(403).json({ message: "Acceso denegado: solo Admin" });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// ====== ELIMINAR SESIÓN (ADMIN O ENTRENADOR) ======
export const eliminarSesion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!["Admin", "Entrenador"].includes(req.user.rol)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const sesion = await Sesion.findByPk(id);
    if (!sesion) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    await sesion.destroy();
    res.json({ message: "Sesión eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar sesión:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// ====== REALIZAR PAGO Y ACTUALIZAR TIEMPO RESTANTE ======
export const realizarPago = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario, id_pago } = req.body;

    if (!id_usuario || !id_pago) {
      await t.rollback();
      return res.status(400).json({ message: "Faltan id_usuario o id_pago" });
    }

    const usuario = await User.findByPk(id_usuario, { transaction: t });
    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const tipoPago = await TipoPagoMembresia.findByPk(id_pago, { transaction: t });
    if (!tipoPago) {
      await t.rollback();
      return res.status(404).json({ message: "Tipo de pago no encontrado" });
    }

    // Registrar pago
    await Usuario_Realiza_Pago.create(
      { id_usuario, id_pago },
      { transaction: t }
    );

    // Sumar tiempo
    let nuevaFecha;
    if (usuario.fecha_vencimiento){
      nuevaFecha= new Date(usuario.fecha_vencimiento)

    }else{
      nuevaFecha=new Date();
    }
    nuevaFecha.setDate(nuevaFecha.getDate() + tipoPago.tiempo);
    await usuario.update({ fecha_vencimiento: nuevaFecha }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Pago realizado y tiempo actualizado",
      tiempo_agregado: tipoPago.tiempo,
      fecha_vencimiento: nuevoTiempo
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    await t.rollback();
    console.error("Error en pago:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};