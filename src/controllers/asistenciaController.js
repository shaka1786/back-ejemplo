import AsistenciaUsuario from "../models/AsistenciaUsuario.js";
import EntrenadorHorario from "../models/EntrenadorHorario.js";
import Usuario from "../models/User.js";

export const registrarAsistencia = async (req, res) => {
  try {
    const { id_usuario, id_horario} = req.body;
    const asistencia = await AsistenciaUsuario.create({ id_usuario, id_horario});
    res.status(201).json({ message: "Asistencia registrada", asistencia });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAsistencias = async (req, res) => {
  try {
    const asistencias = await AsistenciaUsuario.findAll({
      include: [Usuario, EntrenadorHorario]
    });
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};