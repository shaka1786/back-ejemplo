import HorarioLaboral from "../models/HorarioLaboral.js";

export const getHorarios = async (req, res) => {
  try {
    const horarios = await HorarioLaboral.findAll({
      order: [["id", "ASC"]]
    });
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horarios", error: error.message });
  }
};