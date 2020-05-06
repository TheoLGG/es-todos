import { openDB } from 'idb';

export async function initDB() {
    const config = window.config;
    const db = await openDB('awesome-todo', config.version || 1, {
        upgrade(db) {
            // Create a store of objects
            const store = db.createObjectStore('todos', {
                // The 'id' property of the object will be the key.
                keyPath: 'id',
            });
            // Create an index on the 'date' property of the objects.
            store.createIndex('synced', 'synced');
            store.createIndex('updated', 'updated');
            store.createIndex('done', 'done');
            store.createIndex('date', 'date');
        },
    });
    return db;
}

export async function setTodos(data) {
    const db = await initDB();
    const tx = db.transaction('todos', 'readwrite');
    data.forEach(item => {
        tx.store.put(item);
    });
    await tx.done;
    return await db.getAll('todos');
}

export async function setTodo(data) {
    const db = await initDB();
    const tx = db.transaction('todos', 'readwrite');
    return await tx.store.put(data);
}

export async function getTodos() {
    const db = await initDB();
    return await db.getAll('todos');
}
