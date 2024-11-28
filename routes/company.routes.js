const express = require("express");
const router = express.Router();
const { getAllCompaniesWithAverage } = require("../controllers/company.controller");


router.get("/ranking", getAllCompaniesWithAverage);



module.exports = router;
