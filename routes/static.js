var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');

router.use(bodyParser.urlencoded( { extended: true }));
router.use(bodyParser.json());
router.use(express.static(path.join(__dirname,'../', 'public')));
router.use(express.static(path.join(__dirname,'../', 'node_modules')))
router.use(express.static(path.join(__dirname,'../', 'bower_components')))
router.use(express.static(path.join(__dirname,'../', 'public/views')));

module.exports = router;