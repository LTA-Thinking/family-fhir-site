var express = require('express');
var router = express.Router();

/* GET upload page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Upload Data', fhirServer: process.env.FHIR_SERVER, fhirConverter: process.env.FHIR_CONVERTER });
});

module.exports = router;
