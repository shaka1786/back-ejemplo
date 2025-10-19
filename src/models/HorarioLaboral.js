import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const HorarioLaboral = sequelize.define("HorarioLaboral", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: "HorarioLaboral",
  timestamps: false
});

export default HorarioLaboral;