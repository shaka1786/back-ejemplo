import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./User.js";
import TipoPagoMembresia from "./TipoPagoMembresia.js";

const Usuario_Realiza_Pago = sequelize.define(
  "Usuario_Realiza_Pago",
  {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    id_usuario: {
      type: DataTypes.INTEGER,
          allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
    id_pago: {
      type: DataTypes.INTEGER,
          allowNull: false,
      references: {
        model: TipoPagoMembresia,
        key: "id",
      },
    },
  },
  {
    tableName: "Usuario_Realiza_Pago",
    timestamps: true,  // ← CAMBIO: Activa timestamps (createdAt y updatedAt)
  }
);

// Asociaciones (opcional, ya están en index.js)
Usuario.belongsToMany(TipoPagoMembresia, {
  through: Usuario_Realiza_Pago,
  foreignKey: "id_usuario",
});
TipoPagoMembresia.belongsToMany(Usuario, {
  through: Usuario_Realiza_Pago,
  foreignKey: "id_pago",
});

export default Usuario_Realiza_Pago;