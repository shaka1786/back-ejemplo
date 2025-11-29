import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsistenciaUsuario = sequelize.define("AsistenciaUsuario", {
  id: { 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_entrenador: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_horario: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  veces: {
    type: DataTypes.INTEGER,
    defaultValue: 1
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