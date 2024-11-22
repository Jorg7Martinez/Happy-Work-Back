const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const protect = async (req, res, next) => {
  let token;
  
  // Verifica si el token esta en el encabezado Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extrae el token del encabezado
      token = req.headers.authorization.split(" ")[1];

      // Verifica el token con JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Encuentra al usuario por el ID que está en el payload del token
      req.user = await User.findById(decoded.id).select("-password");

      // Si todo es correcto, pasa al siguiente middleware o ruta
      next();
    } catch (error) {
      // Si hay un error al verificar el token, responde con error 401
      res.status(401).json({ message: "Token no autorizado" });
    }
  }

  // Si no hay token, responde con error 401
  if (!token) {
    res.status(401).json({ message: "No hay token" });
  }
};

module.exports = { protect };
