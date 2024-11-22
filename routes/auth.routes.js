const express = require("express");
const router = express.Router();
const { registerUser, registerCompany, login } = require("../controllers/auth.controller");

router.post("/register/user", registerUser);
router.post("/register/company", registerCompany);
router.post("/login", login);

module.exports = router;




/*const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user.controller");

router.post("", userControllers.createUser);
router.get("/:id", userControllers.findUserById);

module.exports = router;*/