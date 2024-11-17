const express = require("express");
const router = express.Router();
const { addComment, getComments } = require("../controllers/comment.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, addComment);
router.get("/", getComments);

module.exports = router;
