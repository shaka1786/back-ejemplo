
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Entrenador = sequelize.define("Entrenador", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        //unique: true,
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    id_horario_laborar: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: "Entrenador", // Asegúrate de que el nombre coincida con el de la tabla en la BD
    timestamps: false // Si tu tabla no tiene columnas createdAt y updatedAt, cambia esto a false
});

export default Entrenador;
