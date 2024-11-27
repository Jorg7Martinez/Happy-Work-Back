const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Company = require("../model/company.model");

const protect = async (req, res, next) => {
  let token;

  // Verifica si el token está presente en los encabezados
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Extrae el token solo una vez
    token = req.headers.authorization.split(" ")[1];
    console.log("Token recibido:", token); // Verifica que el token esté presente

    try {
      // Decodifica el token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded); // Verifica el contenido del token

      // Verifica si el token tiene un ID válido
      if (!decoded.id) {
        return res.status(401).json({ message: "Token inválido o no contiene un ID válido" });
      }

      // Busca si el token corresponde a un usuario
      const user = await User.findById(decoded.id).select("-password");

      // Si se encuentra un usuario, asigna el usuario al objeto req y termina la función
      if (user) {
        req.user = user;
        req.type = "user";  // Marca que es un usuario
        console.log("Usuario autenticado:", user);
        return next(); // Termina la función aquí sin errores
      }

      // Si no es un usuario, busca si corresponde a una compañía
      const company = await Company.findById(decoded.id).select("-password");

      // Si se encuentra una compañía, asigna la compañía al objeto req y termina la función
      if (company) {
        req.user = company;
        req.type = "company";  // Marca que es una compañía
        console.log("Compañía autenticada:", company);
        return next(); // Termina la función aquí sin errores
      }

      // Si ni usuario ni compañía son encontrados, respuesta con error
      return res.status(401).json({ message: "Token no válido para ningún usuario o compañía" });

    } catch (error) {
      // Si el token no es válido o ha expirado
      console.error("Error al verificar el token:", error.message);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }
};

module.exports = { protect };
