const taskModel = require("../Models/Task.js");

class Page {

	static home(req,res){

		taskModel.find().then((tasks) => {
			res.render("home",{
				tasks: tasks
			})
		}).catch(() => {
			res.render("error")
		})

	}

	static login(req,res){
		res.render("login")
	}

	static register(req,res){
		res.render("register")
	}

}


module.exports = Page