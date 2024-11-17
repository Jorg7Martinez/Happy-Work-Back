const User = require("../model/user.model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Registro
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Creamos el usuario
    const user = await User.create({ name, email, password });

    // Respondemos con los datos del usuario y el token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password:user.password
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};


//login

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    console.log("Contraseña ingresada:", password);  // Contraseña en texto plano
    console.log("Contraseña en la base de datos (hash):", user.password);  // Contraseña encriptada

    // Comparar la contraseña ingresada con el hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Las contraseñas no coinciden.");
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    console.log("Las contraseñas coinciden, generando token...");

    // Generar el token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
