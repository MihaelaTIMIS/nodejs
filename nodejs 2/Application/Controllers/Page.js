const taskModel = require("../Models/Task.js");
const userModel = require("../Models/User.js");

class Page {

	static home(req,res){
		if (!req.session.user){
			res.redirect("/login")
			return
		}

		taskModel.find().then((tasks) => {
			res.render("home",{
				tasks: tasks,
				user: req.session.user
			})
		}).catch(() => {
			res.render("home",{
				tasks:[],
				user: req.session.user
			})
		})
	}

	static login(req,res){
		if (req.session.user){
			res.redirect("/")
			return
		}

		res.render("login",{
			user: req.session.user
		})
	}

	static register(req,res){
		if (req.session.user){
			res.redirect("/")
			return
		}

		res.render("register",{
			user: req.session.user
		})
	}

}


module.exports = Page