// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import rol from "../models/Rol.js";
import Sesion from "../models/Sesion.js";
import TipoPagoMembresia from "../models/TipoPagoMembresia.js";
import Usuario_Realiza_Pago from "../models/Usuario_Realiza_Pago.js";
import sequelize from "../config/database.js"; // Para transacciones

// ====== REGISTRO ======
export const register = async (req, res) => {
  try {
    const { nombre, correo_electronico, contrasena, programa, id_rol, eps, peso_inicial, fecha_vencimiento } = req.body;
    if (!nombre || !correo_electronico || !contrasena || !id_rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    const userExist = await User.findOne({ where: { correo_electronico } });
    if (userExist) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const newUser = await User.create({
      nombre, correo_electronico, contrasena: hashedPassword, programa, id_rol, eps, peso_inicial, fecha_vencimiento
    });
    const userSafe = newUser.toJSON();
    delete userSafe.contrasena;
    res.status(201).json({ message: "Usuario registrado con éxito", user: userSafe });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// ====== LOGIN ======
export const login = async (req, res) => {
  try {
    const { correo_electronico, password } = req.body;
    if (!correo_electronico || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }

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
    const isValid = await bcrypt.compare(password, user.contrasena);
    if (!isValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const payload = {
      id: user.id,
      correo_electronico: user.correo_electronico,
      rol: user.rol.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo_electronico: user.correo_electronico,
        rol: user.rol.nombre
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
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
    await t.rollback();
    console.error("Error en pago:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};