export const verifyRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.rol; // Asegúrate de incluir rol en JWT
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};