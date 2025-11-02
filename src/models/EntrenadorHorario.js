import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./User.js";
import HorarioLaboral from "./HorarioLaboral.js";

const EntrenadorHorario = sequelize.define("EntrenadorHorario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  id_horario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: HorarioLaboral,
      key: 'id'
    }
  }
}, {
  tableName: "EntrenadorHorario",
  timestamps: false
});

export default EntrenadorHorario;