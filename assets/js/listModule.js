const cardModule = require('./cardModule');
const utilsModule = require('./utilsModule');

const listModule = {
  makeListInDOM: function(list) {
    // get and import template
    const template = document.getElementById('listTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    //TODO ou const cloneTemplate = template.content.cloneNode(true);
    // modify content
    const panel = cloneTemplate.querySelector('.panel');
    panel.dataset.listId = list.id;
    panel.id = list.id;
    //TODO ou panel.setAttribute('data-list-id', list.id);
    cloneTemplate.querySelector('.list-title').textContent = list.name;
    // set the actual value in form
    panel.querySelector('.edit-list-form input[name="name"]').value = list.name;
    panel.querySelector('.edit-list-form input[name="list-id"]').value = list.id;
    // set Sortable instance
    const cardContainer = cloneTemplate.querySelector('.card-container');
    new Sortable(cardContainer, {
      group: 'list',
      draggable: '.box',
      onEnd: cardModule.onCardDrop
    });
    // set new event listener on new list
    cloneTemplate.querySelector('.add-card-btn').addEventListener('click', cardModule.showAddCardModal);
    cloneTemplate.querySelector('.list-title').addEventListener('dblclick', listModule.showEditList);
    cloneTemplate.querySelector('.edit-list-form').addEventListener('submit', listModule.handleEditListForm);
    cloneTemplate.querySelector('.delete-list-btn').addEventListener('click', listModule.deleteList);
    // append in DOM
    const kanbanBoard = document.getElementById('kabanBoard');
    kanbanBoard.appendChild(cloneTemplate);
  },
  showAddListModal: function() {
    document.getElementById('addListModal').classList.add('is-active');
  },
  handleAddListForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // prevent empty title list
    if(!formData.get('name')) return console.warn('Le nom de la liste ne doit pas être vide');
    // fetch
    const response = await fetch(`${utilsModule.base_url}lists`, {
      method: 'POST',
      body: formData
    });
    if(response.status === 201) {
      const list = await response.json();
      listModule.makeListInDOM(list);
    } else {
      console.log('post /lists something went wrond')
    }
    utilsModule.hideModals();
  },
  showEditList: function(event) {
    event.target.classList.add('is-hidden');
    event.target.parentNode.querySelector('.edit-list-form').classList.remove('is-hidden');
  },
  hideEditList: function(listId) {
    const list = document.querySelector(`.panel[data-list-id="${listId}"]`);
    list.querySelector('.list-title').classList.remove('is-hidden');
    list.querySelector('.edit-list-form').classList.add('is-hidden');
  },
  handleEditListForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get('list-id');
    const listTitle = event.target.closest('.panel').querySelector('.list-title');
    try {
      const response = await fetch(`${utilsModule.base_url}lists/${listId}`, {
        method: 'PATCH',
        body: formData
      });
      if(response.status === 200) {
        listTitle.textContent = formData.get('name');
        listModule.hideEditList(listId);
      } else {
        console.log('post /cards something went wrong')
      }
    } catch(error) {
      console.error('handle edit list form:', error);
    }
  },
  deleteList: async function(event) {
    event.preventDefault();
    const list = event.target.closest('.panel');
    const listId = list.dataset.listId;
    // check if list is empty
    const cardInDOM = list.querySelector('.box');
    if(cardInDOM) return alert('Impossible de supprimer cette liste car elle n\'est pas !');
    // ask confirm
    if(!confirm('Voulez-vous vraiment supprimer cette liste ?')) return;
    try {
      const response = await fetch(`${utilsModule.base_url}lists/${listId}`, {
        method: 'DELETE'
      });
      if(response.status === 204) {
        list.remove();
      } else {
        console.log('delete /lists something went wrond');
      }
    } catch(error) {
      console.error('delete list btn:', error);
    }
  },
};

module.exports = listModule;