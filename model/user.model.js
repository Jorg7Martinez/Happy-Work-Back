const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Encripta la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);




/**const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Name is Required"],

        },
        email:{
            type: String,
            required: [true, "Email is Required"],

        },
        password:{
            type: String,
            required: [true, "Password is Required"],
        }
    },
    {timestamps: true, versionKey: false}
)

const User = mongoose.model("User", UserSchema);

module.exports = User;**/