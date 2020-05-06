import {fetchTodos, fetchTodo} from "../api/todo.js";
import {setTodos, getTodos, setTodo} from "../idb.js";

export default function Page(page, id) {
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
      <div class="text-gray-900 font-bold text-xl mb-2 name">NAME</div>
      <p class="text-gray-700 text-base content">Content</p>
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

    const card = constructor
        .querySelector('.card')
        .cloneNode(true);

    if(!document.offline){
        fetchTodo(id).then(
            result => {
                        card.querySelector('.name').innerHTML = result.name;
                        card.querySelector('.content').innerHTML = result.content;
                })
    }else{
        getTodos().then(result=>{
            result.map(data=>{
                if(data.id === id){
                    card.querySelector('.name').innerHTML = data.name;
                    card.querySelector('.content').innerHTML = data.content;
                }
            })
        })
    }
    page.appendChild(card);
    return card;
};
