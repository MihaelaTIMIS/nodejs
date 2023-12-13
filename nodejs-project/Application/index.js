const http    = require("http")
//const https   = require("https")
const cluster = require("cluster")
const os      = require("os")
const express = require("express")
const fs      = require("fs")




if (cluster.isPrimary){

	console.log("primary",process.pid)
	for (let i = 0; i < os.cpus().length; i++){
		cluster.fork()
	}

	cluster.on("exit",(worker) => {
		console.log("worker", worker.process.pid,"is killed")
		cluster.fork()
	})

} else {
	console.log("worker",process.pid)
	const app 			 = express()
	const bodyParser     = require("body-parser");
	const controllerPage = require("./Controllers/Page.js")
	const controllerTodo = require("./Controllers/Todo.js")

	app.set("view engine","ejs"); 						// alternative: mustache
	app.set("views", __dirname + "/Views/");

	app.use(express.static("Public"))					// 1
	app.use(bodyParser.json());							// API
	app.use(bodyParser.urlencoded({extended : true}));	// FORM

	app.get("/"			, controllerPage.home);			// 2
	app.get("/login"	, controllerPage.login);		// 3
	app.get("/register" , controllerPage.register);		// 4

	// render
	app.post("/todo"		   , controllerTodo.create);
	app.get("/todo/:_id/check" , controllerTodo.update);
	app.get("/todo/:_id/delete", controllerTodo.delete);

	// webservice
	//app.get("/todo"			, controllerTodo.read);
	//app.get("/todo/:_id"	    , controllerTodo.read);
	//app.put("/todo"			, controllerTodo.update);
	//app.delete("/todo/:id"	, controllerTodo.delete);





	app.listen(1337)


	//http.createServer(app).listen(80)
	//https.createServer(credential,app).listen(443)
}



// single 1 coeur
// 