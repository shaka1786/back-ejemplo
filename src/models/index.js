import Rol from "./Rol.js";
import HorarioLaboral from "./HorarioLaboral.js";
import Usuario from "./User.js";
import TipoPagoMembresia from "./TipoPagoMembresia.js";
import Usuario_Realiza_Pago from "./Usuario_Realiza_Pago.js";
import EntrenadorHorario from "./EntrenadorHorario.js";
import AsistenciaUsuario from "./AsistenciaUsuario.js"; 

// 1. Usuarios y Roles
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });
Rol.hasMany(Usuario, { foreignKey: "id_rol" });

// 2. Entrenadores y sus Horarios (EntrenadorHorario)
Usuario.belongsToMany(HorarioLaboral, {
  through: EntrenadorHorario,
  foreignKey: "id_usuario",
  otherKey: "id_horario",
  as: "horarios" 
});
HorarioLaboral.belongsToMany(Usuario, {
  through: EntrenadorHorario,
  foreignKey: "id_horario",
  otherKey: "id_usuario",
  as: "entrenadores"
});

// 3. Membresías y Roles
Rol.hasMany(TipoPagoMembresia, { foreignKey: "id_rol" });
TipoPagoMembresia.belongsTo(Rol, { foreignKey: "id_rol" });

// 4. Pagos
Usuario.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_usuario" });
Usuario_Realiza_Pago.belongsTo(Usuario, { foreignKey: "id_usuario" });
TipoPagoMembresia.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_pago" });
Usuario_Realiza_Pago.belongsTo(TipoPagoMembresia, { foreignKey: "id_pago" });

// 5. Asistencias 
Usuario.hasMany(AsistenciaUsuario, { foreignKey: "id_usuario" }); 
AsistenciaUsuario.belongsTo(Usuario, { foreignKey: "id_usuario", as: "Alumno" });

Usuario.hasMany(AsistenciaUsuario, { foreignKey: "id_entrenador" });
AsistenciaUsuario.belongsTo(Usuario, { foreignKey: "id_entrenador", as: "Entrenador" });

HorarioLaboral.hasMany(AsistenciaUsuario, { foreignKey: "id_horario" });
AsistenciaUsuario.belongsTo(HorarioLaboral, { foreignKey: "id_horario" });

export { Rol, HorarioLaboral, Usuario, TipoPagoMembresia, Usuario_Realiza_Pago, EntrenadorHorario, AsistenciaUsuario };