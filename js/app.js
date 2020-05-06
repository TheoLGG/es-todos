'use strict';
import page from '/node_modules/page/page.mjs';
import { openDB } from '/node_modules/idb/build/esm/index.js';
import checkConnectivity from './network.js';

(async () => {
  document.offline = false;
  window.addEventListener('beforeinstallprompt', e => {
    console.log('Application is installable');
    e.preventDefault();
    window.installPrompt = e;
  });

  const app = document.querySelector('#app main');

  checkConnectivity({
    interval: 2000
  });
  document.addEventListener('connection-changed', e => {
    let root = document.documentElement;
    document.offline = !e.detail;
    if (e.detail) {
      root.style.setProperty('--app-blue', '#007eef');
      // console.log('Back online');
    } else {
      root.style.setProperty('--app-blue', '#7D7D7D');
      // console.log('Connection too slow');
    }
  });
  
  const homeCtn = app.querySelector('[page=home]');
  const readCtn = app.querySelector('[page=read]');

  const pages = [
    homeCtn,
    readCtn
  ];

  
  const database = await openDB('news-feed', 1, {
    upgrade(db) {
      db.createObjectStore('articles');
    }
  });
  
  if (!document.offline) {
    const result = await fetch('/data/spacex.json');
    const clonedResult = result.clone();
    const json = await result.json();
    database.put('articles', json, 'articles');
    // caches.open('runtime-caching').then(cache => {
    //   cache.put('/data/spacex.json', clonedResult);
    // });
  }

  //TODO CHANGE ARTICLES BY CONNECTIVITY

  const data = await database.get('articles', 'articles') || [];

  const skeleton = app.querySelector('.skeleton');
  skeleton.setAttribute('hidden', '');

  page('/', async (ctx) => {
    const module = await import('./view/home.js');
    const Home = module.default;

    const docTitle = document.head.querySelector('title');
    document.title = `Home - Todo`;
    Home(homeCtn, data);

    pages.forEach(page => page.removeAttribute('active'));
    homeCtn.setAttribute('active', true);
  });


  page('/todo', async (ctx) => {
    const module = await import('./view/todo.js');
    const Todo = module.default;

    const docTitle = document.head.querySelector('title');
    document.title = `Todo list`;
    Todo(homeCtn, data);

    pages.forEach(page => page.removeAttribute('active'));
    homeCtn.setAttribute('active', true);
  });

  page();
})();
