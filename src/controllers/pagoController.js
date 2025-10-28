import sequelize from "../config/database.js";
import Usuario_Realiza_Pago from "../models/Usuario_Realiza_Pago.js";
import TipoPagoMembresia from "../models/TipoPagoMembresia.js";
import Usuario from "../models/User.js";

export const realizarPago = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario, id_pago } = req.body;

    if (!id_usuario || !id_pago) {
      await t.rollback();
      return res.status(400).json({ message: "Faltan id_usuario o id_pago" });
    }

    // Buscar usuario y tipo de pago en una sola transacción
    const [usuario, tipoPago] = await Promise.all([
      Usuario.findByPk(id_usuario, { transaction: t }),
      TipoPagoMembresia.findByPk(id_pago, { transaction: t })
    ]);

    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!tipoPago) {
      await t.rollback();
      return res.status(404).json({ message: "Tipo de pago no encontrado" });
    }

    // Crear pago dentro de la transacción
    const pago = await Usuario_Realiza_Pago.create(
      { id_usuario, id_pago },
      { transaction: t }
    );

    // Actualizar tiempo_restante (dentro de la transacción)
    await Usuario.increment("tiempo_restante", {
      by: tipoPago.tiempo,
      where: { id: id_usuario },
      transaction: t
    });

    // Confirmar todo
    await t.commit();

    // Obtener tiempo actualizado
    const usuarioActualizado = await Usuario.findByPk(id_usuario);
    
    res.status(201).json({
      message: "Pago realizado y tiempo restante actualizado",
      pago,
      tiempo_agregado: tipoPago.tiempo,
      tiempo_restante: usuarioActualizado.tiempo_restante
    });
  } catch (error) {
    await t.rollback();
    console.error("Error en pago:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};