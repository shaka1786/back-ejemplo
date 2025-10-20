import TipoPagoMembresia from "../models/TipoPagoMembresia.js";

export const getTiposPago = async (req, res) => {
  try {
    const tipos = await TipoPagoMembresia.findAll();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipos de membresía", error: error.message });
  }
};

export const createTipoPago = async (req, res) => {
  try {
    const { tiempo, valor } = req.body;
    if (!tiempo || !valor) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    const nuevoTipo = await TipoPagoMembresia.create({ tiempo, valor });
    res.status(201).json({ message: "Tipo de membresía creado", tipo: nuevoTipo });
  } catch (error) {
    res.status(500).json({ message: "Error al crear tipo de membresía", error: error.message });
  }
};