class WS {

	static read(modelName,socket){
		let model = require("../Models/"+modelName+".js");

		return (object = {}) => {
			
			model.find(object).then((tasks) => {
				object._id ? socket.emit("task:read:id",tasks)
				           : socket.emit("task:read",tasks);

			}).catch(() => {
				object._id ? socket.emit("task:read:id",null)
				           : socket.emit("task:read",[]);
			});
		}
	}

	static create(modelName,socket){
		let model = require("../Models/"+modelName+".js");

		return (object = null) => {
			if (!object || object._id){
				socket.emit("task:create",false);
				return;
			}

			let instance = new model(object);
			instance.save().then((id) => {
		    	socket.emit("task:create",id);
		    }).catch(() => {
		    	socket.emit("task:create",false);
		    });
		}
	}

	static update(modelName,socket){
		let model = require("../Models/"+modelName+".js");

		return (object = null) => {
			if (!object || !object._id){
				socket.emit("task:create",false);
				return;
			}

			model.findOne({_id: object._id}).then((instance) => {
				for (let prop in instance){
					instance[prop] = object[prop] !== undefined
										? object[prop] 
										: instance[prop];
				}
				instance.check = instance.check ? false : true;
				//console.log(instance.check);
				instance.save()
				socket.emit("task:update",{
					object: instance,
					success: true,
				});
			}).catch((err) => {
				console.log(err);
				socket.emit("task:update",{
					object: instance,
					success: false,
				});
			});
		}
	}

	static delete(modelName,socket){
		let model = require("../Models/"+modelName+".js");

		return (object = null)=>{
			if (!object || !object._id){
				socket.emit("task:delete",{
					object: instance,
					success: false,
				});
				return;
			}

			model.findOne({_id: object._id}).then((instance) => {
				instance.remove()
				socket.emit("task:delete",{
					object: instance,
					success: true,
				});
			}).catch((err) => {
				socket.emit("task:delete",{
					object: instance,
					success: false,
				});
			});
		}
	}
}

module.exports = WS;



