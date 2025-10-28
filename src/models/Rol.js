import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const rol = sequelize.define("rol", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: "rol",
  timestamps: false
});

export default rol;