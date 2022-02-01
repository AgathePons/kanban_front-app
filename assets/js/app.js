
const app = {
  addListenerToAction: function() {
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    document.querySelectorAll('.add-card-btn').forEach(btn => btn.addEventListener('click', app.showAddCardModal));
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', app.hideModals));
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
    document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
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
  handleAddListForm: function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    app.makeListInDOM(formData);
    app.hideModals();
  },
  makeListInDOM: function(formData) {
    // get and import template
    const template = document.getElementById('listTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    // ou const cloneTemplate = template.content.cloneNode(true);
    // modify content
    const panel = cloneTemplate.firstElementChild;
    panel.setAttribute('data-list-id', formData.get('name').replace(/\s/g, ''));
    const listTitleH = cloneTemplate.getElementById('newListTitle');
    listTitleH.setAttribute('id', formData.get('name').replace(/\s/g, ''));
    listTitleH.textContent = formData.get('name');
    // set new event listener on new list
    cloneTemplate.querySelector('.add-card-btn').addEventListener('click', app.showAddCardModal);
    // append in DOM
    const kanbanBoard = document.getElementById('kabanBoard');
    kanbanBoard.appendChild(cloneTemplate);
  },
  handleAddCardForm: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    app.makeCardInDOM(formData);
    app.hideModals();
  },
  makeCardInDOM: (formData, cardTitle, listId) => {
    const template = document.getElementById('cardTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    // set the title
    const cardTitleDiv = cloneTemplate.querySelector('.card-title');
    cardTitleDiv.textContent = formData.get('name');
    // append in the list, in the card-container div
    const list = document.querySelector(`.panel[data-list-id="${formData.get('list_id')}"]`);
    const cardContainer = list.querySelector('.card-container');
    cardContainer.appendChild(cloneTemplate);
  },
  // ----------- INIT ----------- //
  init: () => {
    app.addListenerToAction();
  }
};

document.addEventListener('DOMContentLoaded', app.init );