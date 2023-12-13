const nedb    = require('nedb')
//const cluster = require('cluster')
const userDB  = new nedb({
	filename: __dirname + "/../../.db/user"
});

//if (!cluster.isPrimary){
	// c'est un petit fix pour syncroniser les BDD
	setInterval(() => {
		userDB.loadDatabase()
	},1000);
//} 

class User {

	constructor(data = null){

		this._id      = null;
		this.fistName = null;
		this.lastName = null;
		this.login    = null;
		this.password = null;

		if (data && typeof data === "object"){
			for (let prop in this){
				this[prop] = data[prop]
			}
		}

	}

	save(){
		return new Promise((resolve,reject) => {
			if (!this._id){
				userDB.insert(this,(err, doc) => {
					this._id = doc._id
					resolve(this)
				})
			} else {
				userDB.update({ _id: this._id },this)
				resolve(this)
			}
		})
	}

	remove(){
		userDB.remove({ _id: this._id })
	}

	static find(query = {}){
		return new Promise((resolve,reject) => {
			userDB.find(query,(err,docs) => {
				if (err){
					reject(err)
				}

				docs.map((doc) => { return new this(doc); })

				docs.length > 0 
					? resolve(docs)
					: reject(docs)
			})
		})
	}

	static findOne(query = {}){
		return new Promise((resolve,reject) => {
			userDB.findOne(query,(err,doc) => {
				if (err){
					reject(err)
				}

				let user = new this(doc);
				user._id !== null 
					? resolve(user)
					: reject(user)
			})
		})
	}


}


module.exports = User