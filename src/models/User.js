
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import rol from "./Rol.js";

const usuario = sequelize.define("usuario", {
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
  eps: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  peso_inicial: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  /*fecha_vencimiento: {
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
    tableName: "usuario", // Asegúrate de que el nombre coincida con el de la tabla en la BD
    timestamps: true // Si tu tabla no tiene columnas createdAt y updatedAt, cambia esto a false
});

usuario.belongsTo(rol, {foreignKey: "id_rol"});


export default usuario;
