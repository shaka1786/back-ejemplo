//import User from "../models/User.js"; antes
import Usuario from "../models/User.js";
import bcrypt from "bcryptjs";

// Crear un nuevo usuario
export const registrarUsuario = async (req, res) => {
  console.log("REQ BODY:", req.body); // 👈 Aquí se imprime el cuerpo recibido
  try {
    const { nombre, correo_electronico, contrasena, programa, id_rol } =
      req.body;

    // Validaciones simples
    if (!nombre || !correo_electronico || !contrasena || !id_rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existente = await Usuario.findOne({ where: { correo_electronico } });

    if (existente) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo_electronico,
      contrasena: hash,
      programa,
      id_rol,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario: nuevoUsuario,
    });
    //} catch (error) {
    //console.error(error);
    //res.status(500).json({ message: "Error al registrar usuario", error });
    //}
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message || error,
    });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
