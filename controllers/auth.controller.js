const User = require("../model/user.model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const Company = require("../model/company.model");


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


// Registro de Empresas
exports.registerCompany = async (req, res) => {
  const { name, industry, address, employeesCount, email, password } = req.body;

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ message: "La empresa ya está registrada" });
    }

    // Crear empresa con contraseña hasheada
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = await Company.create({
      name,
      industry,
      address,
      employeesCount,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Error al registrar la empresa:", error);
    res.status(500).json({ message: "Error al registrar la empresa" });
  }
};

// Login (Usuarios y Empresas)
exports.login = async (req, res) => {
  const { email, password, type } = req.body;
  try {
    const Model = type === "company" ? Company : User;

    const account = await Model.findOne({ email });
    if (!account) {
      return res.status(400).json({ message: "Tus datos son incorrectos. Vuelva a comprobarla." });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Tu contraseña es incorrecta. Vuelva a comprobarla." });
    }

    res.status(200).json({
      _id: account._id,
      name: account.name,
      email: account.email,
      type,
      token: generateToken(account._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};


