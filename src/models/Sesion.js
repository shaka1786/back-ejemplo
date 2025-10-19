import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Sesion = sequelize.define("Sesion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_entrenador: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_horario_plantilla: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "Sesion",
  timestamps: false
});

export default Sesion;