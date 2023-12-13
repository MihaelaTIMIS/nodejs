class API {

	static read(modelName){
		let model = require("../Models/"+modelName+".js");

		return (req,res) => {
			let query = {}

			if(req.params._id){
				query._id = req.params._id
			}

			model.find(query).then((tasks) => {
				res.status(200)
				res.json(tasks)
			}).catch(() => {
				res.status(400)
				res.json(false)
			})
		}
	}

	static create(modelName){
		let model = require("../Models/"+modelName+".js");

		return (req,res) => {
			let instance = new model(req.body)
			    instance.save().then((id) => {
			    	res.status(201)
					res.json(id)
			    }).catch(() => { res.end() })
		}
	}

	static update(modelName){
		let model = require("../Models/"+modelName+".js");


		return (req,res) => {

			model.findOne({_id: req.body._id}).then((instance) => {
				console.log("before",instance);
				for (let prop in instance){
					instance[prop] = req.body[prop] !== undefined
										? req.body[prop] 
										: instance[prop];
				}
				instance.check = instance.check ? false : true;
				instance.save()
				console.log("after",instance);

				res.status(201)
				res.json(true)
			}).catch((err) => {
				res.status(400)
				res.json(false)
			})

		}
	}

	static delete(modelName){
		let model = require("../Models/"+modelName+".js");

		return (req,res) => {
			model.findOne({_id: req.params._id}).then((instance) => {
				instance.remove()
				res.status(201)
				res.json(true)
			}).catch((err) => {
				res.status(400)
				res.json(false)
			})
			
		}
	}

}


module.exports = API