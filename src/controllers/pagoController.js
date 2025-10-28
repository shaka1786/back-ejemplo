import Usuario_Realiza_Pago from "../models/Usuario_Realiza_Pago.js";
import TipoPagoMembresia from "../models/TipoPagoMembresia.js";
import Usuario from "../models/User.js";

export const realizarPago = async (req, res) => {
  try {
    const { id_usuario, id_pago } = req.body;
    const pago = await Usuario_Realiza_Pago.create({ id_usuario, id_pago });

    // Actualizar tiempo_restante en Usuario
    const tipo = await TipoPagoMembresia.findByPk(id_pago);
    await Usuario.increment("tiempo_restante", {
      by: tipo.tiempo,
      where: { id: id_usuario }
    });

    res.status(201).json({ message: "Pago realizado", pago });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};