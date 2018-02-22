function register (appConfig, renderer, helper){
	var express = require('express');
	var router = express.Router();

	router.get('/', function(req, res, next) {
		var section = '/REGISTER';
	  if(helper.isLogin(req)){
		res.status(403);
		section = '/ERROR/403';
	  }
		var content = renderer.renderPage(section, req)
		.then(function(content){
			res.send(content);
		});
	});

	router.post('/', function(req, res, next) {
		if(!helper.isLogin(req)){
			try{
				var user = req.body["txtRegisUser"];
				var password = req.body["txtRegisPass"];
				
				var keysession = appConfig.App.Cookie.Key_Session;
				var session = "testing";
				var encsession = helper.encrypt(session);
				let options = {
					//maxAge: 1000 * 60 * 15, // would expire after 15 minutes
					httpOnly: true, // The cookie only accessible by the web server
					signed: false // Indicates if the cookie should be signed
				}
				// Set cookie
				res.cookie(keysession, encsession, options) // options is optional
				
				var loginsession = '{"user":"' + user + '", "id":"'+ session + '"}';
				helper.setRedis(session, loginsession);
				res.send('00|Success');
			}
			catch(ex){
				console.log(ex);
				res.send('99|' + ex);
			}
		}
		res.send('403|Forbidden');
	});
	
	return router;
}
module.exports = register;
