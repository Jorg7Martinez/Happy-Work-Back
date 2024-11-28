const express = require("express");
const router = express.Router();
const { registerUser, registerCompany, login } = require("../controllers/auth.controller");

router.post("/register/user", registerUser);
router.post("/register/company", registerCompany);
router.post("/login", login);

module.exports = router;

