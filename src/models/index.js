//Esta parte la cree para hacer las asociaciones entre los modelos
// (son basicamente las fk)
import Rol from "./Rol.js";
import HorarioLaboral from "./HorarioLaboral.js";
import Usuario from "./User.js"; 
import Sesion from "./Sesion.js";
import TipoPagoMembresia from "./TipoPagoMembresia.js";
import Usuario_Realiza_Pago from "./Usuario_Realiza_Pago.js";
import EntrenadorHorario from "./EntrenadorHorario.js"
// Importa junctions si las creas

// Asociaciones
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });
Rol.hasMany(Usuario, { foreignKey: "id_rol" });

Usuario.belongsToMany(HorarioLaboral, {
  through: EntrenadorHorario,
  foreignKey: "id_usuario", // Clave en la tabla join que apunta a Usuario
  otherKey: "id_horario",   // Clave en la tabla join que apunta a HorarioLaboral
  as: "horarios" // Nombre del alias para consultar
});
HorarioLaboral.belongsToMany(Usuario, {
  through: EntrenadorHorario,
  foreignKey: "id_horario",
  otherKey: "id_usuario",
  as: "entrenadores"
});

Sesion.belongsTo(Usuario, { foreignKey: "id_entrenador", as: "Entrenador" });
Usuario.hasMany(Sesion, { foreignKey: "id_entrenador", as: "SesionesEntrenadas" });

Sesion.belongsTo(HorarioLaboral, { foreignKey: "id_horario_plantilla" });
HorarioLaboral.hasMany(Sesion, { foreignKey: "id_horario_plantilla" });

// Muchos-a-muchos
Usuario.belongsToMany(Sesion, { through: "AsistenciaUsuario", foreignKey: "id_usuario" });
Sesion.belongsToMany(Usuario, { through: "AsistenciaUsuario", foreignKey: "id_sesion" });
/*Prueba
Usuario.belongsToMany(TipoPagoMembresia, { through: "Usuario_Realiza_Pago", foreignKey: "id_usuario" });
TipoPagoMembresia.belongsToMany(Usuario, { through: "Usuario_Realiza_Pago", foreignKey: "id_pago" });
*/
// Asociación: Un Rol tiene muchos Tipos de Membresía
Rol.hasMany(TipoPagoMembresia, { foreignKey: "id_rol" });
TipoPagoMembresia.belongsTo(Rol, { foreignKey: "id_rol" });
/* FK de Usuario_Realiza_Pago
Usuario.belongsToMany(TipoPagoMembresia, { through: Usuario_Realiza_Pago, foreignKey: "id_usuario" });
TipoPagoMembresia.belongsToMany(Usuario, { through: Usuario_Realiza_Pago, foreignKey: "id_pago" });*/

Usuario.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_usuario" });
Usuario_Realiza_Pago.belongsTo(Usuario, { foreignKey: "id_usuario" });

TipoPagoMembresia.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_pago" });
Usuario_Realiza_Pago.belongsTo(TipoPagoMembresia, { foreignKey: "id_pago" });


// Ejemplo para Sesion (entrenador)
Sesion.belongsTo(Usuario, { foreignKey: "id_entrenador", onDelete: "SET NULL" });
Usuario.hasMany(Sesion, { foreignKey: "id_entrenador", onDelete: "CASCADE" });

// Para Usuario_Realiza_Pago
Sesion.belongsTo(Usuario, { foreignKey: "id_entrenador", onDelete: "SET NULL" });
Usuario.hasMany(Sesion, { foreignKey: "id_entrenador", onDelete: "CASCADE" });

Usuario.hasMany(Usuario_Realiza_Pago, { foreignKey: "id_usuario", onDelete: "CASCADE" });

export { Rol, HorarioLaboral, Usuario, Sesion, TipoPagoMembresia, Usuario_Realiza_Pago, EntrenadorHorario };