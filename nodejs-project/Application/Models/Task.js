const nedb    = require('nedb')
const cluster = require('cluster')
const taskDB  = new nedb({
	filename: __dirname + "/../../.db/task"
});

if (!cluster.isPrimary){
	// c'est un petit fix pour syncroniser les BDD
	setInterval(() => {
		taskDB.loadDatabase()
	},1000)
} 

class Task {

	constructor(data = null){

		this._id     = null;
		this.title   = null;
		this.content = null;
		this.check   = false;

		if (data && typeof data === "object"){
			for (let prop in this){
				this[prop] = data[prop]
			}
		}

	}

	save(){

		if (!this._id){
			taskDB.insert(this,(err, doc) => {
				this._id = doc._id
			})
		} else {
			taskDB.update({ _id: this._id },this)
		}

	}

	remove(){
		taskDB.remove({ _id: this._id })
	}

	static find(query = {}){
		return new Promise((resolve,reject) => {
			taskDB.find(query,(err,docs) => {
				if (err){
					reject(err)
				}

				resolve(docs)
			})
		})
	}

	static findOne(query = {}){
		return new Promise((resolve,reject) => {
			taskDB.findOne(query,(err,doc) => {
				if (err){
					reject(err)
				}

				resolve(new this(doc))
			})
		})
	}


}





module.exports = Task