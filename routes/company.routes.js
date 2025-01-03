const express = require("express");
const router = express.Router();
const { getAllCompaniesWithAverage, getCompaniesByIndustryRanking, getAllIndustries } = require("../controllers/company.controller");


router.get("/ranking", getAllCompaniesWithAverage);

router.get("/rubro/ranking/:industry", getCompaniesByIndustryRanking);

router.get("/industries", getAllIndustries);


module.exports = router;
