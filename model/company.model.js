const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nombre de la empresa
    industry: { type: String, required: true }, // Rubro
    address: { type: String, required: true }, // Dirección
    employeesCount: { type: Number, required: true }, // Cantidad de empleados
    email: { type: String, required: true, unique: true }, // Correo
    password: { type: String, required: true }, // Contraseña
  },
  { timestamps: true }
);

// Encripta la contraseña antes de guardar
companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Company", companySchema);
