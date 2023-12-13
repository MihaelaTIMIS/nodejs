const http    	  = require("http")
//const https   	  = require("https")
const cluster 	  = require("cluster")
const os      	  = require("os")
const express 	  = require("express")
const fs      	  = require("fs")
const socketio	  = require("socket.io");


if (cluster.isPrimary){

	const httpServer   = http.createServer();
	const controllerWS = require("./Controllers/WS.js")
	const io           = new socketio.Server(httpServer,{
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		}
	});

	io.on('connection',(socket) => {
		console.log('connect');
		socket.on("disconnect",() => {
			console.log('disconnect');
		});

		socket.on("task:read"   , controllerWS.read("Task",io.sockets));
		socket.on("task:read:id", controllerWS.read("Task",io.sockets));
		socket.on("task:create" , controllerWS.create("Task",io.sockets));
		socket.on("task:update" , controllerWS.update("Task",io.sockets));
		socket.on("task:delete" , controllerWS.delete("Task",io.sockets));
	});

	httpServer.listen(1338);

	console.log("primary",process.pid)
	for (let i = 0; i < os.cpus().length; i++){
		cluster.fork()
	}

	cluster.on("exit",(worker) => {
		console.log("worker", worker.process.pid,"is killed")
		cluster.fork()
	})

} else {
	console.log("worker", process.pid)
	const app 			 = express();
	const bodyParser     = require("body-parser");
	const redis 		 = require('redis')
	const session        = require("express-session");
	const httpServer     = http.createServer(app);

	let store 		     = require('connect-redis')(session)

	const controllerPage = require("./Controllers/Page.js")
	const controllerTodo = require("./Controllers/Todo.js")
	const controllerUser = require("./Controllers/User.js")
	const controllerAPI  = require("./Controllers/API.js")

	app.set("view engine","ejs"); 						// alternative: mustache
	app.set("views", __dirname + "/Views/");

	app.use(express.static("Public"))					// 1
	app.use(bodyParser.json());							// API
	app.use(bodyParser.urlencoded({extended : true}));	// FORM
	app.use(session({
    	store: new store({ client: redis.createClient() }),
		secret: "MYSECRET",	
		resave: false,
		saveUninitialized: false,
		expires: Date.now() + (1 * 60 * 60 * 1000),
		//cookie: { secure: true }
	}))

	app.get("/"			, controllerPage.home);			// 2
	app.get("/login"	, controllerPage.login);		// 3
	app.get("/register" , controllerPage.register);		// 4

	// render
	app.post("/todo"		   , controllerTodo.create);
	app.get("/todo/:_id/check" , controllerTodo.update);
	app.get("/todo/:_id/delete", controllerTodo.delete);

	app.post("/user/login"	   , controllerUser.login);
	app.post("/user/register"  , controllerUser.register);
	app.get("/logout"	       , controllerUser.logout);

	// webservice
	// api.aaaa.com/
	app.get("/api/task"			, controllerAPI.read("Task"));
	app.get("/api/task/:_id"	, controllerAPI.read("Task"));
	app.post("/api/task"		, controllerAPI.create("Task"));
	app.put("/api/task"			, controllerAPI.update("Task"));
	app.delete("/api/task/:_id"	, controllerAPI.delete("Task"));

	httpServer.listen(1337);

	//http.createServer(app).listen(80)
	//https.createServer(credential,app).listen(443)
}



// single 1 coeur
// 