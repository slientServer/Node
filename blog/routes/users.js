var express= require('express');
var router= express.Router();

router.get('/:name', function(req, res){
	res.send('Seperated root request with name : '+ req.params.name);
})

module.exports= router;