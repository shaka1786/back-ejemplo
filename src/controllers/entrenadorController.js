import Usuario from '../models/User.js';
import EntrenadorHorario from '../models/EntrenadorHorario.js';
import AsistenciaUsuario from '../models/AsistenciaUsuario.js';
import HorarioLaboral from '../models/HorarioLaboral.js';
import usuario from '../models/User.js';

export const buscarUsuarioPorCorreo = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    const usuario = await Usuario.findOne({
      where: { correo_electronico: email },
      attributes: { exclude: ['contrasena'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getMisHorarios = async (req, res) => {
  try {
    const id_entrenador = req.user.id;

    // Buscamos al entrenador y sus horarios asociados
    const entrenador = await Usuario.findByPk(id_entrenador, {
      include: [
        {
          model: HorarioLaboral,
          as: 'horarios', // Debe coincidir con el alias en models/index.js
          through: { attributes: [] } // No traer datos de la tabla intermedia
        }
      ]
    });

    if (!entrenador) {
      return res.status(404).json({ message: 'Entrenador no encontrado' });
    }

    // Devolvemos solo la lista de horarios
    res.json(entrenador.horarios);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
export const marcarAsistencia = async (req, res) => {
  try {
    const { id_usuario, id_horario } = req.body; // Recibimos id_horario, NO id_sesion
    const id_entrenador = req.user.id;

    // 1. Validar que el entrenador realmente tenga ese horario asignado
    const tieneHorario = await EntrenadorHorario.findOne({
      where: {
        id_usuario: id_entrenador,
        id_horario: id_horario
      }
    });

    if (!tieneHorario) {
      return res.status(403).json({ message: 'No tienes asignado este horario.' });
    }

    // 2. Marcar asistencia
    // Buscamos si ya existe asistencia para este alumno, con este entrenador, en este horario
    const [asistencia, created] = await AsistenciaUsuario.findOrCreate({
      where: { 
        id_usuario, 
        id_entrenador,
        id_horario 
      },
      defaults: { veces: 1 }
    });

    if (!created) {
      await asistencia.increment('veces');
    }

    res.json({ 
      message: `Asistencia marcada correctamente (${created ? 1 : asistencia.veces + 1} veces)`, 
    });

  } catch (error) {
    console.error('Error al marcar asistencia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};