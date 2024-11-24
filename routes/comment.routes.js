const express = require("express");
const router = express.Router();
const { addComment, getComments,getCommentByCompanyOrId,getAverageRatingsByCompanyId,getOverallAverageRatingByCompanyId,getCompanyData } = require("../controllers/comment.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, addComment);
router.get("/", getComments);
router.get("/search", getCommentByCompanyOrId);
router.get("/average", getAverageRatingsByCompanyId);
router.get("/overall-average", getOverallAverageRatingByCompanyId);
router.get("/companies/data", getCompanyData);




module.exports = router;
