(function(){
	let instance = null;

	class WS {

		constructor(){
			this.socket = io("http://localhost:1338");
			this.socket.on("task:read"   , this.taskRead);
			this.socket.on("task:read:id", this.taskReadByID);
			this.socket.on("task:create" , this.taskCreate);
			this.socket.on("task:update" , this.taskUpdate);
			this.socket.on("task:delete" , this.taskDelete);
		}

		taskCreate(response){
			let tmpTemplate = ejs.render(taskHTML,{
				task: response
			})

			let $lg 		 = document.querySelector(".list-group");
			let $t  		 = document.createElement("div")
				$t.innerHTML = tmpTemplate
				$lg.prepend($t.querySelector('div'));
		}

		taskRead(response){
			console.log("read",response);
		}

		taskReadByID(response){
			console.log("readbyid",response);
		}

		taskUpdate(response){
			console.log("update",response);
			let $parent = document
							.querySelector('[data-id="'+response.object._id+'"]')
							.closest(".list-group-item")

				$parent.classList.toggle("check");
		}

		taskDelete(response){
			console.log("delete",response);
			let $parent = document
							.querySelector('[data-id="'+response.object._id+'"]')
							.closest(".list-group-item")
				$parent.remove()
		}

		static connect(){
			if(!instance){
				instance = new this();
			}

			return instance;
		}
	}

	let $lg = document.querySelector(".list-group");
	let ws  = WS.connect();
	if ($lg){
		$lg.addEventListener("click", e => {

			let $a    = e.target.closest("a") 
			let $form = e.target.closest("form")

			if ($a || $form ){
				e.preventDefault()
			}	

			if ($a){
				let id           = $a.dataset.id;
				let callbackName = $a.dataset.callback
				let modelName    = $a.dataset.model

				if (id && callbackName) {
					switch (callbackName){
						case "check":
							ws.socket.emit("task:update",{ _id: id });
							break;
						case "remove":
							ws.socket.emit("task:delete",{ _id: id });
							break;
						default:
							console.log(id,callbackName,modelName);
					}

				}
			}

			if ($form && e.target.nodeName === "BUTTON"){

				let formData = new FormData($form)
				let data     = {}

				for (let [key,value] of formData.entries()){
					data[key] = value
				}

				ws.socket.emit("task:create",data);
			}

		})
	}


})()

