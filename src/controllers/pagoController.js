import sequelize from "../config/database.js";
import Usuario_Realiza_Pago from "../models/Usuario_Realiza_Pago.js";
import TipoPagoMembresia from "../models/TipoPagoMembresia.js";
import Usuario from "../models/User.js";

export const realizarPago = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario, id_pago, descripcion } = req.body;

    if (!id_usuario || !id_pago) {
      await t.rollback();
      return res.status(400).json({ message: "Faltan id_usuario o id_pago" });
    }

    const usuario = await Usuario.findByPk(id_usuario, { transaction: t });
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
    const pago = await Usuario_Realiza_Pago.create({ id_usuario, id_pago, descripcion }, { transaction: t });

    // Calcular nueva fecha_vencimiento
    let nuevaFecha = usuario.fecha_vencimiento ? new Date(usuario.fecha_vencimiento) : new Date();
    nuevaFecha.setDate(nuevaFecha.getDate() + tipoPago.tiempo);

    // Actualizar usuario
    await usuario.update({ fecha_vencimiento: nuevaFecha }, { transaction: t });

    await t.commit();

    // Refrescar usuario para obtener valor actualizado
    await usuario.reload();

    res.status(201).json({
      message: "Pago realizado y fecha de vencimiento actualizada",
      pago,
      tiempo_agregado: tipoPago.tiempo,
      fecha_vencimiento: usuario.fecha_vencimiento
    });
  } catch (error) {
    await t.rollback();
    console.error("Error en pago:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};