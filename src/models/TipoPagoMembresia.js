/*
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

export default TipoPagoMembresia;*/

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import rol from "./Rol.js"; // Importa el modelo Rol

const TipoPagoMembresia = sequelize.define("TipoPagoMembresia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tiempo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Duración en meses (1, 3, 6, 12)"
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: rol,
      key: "id"
    }
  }
}, {
  tableName: "TipoPagoMembresia",
  timestamps: false,
  indexes: [
    { fields: ["id_rol", "tiempo"] } // Índice compuesto para búsquedas rápidas
  ]
});

// Asociaciones
TipoPagoMembresia.belongsTo(rol, { foreignKey: "id_rol" });
rol.hasMany(TipoPagoMembresia, { foreignKey: "id_rol" });

export default TipoPagoMembresia;