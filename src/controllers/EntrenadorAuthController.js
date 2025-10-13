import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import Entrenador from "../models/Entrenador.js";

export const registerEntrenador = async (req, res) => {
  try {
    const {
      nombre, 
      correo,
      contrasena, 
      id_horario_laborar,
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        message: "Nombre, correo electrónico y contraseña son requeridos",
      });
    }

    // Verificar si el correo ya existe
    const userExist = await User.findOne({ where: { correo } });

    if (userExist) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      id_horario_labora,
    });

    // Eliminar la contraseña del objeto antes de enviarlo
    const userSafe = newUser.toJSON();
    delete userSafe.contrasena;

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      user: userSafe,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res
        .status(400)
        .json({ message: "Correo y password son requeridos" });
    }

    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const payload = { id: user.id, correo: user.correo };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userSafe = user.toJSON();
    delete userSafe.password;

    return res.json({
      message: "Login exitoso",
      user: userSafe,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll(); // obtiene todos los usuarios
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
