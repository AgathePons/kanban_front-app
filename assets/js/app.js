
const app = {
  base_url: 'http://localhost:3000/',
  addListenerToAction: function() {
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', app.hideModals));
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
    document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
  },
  // MODALS
  showAddListModal: function() {
    document.getElementById('addListModal').classList.add('is-active');
  },
  showAddCardModal: function(event) {
    // get the data-list-id
    const listId = event.target.closest('.panel').getAttribute('data-list-id');
    // put the data-list-id in value of the hidden input
    const addCardModal = document.getElementById('addCardModal');
    const hiddenIdInput = addCardModal.querySelector('.hidden-input');
    //hiddenIdInput.value = listId;
    hiddenIdInput.setAttribute('value', listId);
    addCardModal.classList.add('is-active');
  },
  showAddTagCardModal: function(event) {
    const cardId = event.target.closest('.box').dataset.cardId;
    const addTagToCardModal = document.getElementById('addTagToCard');
    const hiddenIdInput = addTagToCardModal.querySelector('.hidden-input');
    hiddenIdInput.value = cardId;
    addTagToCardModal.classList.add('is-active');
    //!
    console.log('click add tag to card id', cardId);
  },
  hideModals: function() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('is-active'));
  },
  // HIDDEN FORMS
  showEditList: function(event) {
    event.target.classList.add('is-hidden');
    event.target.parentNode.querySelector('.edit-list-form').classList.remove('is-hidden');
  },
  showEditCard: function(event) {
    console.log('clic edit card btn');
    const card = event.target.closest('.box');
    card.querySelector('.card--content').classList.add('is-hidden');
    card.querySelector('.edit-card-form').classList.remove('is-hidden');
  },
  hideEditList: function(listId) {
    const list = document.querySelector(`.panel[data-list-id="${listId}"]`);
    list.querySelector('.list-title').classList.remove('is-hidden');
    list.querySelector('.edit-list-form').classList.add('is-hidden');
  },
  hideEditCard: function(cardId) {
    const card = document.querySelector(`.box[data-card-id="${cardId}"]`);
    card.querySelector('.card--content').classList.remove('is-hidden');
    card.querySelector('.edit-card-form').classList.add('is-hidden');
  },
  // HANDLE FORMS
  handleAddListForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // fetch
    const response = await fetch(`${app.base_url}lists`, {
      method: 'POST',
      body: formData
    });
    if(response.status === 201) {
      const list = await response.json();
      app.makeListInDOM(list);
    } else {
      console.log('post /lists something went wrond')
    }
    app.hideModals();
  },
  handleAddCardForm: async function(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const response = await fetch(`${app.base_url}cards`, {
        method: 'POST',
        body: formData
      });
      if(response.status === 201) {
        const card = await response.json();
        app.makeCardInDOM(card);
      } else {
        console.log('post /cards something went wrond')
      }
      app.hideModals();
    } catch(error) {
      console.error('handle card form:', error);
    }
  },
  handleEditListForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get('list-id');
    const listTitle = event.target.closest('.panel').querySelector('.list-title');
    try {
      const response = await fetch(`${app.base_url}lists/${listId}`, {
        method: 'PATCH',
        body: formData
      });
      if(response.status === 200) {
        listTitle.textContent = formData.get('name');
        app.hideEditList(listId);
      } else {
        console.log('post /cards something went wrong')
      }
    } catch(error) {
      console.error('handle edit list form:', error);
    }
  },
  handleEditCardForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cardBox = event.target.closest('.box');
    const cardId = formData.get('card-id');
    const cardContent = cardBox.querySelector('.card-title');
    try {
      const response = await fetch(`${app.base_url}cards/${cardId}`, {
        method: 'PATCH',
        body: formData
      });
      if(response.status === 200) {
        cardContent.textContent = formData.get('content');
        cardBox.style.backgroundColor = formData.get('color');
        app.hideEditCard(cardId);
      } else {
        console.log('post /cards something went wrond');
      }
    } catch(error) {
      console.error('handle edit card form:', error);
    }
  },
  // MAKE IN DOM
  makeListInDOM: function(list) {
    // get and import template
    const template = document.getElementById('listTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    //TODO ou const cloneTemplate = template.content.cloneNode(true);
    // modify content
    const panel = cloneTemplate.querySelector('.panel');
    panel.dataset.listId = list.id;
    //TODO ou panel.setAttribute('data-list-id', list.id);
    cloneTemplate.querySelector('.list-title').textContent = list.name;
    // set the actual value in form
    panel.querySelector('.edit-list-form input[name="name"]').value = list.name;
    panel.querySelector('.edit-list-form input[name="list-id"]').value = list.id;
    // set new event listener on new list
    cloneTemplate.querySelector('.add-card-btn').addEventListener('click', app.showAddCardModal);
    cloneTemplate.querySelector('.list-title').addEventListener('dblclick', app.showEditList);
    cloneTemplate.querySelector('.edit-list-form').addEventListener('submit', app.handleEditListForm);
    cloneTemplate.querySelector('.delete-list-btn').addEventListener('click', app.deleteList);
    // append in DOM
    const kanbanBoard = document.getElementById('kabanBoard');
    kanbanBoard.appendChild(cloneTemplate);
  },
  makeCardInDOM: function(card) {
    const template = document.getElementById('cardTemplate');
    const cloneTemplate = document.importNode(template.content, true);
    const cardDOM = cloneTemplate.querySelector('.box');
    // set the title
    const cardTitleDiv = cloneTemplate.querySelector('.card-title');
    cardTitleDiv.textContent = card.content;
    //set the id & color
    cardDOM.dataset.cardId = card.id;
    cardDOM.style.backgroundColor = card.color;
    //set the actual value in form
    cardDOM.querySelector('.edit-card-form input[name="card-id"]').value = card.id;
    cardDOM.querySelector('.edit-card-form input[name="content"]').value = card.content;
    cardDOM.querySelector('.edit-card-form input[name="color"]').value = card.color;
    // set the buttons event listener
    cardDOM.querySelector('.edit-card-btn').addEventListener('click', app.showEditCard);
    cardDOM.querySelector('.delete-card-btn').addEventListener('click', app.deleteCard);
    cardDOM.querySelector('.edit-card-form').addEventListener('submit', app.handleEditCardForm);
    cardDOM.querySelector('.add-tag-card-btn').addEventListener('click', app.showAddTagCardModal);
    // append in the list, in the card-container div
    const list = document.querySelector(`.panel[data-list-id="${card.list_id}"]`);
    const cardContainer = list.querySelector('.card-container');
    cardContainer.appendChild(cloneTemplate);
  },
  makeTagInCardInDOM: function(cardId, tag) {
    const cardTagBloc = document.querySelector(`.box[data-card-id="${cardId}"] .card-tag-bloc`);
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('tag', 'is-link');
    tagSpan.textContent = tag.name;
    tagSpan.style.backgroundColor = tag.color;
    tagSpan.dataset.tagId = tag.id;
    tagSpan.addEventListener('dblclick', app.removeTag);
    cardTagBloc.appendChild(tagSpan);
  },
  makeTagSelectModalInDOM: function(tag) {
    console.log('make in dom the tag', tag.name);
    const tagSelectOption = document.createElement('option');
    tagSelectOption.textContent = tag.name;
    const tagModalSelect = document.getElementById('addTagToCard').querySelector('.tag-list-select');
    tagModalSelect.appendChild(tagSelectOption);
  },
  // REMOVE
  removeTag: async function(event) {
    const tag = event.target
    const tagId = tag.dataset.tagId;
    const cardId = event.target.closest('.box').dataset.cardId;
    //!
    //console.log(`on veut enlever le tag ${tagId} de la carte ${cardId}`);
    try {
      const response = await fetch(`${app.base_url}cards/${cardId}/tags/${tagId}`, {
        method: 'DELETE'
      });
      if(response.status === 200) {
        tag.remove();
      } else {
        console.log('delete /cards something went wrond');
      }
    } catch(error) {
      console.error('remove tag:', error);
    }
  },
  // DELETE
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
      const response = await fetch(`${app.base_url}lists/${listId}`, {
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
  deleteCard: async function(event) {
    event.preventDefault();
    const card = event.target.closest('.box');
    const cardId = card.dataset.cardId;
    try {
      const response = await fetch(`${app.base_url}cards/${cardId}`, {
        method: 'DELETE'
      });
      if(response.status === 204) {
        card.remove();
      } else {
        console.log('delete /cards something went wrond');
      }
    } catch(error) {
      console.error('delete card btn:', error);
    }
  },
  // ----------- FETCH GET ----------- //
  getListsFromAPI: async function() {
    try {
      const response = await fetch(`${app.base_url}lists`, {
        method: 'GET'
      });
      if(response.status === 200) {
        const lists = await response.json();
        // for each list
        for(const list of lists) {
          app.makeListInDOM(list);
          // for each card in a list
          for(const card of list.cards) {
            app.makeCardInDOM(card);
            for(const tag of card.tags) {
              app.makeTagInCardInDOM(card.id, tag);
            }
          }
        }
      } else {
        console.log('get lists and cards: something went wrong');
      }
    } catch(error) {
      console.error('get all lists:', error);
    }
  },
  getTagsFromAPI: async function() {
    try {
      const response = await fetch(`${app.base_url}tags`, {
        method: 'GET'
      });
      if(response.status === 200) {
        const tags = await response.json();
        // for each list
        for(const tag of tags) {
          app.makeTagSelectModalInDOM(tag);
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
    app.getTagsFromAPI();
    app.addListenerToAction();
    //TODO test SortableJS
    new Sortable(kabanBoard, {
      animation: 150,
      ghostClass: 'blue-background-class'
    })
  }
};

document.addEventListener('DOMContentLoaded', app.init );