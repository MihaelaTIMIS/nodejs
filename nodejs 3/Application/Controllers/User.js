const userModel = require("../Models/User.js");

class User {

	static login(req,res){

		userModel.findOne({
			login: req.body.login
		}).then((user) => {
			userModel.findOne(req.body).then((user) => {
				req.session.user = user
				res.redirect("/")
			}).catch(() => {
				res.redirect("/login")
			})

		}).catch(() => {
			res.redirect("/register")
		})

	}

	static logout(req,res){
		req.session.destroy()
		res.redirect("/login")
	}

	static register(req,res){

		userModel.findOne({
			login: req.body.login
		}).catch(() => {
			let user = new userModel(req.body)
				user.save()
		})

		res.redirect("/login")
		
	}

}


module.exports = User