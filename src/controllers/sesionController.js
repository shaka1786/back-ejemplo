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