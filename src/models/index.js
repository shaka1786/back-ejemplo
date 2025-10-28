//Esta parte la cree para hacer las asociaciones entre los modelos
// (son basicamente las fk)
import Rol from "./Rol.js";
import HorarioLaboral from "./HorarioLaboral.js";
import Usuario from "./User.js"; 
import Sesion from "./Sesion.js";
import TipoPagoMembresia from "./TipoPagoMembresia.js";
import Usuario_Realiza_Pago from "./Usuario_Realiza_Pago.js";
// Importa junctions si las creas

// Asociaciones
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });
Rol.hasMany(Usuario, { foreignKey: "id_rol" });

Usuario.belongsTo(HorarioLaboral, { foreignKey: "id_horario_laboral" });
HorarioLaboral.hasMany(Usuario, { foreignKey: "id_horario_laboral" });

Sesion.belongsTo(Usuario, { foreignKey: "id_entrenador", as: "Entrenador" });
Usuario.hasMany(Sesion, { foreignKey: "id_entrenador", as: "SesionesEntrenadas" });

Sesion.belongsTo(HorarioLaboral, { foreignKey: "id_horario_plantilla" });
HorarioLaboral.hasMany(Sesion, { foreignKey: "id_horario_plantilla" });

// Muchos-a-muchos
Usuario.belongsToMany(Sesion, { through: "AsistenciaUsuario", foreignKey: "id_usuario" });
Sesion.belongsToMany(Usuario, { through: "AsistenciaUsuario", foreignKey: "id_sesion" });

Usuario.belongsToMany(TipoPagoMembresia, { through: "Usuario_Realiza_Pago", foreignKey: "id_usuario" });
TipoPagoMembresia.belongsToMany(Usuario, { through: "Usuario_Realiza_Pago", foreignKey: "id_pago" });

// Asociación: Un Rol tiene muchos Tipos de Membresía
Rol.hasMany(TipoPagoMembresia, { foreignKey: "id_rol" });
TipoPagoMembresia.belongsTo(Rol, { foreignKey: "id_rol" });

Usuario.belongsToMany(TipoPagoMembresia, { through: Usuario_Realiza_Pago, foreignKey: "id_usuario" });
TipoPagoMembresia.belongsToMany(Usuario, { through: Usuario_Realiza_Pago, foreignKey: "id_pago" });

// Ejemplo para Sesion (entrenador)
Sesion.belongsTo(Usuario, { foreignKey: "id_entrenador", onDelete: "SET NULL" });
Usuario.hasMany(Sesion, { foreignKey: "id_entrenador", onDelete: "CASCADE" });

// Para Usuario_Realiza_Pago
Usuario.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_usuario", onDelete: "CASCADE" });

export { Rol, HorarioLaboral, Usuario, Sesion, TipoPagoMembresia, Usuario_Realiza_Pago };