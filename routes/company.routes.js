const express = require("express");
const router = express.Router();
const { getAllCompaniesWithAverage, getCompaniesByIndustryRanking } = require("../controllers/company.controller");


router.get("/ranking", getAllCompaniesWithAverage);

router.get("/rubro/ranking/:industry", getCompaniesByIndustryRanking);




module.exports = router;
