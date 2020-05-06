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

  const data = await database.get('articles', 'articles') || [];

  const skeleton = app.querySelector('.skeleton');
  skeleton.setAttribute('hidden', '');

  page('/', async (ctx) => {
    const module = await import('./view/home.js');
    const Home = module.default;

    const docTitle = document.head.querySelector('title');
    document.title = `${docTitle.dataset.base} - Home`;
    Home(homeCtn, data);

    pages.forEach(page => page.removeAttribute('active'));
    homeCtn.setAttribute('active', true);
  });

  page('/read/:slug', async (ctx) => {
    const module = await import('./view/read.js');
    const Read = module.default;

    const readStyle = document.head.querySelectorAll('#read');
    if (readStyle.length === 0) {
      const style = document.createElement('link');
      style.id = 'read';
      style.rel = 'stylesheet';
      style.href = '/style/read.css';
      document.head.appendChild(style);
    }

    const slug = ctx.params.slug;
    const article = data.find(item => _slugify(item.content.title) === slug);

    const docTitle = document.head.querySelector('title');
    document.title = `${docTitle.dataset.base} - ${article.content.title}`;

    Read(readCtn, article);

    pages.forEach(page => page.removeAttribute('active'));
    readCtn.setAttribute('active', true);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const btn = readCtn.querySelector('.install');
    btn.addEventListener('click', e => {
      window.installPrompt.prompt();
      window.installPrompt.userChoice
        .then(choice => {
          if (choice.outcome === 'accepted') {
            console.log('User accepted installation');
          } else {
            console.log('User rejected installation');
          }
          window.installPrompt = null;
        });
    });
    setTimeout(() => {
      if (window.installPrompt) {
        btn.classList.remove('hidden');
      }
    }, 2 * 1000);
  });

  page();
})();

function _slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
