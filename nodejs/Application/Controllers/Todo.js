const taskModel = require("../Models/Task.js");

class Todo {

	static create(req,res){

		let task = new taskModel(req.body)
		    task.save()

		res.redirect("/")
	}

	static update(req,res){
		taskModel.findOne({_id: req.params._id}).then((task) => {
			task.check = task.check 
							? false
							: true
			task.save()
		})

		res.redirect("/")
	}

	static delete(req,res){
		taskModel.findOne({_id: req.params._id}).then((task) => {
			task.remove()
		})

		res.redirect("/")
	}
	
}


module.exports = Todo