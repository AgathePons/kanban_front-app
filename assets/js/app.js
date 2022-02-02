
const app = {
  base_url: 'http://localhost:3000/',
  addListenerToAction: function() {
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    document.querySelectorAll('.add-card-btn').forEach(btn => btn.addEventListener('click', app.showAddCardModal));
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', app.hideModals));
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
    //document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
  },
  showAddListModal: function() {
    document.getElementById('addListModal').classList.add('is-active');
  },
  hideModals: function() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('is-active'));
  },
  showAddCardModal: (event) => {
    // get the data-list-id
    const listId = event.target.closest('.panel').getAttribute('data-list-id');
    // put the data-list-id in value of the hidden input
    const addCardModal = document.getElementById('addCardModal');
    const hiddenIdInput = addCardModal.querySelector('.hidden-input');
    //hiddenIdInput.value = listId;
    hiddenIdInput.setAttribute('value', listId);
    addCardModal.classList.add('is-active');
  },
  handleAddListForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // fetch
    const response = await fetch(`${app.base_url}lists`, {
      method: 'POST',
      body: formData
    });
    if(response.status === 201) {
      app.makeListInDOM(formData);
    } else {
      console.log('post /lists something went wrond')
    }
    app.hideModals();
  },
  makeListInDOM: function(list) {
    // get and import template
    const template = document.getElementById('listTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    //TODO ou const cloneTemplate = template.content.cloneNode(true);
    // modify content
    const panel = cloneTemplate.firstElementChild;
    panel.dataset.listId = list.id;
    //TODO ou panel.setAttribute('data-list-id', list.id);
    const listTitleH = cloneTemplate.getElementById('newListTitle');
    listTitleH.textContent = list.name;
    // set new event listener on new list
    cloneTemplate.querySelector('.add-card-btn').addEventListener('click', app.showAddCardModal);
    // append in DOM
    const kanbanBoard = document.getElementById('kabanBoard');
    kanbanBoard.appendChild(cloneTemplate);
  },
  handleAddCardForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch(`${app.base_url}cards`, {
      method: 'POST',
      body: formData
    });
    if(response.status === 201) {
      app.makeCardInDOM(formData);
    } else {
      console.log('post /cards something went wrond')
    }
    app.hideModals();
  },
  makeCardInDOM: function(card) {
    const template = document.getElementById('cardTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    // set the title
    const cardTitleDiv = cloneTemplate.querySelector('.card-title');
    cardTitleDiv.textContent = card.content;
    //set the id
    cloneTemplate.querySelector('.box').dataset.cardId = card.id;
    // append in the list, in the card-container div
    const list = document.querySelector(`.panel[data-list-id="${card.list_id}"]`);
    const cardContainer = list.querySelector('.card-container');
    cardContainer.appendChild(cloneTemplate);
  },
  // ----------- FETCH ----------- //
  getListsFromAPI: async function() {
    try {
      const response = await fetch(`${app.base_url}lists`, {
        method: 'GET'
      });
      if(response.status === 200) {
        const lists = await response.json();
        console.log(lists);
        // for each list
        for(const list of lists) {
          app.makeListInDOM(list);
          // for each card in a list
          for(const card of list.cards) {
            /* const formDataCard = new FormData();
            formDataCard.append('content', card.content);
            formDataCard.append('list_id', card.list_id); */
            app.makeCardInDOM(card);
          }
        }
      } else {
        console.log('get lists and cards: something went wrong');
      }
    } catch(error) {
      console.error('get all lists:', error);
    }
    
  },
  // ----------- INIT ----------- //
  init: function() {
    app.getListsFromAPI();
    app.addListenerToAction();
  }
};

document.addEventListener('DOMContentLoaded', app.init );