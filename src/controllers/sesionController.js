import Sesion from "../models/Sesion.js";
import Usuario from "../models/User.js";
import HorarioLaboral from "../models/HorarioLaboral.js";

export const createSesion = async (req, res) => {
  try {
    const { id_entrenador, id_horario_plantilla } = req.body;
    const sesion = await Sesion.create({ id_entrenador, id_horario_plantilla });
    res.status(201).json({ message: "Sesión creada", sesion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.findAll({
      include: [
        { model: Usuario, as: "Entrenador", attributes: ["nombre"] },
        { model: HorarioLaboral, attributes: ["descripcion"] }
      ]
    });
    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const eliminarSesion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación: solo Admin o Entrenador
    if (req.user.rol !== "Admin" && req.user.rol !== "Entrenador") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const sesion = await Sesion.findByPk(id);
    if (!sesion) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    // Eliminar (maneja FKs si onDelete configurado)
    await sesion.destroy();

    res.json({ message: "Sesión eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar sesión:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};