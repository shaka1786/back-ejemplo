
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
