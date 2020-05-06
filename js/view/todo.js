export default function Todo(page, data) {
    page.innerHTML = '';
    const constructor = document.createElement('div');
    constructor.innerHTML = `
    <div class="card">
     LOL
    </div>
  `;


        const card = constructor
            .querySelector('.card')
            .cloneNode(true);

        page.appendChild(card);
        return card;
};
