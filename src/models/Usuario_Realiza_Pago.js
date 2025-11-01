import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./User.js";
import TipoPagoMembresia from "./TipoPagoMembresia.js";

const Usuario_Realiza_Pago = sequelize.define(
  "Usuario_Realiza_Pago",
  {
    id: {  // ← NUEVO: PK auto-increment para permitir duplicados
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_usuario: {  // No PK, permite duplicados
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id"
      },
      unique: false
    },
    id_pago: {  // No PK, permite duplicados
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoPagoMembresia,
        key: "id"
      },
      unique: false
      
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: "Usuario_Realiza_Pago",
    timestamps: true  // Activa createdAt/updatedAt para rastreo
  }
);

// Asociaciones (ya bien, pero ajusta para permitir múltiples)
Usuario.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_usuario" });
TipoPagoMembresia.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_pago" });

export default Usuario_Realiza_Pago;