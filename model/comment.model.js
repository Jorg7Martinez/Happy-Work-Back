const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  name: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  comment: { type: String, required: true },
  ratings: {
    workLifeBalance: { type: Number, required: true },
    salary: { type: Number, required: true },
    growthOpportunities: { type: Number, required: true },
    workEnvironment: { type: Number, required: true },
    professionalDevelopment: { type: Number, required: true }
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
