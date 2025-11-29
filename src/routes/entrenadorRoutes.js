import { Router } from 'express';
import { 
  buscarUsuarioPorCorreo, 
  getMisHorarios, 
  marcarAsistencia 
} from '../controllers/entrenadorController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyRole } from '../middleware/verifyRole.js';

const router = Router();

// Todas las rutas requieren token y rol de Entrenador
router.use(verifyToken);
router.use(verifyRole(['Entrenador']));

router.get('/buscar-usuario', buscarUsuarioPorCorreo);
router.get('/mis-horarios', getMisHorarios);
router.post('/asistencia', marcarAsistencia);

export default router;