var taskHTML = `<div class="list-group-item list-group-item-action flex-column align-items-start <% if(task.check){ %> check <% } %>">
    <div class="d-flex w-100 justify-content-between">
        <a href="/todo/<%= task._id %>/check" data-callback="check" data-model="task" data-id="<%= task._id %>">
            <h5 class="mb-1 title"><%= task.title %></h5>
        </a>
        <div>
            <a href="/todo/<%= task._id %>/delete" data-callback="remove" data-model="task" data-id="<%= task._id %>">
                <span class="badge badge-dark remove">X</span>
            </a>
        </div>
    </div>
    <p class="mb-1 col-11 pl-0 content"><%= task.content %></p>
    <div class="d-flex w-100 justify-content-between">
        <div>
            <span class="badge badge-info">Florent</span>
            <span class="badge badge-light">+</span>
        </div>
    </div>
</div>`


class API {
	static check(modelName, id){

		fetch("/api/"+modelName+"/"+id).then(responseRaw => responseRaw.json()).then((collection) => {

			let object = collection[0];
			fetch("/api/"+modelName, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "PUT",
				body: JSON.stringify({
					_id: id,
					check: object.check ? false : true
				})
			}).then(() => {
				let $parent = document
								.querySelector('[data-id="'+id+'"]')
								.closest(".list-group-item")

				$parent.classList.toggle("check");
			})

		})
		
	}

	static remove(modelName, id){
		fetch("/api/"+modelName+"/"+id,{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "DELETE",
		}).then(() => {
			let $parent = document
							.querySelector('[data-id="'+id+'"]')
							.closest(".list-group-item")
				$parent.remove()
		})
	}

	static addTask(data){

		fetch("/api/task",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify(data)
		}).then(responseRaw => responseRaw.json()).then((data) => {
			let tmpTemplate = ejs.render(taskHTML,{
				task: data
			})

			let $lg 		 = document.querySelector(".list-group");
			let $t  		 = document.createElement("div")
				$t.innerHTML = tmpTemplate
				$lg.prepend($t.querySelector('div'))	
		})

	}
}

let $lg = document.querySelector(".list-group");
if ($lg && false){
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
				API[callbackName](modelName,id)
			}
		}

		if ($form && e.target.nodeName === "BUTTON"){

			let formData = new FormData($form)
			let data     = {}

			for (let [key,value] of formData.entries()){
				data[key] = value
			}

			API.addTask(data);
		}

	})
}









