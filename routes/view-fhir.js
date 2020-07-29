var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('view-fhir', { title: 'FHIR Search', fhirServer: process.env.FHIR_SERVER, fhirConverter: process.env.FHIR_CONVERTER });
});

module.exports = router;