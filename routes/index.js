var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var rolesArray = require('../roles.js');

router.get('/',function(req,res,next){

	console.log("HELLO!(world)")
	res.status(200).render('index');

});

router.get('/test',function(req,res,next){
	console.log(rolesArray)
})
module.exports = router;