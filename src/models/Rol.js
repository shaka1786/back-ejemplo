import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Rol = sequelize.define("Rol", {
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
  tableName: "Rol",
  timestamps: false
});

export default Rol;