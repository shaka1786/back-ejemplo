import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsistenciaUsuario = sequelize.define("AsistenciaUsuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_sesion: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  veces: {
    type: DataTypes.INTEGER,
    allowNull: true // Asumiendo nullable si no especificado
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "AsistenciaUsuario",
  timestamps: false
});

export default AsistenciaUsuario;