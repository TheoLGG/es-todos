let config = "http://localhost:3000";

export async function fetchTodos() {
    return fetch(`${config}/todos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(result => result.json())
        .catch(error => {
            console.error(error);
            return false;
        });
}

export async function createTodo(data) {
    return fetch(`${config}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .catch(error => {
            console.error(error);
            return false;
        });
}

export async function fetchTodo(id) {
    return fetch(`${config}/todos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((jsn) => {
            return jsn.find(el => parseInt(el.id,10) === parseInt(id,10))
        });
}