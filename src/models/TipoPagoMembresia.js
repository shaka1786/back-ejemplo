import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TipoPagoMembresia = sequelize.define("TipoPagoMembresia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tiempo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: "TipoPagoMembresia",
  timestamps: false
});

export default TipoPagoMembresia;