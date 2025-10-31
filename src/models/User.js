
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import rol from "./Rol.js";
import HorarioLaboral from "./HorarioLaboral.js";

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  programa: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_horario_laboral: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  seguro: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  peso_inicial: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  /*tiempo_restante: {
    type: DataTypes.INTEGER,
    allowNull: true
  }*/
 fecha_vencimiento: {
  type: DataTypes.DATE,
  allowNull: true,
  defaultValue: null 
 }
}, 
{
    tableName: "Usuario", // Asegúrate de que el nombre coincida con el de la tabla en la BD
    timestamps: true // Si tu tabla no tiene columnas createdAt y updatedAt, cambia esto a false
});

User.belongsTo(rol, {foreignKey: "id_rol"});
User.belongsTo(HorarioLaboral, {foreignKey: "id_horario_laboral"})

export default Usuario;

/*  //antes de modificar las bD
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING(100),
        allowNull: false,
        //unique: true,
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    programa: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    rol: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    seguro: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    peso_inicial: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    tiempo_restante: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: "Usuario", // Asegúrate de que el nombre coincida con el de la tabla en la BD
    timestamps: false // Si tu tabla no tiene columnas createdAt y updatedAt, cambia esto a false
});

export default User;

*/