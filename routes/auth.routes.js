const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;




/*const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user.controller");

router.post("", userControllers.createUser);
router.get("/:id", userControllers.findUserById);

module.exports = router;*/