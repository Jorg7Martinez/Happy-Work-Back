const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true,index: true },
    industry: { type: String, required: true },
    address: { type: String, default: "" },
    employeesCount: { type: Number, default: 0 },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    ratings: {
      workLifeBalance: { type: Number, default: 0 },
      salary: { type: Number, default: 0 },
      growthOpportunities: { type: Number, default: 0 },
      workEnvironment: { type: Number, default: 0 },
      professionalDevelopment: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);







/*const mongoose = require("mongoose");
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

module.exports = mongoose.model("Company", companySchema);*/
