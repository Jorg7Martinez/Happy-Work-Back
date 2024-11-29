const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Company = require("../model/company.model");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token recibido:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded);

      if (!decoded.id) {
        return res.status(401).json({ message: "Token inválido o no contiene un ID válido" });
      }

      const user = await User.findById(decoded.id).select("-password");

      if (user) {
        req.user = user;
        req.type = "user";
        console.log("Usuario autenticado:", user);
        return next();
      }

      // Si no es un usuario, busca si corresponde a una compañía
      const company = await Company.findById(decoded.id).select("-password");

      // Si se encuentra una compañía, asigna la compañía al objeto req y termina la función
      if (company) {
        req.user = company;
        req.type = "company";
        console.log("Compañía autenticada:", company);
        return next();
      }

      return res.status(401).json({ message: "Token no válido para ningún usuario o compañía" });

    } catch (error) {
      // Si el token no es válido o ha expirado
      console.error("Error al verificar el token:", error.message);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }
};

module.exports = { protect };
