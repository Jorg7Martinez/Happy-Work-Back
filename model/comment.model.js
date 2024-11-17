const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: { type: String, default: "Anonimo" },
  position: { type: String, required: true },
  company: { type: String, required: true },
  comment: { type: String, required: true },
  ratings: {
    workLifeBalance: { type: Number, required: true },
    salary: { type: Number, required: true },
    growthOpportunities: { type: Number, required: true },
    workEnvironment: { type: Number, required: true },
    professionalDevelopment: { type: Number, required: true },
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
