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


