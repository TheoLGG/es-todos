import {fetchTodo, updateTodoApi, createTodo, deleteById} from "../api/todo.js";
import {getTodos, updateTodo} from "../idb.js";
import {deleteTodo} from "../idb";

export default function Modify(page, id) {
    page.innerHTML = '';
    const constructor = document.createElement('div');
    constructor.innerHTML = `
    <div class="card">
  <section class="text-gray-700 body-font border-t border-gray-200">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
   
   <div class="max-w-sm w-full lg:max-w-full lg:flex">
  </div>
  <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div class="mb-8">
      <p class="text-sm text-gray-600 flex items-center">
        <svg class="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
        </svg>
        Members only
      </p>
<div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Name
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline name" id="name" type="text" placeholder="Name">
    </div>
    
    
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Content
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content" id="content" type="text" placeholder="content">
    </div>
          
          <div class="flex items-center justify-between">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline update" type="button">
        Update
      </button>
      
       <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline delete" type="button">
        DELETE
      </button>
      
    </div>
    </div>
   
  </div>
</div>
    
    </div>
    </div>
    </section>
    
    <section class="text-gray-700 body-font border-t border-gray-200">
  <div class="container px-5 py-24 mx-auto">
  <ul>
    <li class="flex flex-col text-center todolist">
    </li>
    </ul>
    </div>
    </section>

    </div>
  `;


    let dataToSave = [];
    let dataToDelete = [];

    const card = constructor
        .querySelector('.card')
        .cloneNode(true);

    let del = card.querySelector('.delete');

    del.addEventListener('click', ()=>{
        if(document.offline){
            dataToDelete.push(id);
            getTodos().then(result => {
                result.map(data => {
                    if (data.id === id) {
                        deleteTodo(id,data.name)

                    }
                })
            })
            window.location.href = "/todo";

        }else {
            deleteById(id)
        }

    })
    let click = card.querySelector('.update');

    click.addEventListener('click', ()=>{
        if(document.offline){
            updateTodo({name: card.querySelector('.name').value, content:card.querySelector('.content').value, id: id }).then(r=>{
                dataToSave.push({name: card.querySelector('.name').value, content:card.querySelector('.content').value, id: id });
            })
        }else{

            updateTodoApi(
                {
                    name:card.querySelector('.name').value,
                    content: card.querySelector('.content').value,
                    id: id
                }
            ).then(r=>{console.log(r)})

        }
    })


    window.addEventListener('online', () => {
        if(dataToSave.length > 0){
            console.log(dataToSave)
            dataToSave.map(data => {
                updateTodoApi(data)
            })
            dataToSave = [];
        }

        if(dataToDelete.length > 0){
            dataToDelete.map(data => {
                deleteById(data)
            })
            dataToDelete = [];
        }
    });

    if (!document.offline) {
        fetchTodo(id).then(
            result => {
                card.querySelector('.name').value = result.name;
                card.querySelector('.content').value = result.content;
            })
    } else {
        getTodos().then(result => {
            result.map(data => {
                if (data.id === id) {
                    card.querySelector('.name').value = data.name;
                    card.querySelector('.content').value = data.content;
                }
            })
        })
    }
    page.appendChild(card);
    return card;
};
