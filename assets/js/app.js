
const app = {
  addListenerToAction: () => {
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    document.querySelectorAll('.add-card-btn').forEach(btn => btn.addEventListener('click', app.showAddCardModal));
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', app.hideModals));
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
  },
  showAddListModal: () => {
    const addListModal = document.getElementById('addListModal');
    addListModal.classList.add('is-active');
  },
  showAddCardModal: (event) => {
    // get the data-list-id
    const list = event.target.closest('.panel');
    const listId = list.getAttribute('data-list-id');
    //!
    console.log('ma liste', list);
    console.log('ma liste id:', listId);
    
    const addCardModal = document.getElementById('addCardModal');

    // put the data-list-id in value of the hidden input
    const hiddenIdInput = addCardModal.querySelector('.hidden-input');
    //hiddenIdInput.value = listId;
    hiddenIdInput.setAttribute('value', listId);
    //!
    console.log('hidden input:', hiddenIdInput);

    addCardModal.classList.add('is-active');

    document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
  },
  hideModals: () => {
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => modal.classList.remove('is-active'));
  },
  handleAddListForm: (event) => {
    event.preventDefault();
    const listTitle = new FormData(event.target).get('name');
    app.makeListInDOM(listTitle);
    document.querySelectorAll('.add-card-btn').forEach(btn => btn.addEventListener('click', app.showAddCardModal));
    app.hideModals();
  },
  makeListInDOM: (listTitle) => {
    const template = document.getElementById('listTemplate');
    
    const cloneTemplate = document.importNode(template.content, true);
    const panel = cloneTemplate.firstElementChild;
    panel.setAttribute('data-list-id', listTitle.replace(/\s/g, ''));//remove space

    const listTitleH = cloneTemplate.getElementById('newListTitle');
    listTitleH.setAttribute('id', listTitle.replace(/\s/g, ''));
    listTitleH.textContent = listTitle;
    
    const kanbanBoard = document.getElementById('kabanBoard');
    kanbanBoard.appendChild(cloneTemplate);
  },
  handleAddCardForm: (event) => {
    event.preventDefault();
    const cardTitle = new FormData(event.target).get('name');
    const listId = new FormData(event.target).get('list_id')
    app.makeCardInDOM(cardTitle, listId);
    app.hideModals();
  },
  makeCardInDOM: (cardTitle, listId) => {
    const template = document.getElementById('cardTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    // set the title
    const cardTitleDiv = cloneTemplate.querySelector('.card-title');
    cardTitleDiv.textContent = cardTitle;
    // append in the list, in the card-container div
    const list = document.querySelector(`.panel[data-list-id="${listId}"]`);
    const cardContainer = list.querySelector('.card-container');
    cardContainer.appendChild(cloneTemplate);
  },
  // ----------- INIT ----------- //
  init: () => {
    app.addListenerToAction();
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );