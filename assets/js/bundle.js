(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const listModule = require('./listModule');
const cardModule = require('./cardModule');
const tagModule = require('./tagModule');
const utilsModule = require('./utilsModule');

const app = {
  addListenerToAction: function() {
    document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', utilsModule.hideModals));
    document.querySelector('#addListModal form').addEventListener('submit', listModule.handleAddListForm);
    document.querySelector('#addCardModal form').addEventListener('submit', cardModule.handleAddCardForm);
    document.querySelector('#addTagToCard form').addEventListener('submit', tagModule.handleAddTagToCardForm);
  },
  // ----------- FETCH GET ----------- //
  getListsFromAPI: async function() {
    try {
      const response = await fetch(`${utilsModule.base_url}lists`, {
        method: 'GET'
      });
      if(response.status === 200) {
        const lists = await response.json();
        // for each list
        for(const list of lists) {
          listModule.makeListInDOM(list);
          // for each card in a list
          for(const card of list.cards) {
            cardModule.makeCardInDOM(card);
            // for each tag in a card
            for(const tag of card.tags) {
              tagModule.makeTagInCardInDOM(card.id, tag);
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
      const response = await fetch(`${utilsModule.base_url}tags`, {
        method: 'GET'
      });
      if(response.status === 200) {
        const tags = await response.json();
        // for each list
        for(const tag of tags) {
          tagModule.makeTagSelectModalInDOM(tag);
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
},{"./cardModule":2,"./listModule":3,"./tagModule":4,"./utilsModule":5}],2:[function(require,module,exports){
const tagModule = require('./tagModule');
const utilsModule = require('./utilsModule');

const cardModule = {
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
    cardDOM.querySelector('.edit-card-btn').addEventListener('click', cardModule.showEditCard);
    cardDOM.querySelector('.delete-card-btn').addEventListener('click', cardModule.deleteCard);
    cardDOM.querySelector('.edit-card-form').addEventListener('submit', cardModule.handleEditCardForm);
    cardDOM.querySelector('.add-tag-card-btn').addEventListener('click', tagModule.showAddTagCardModal);
    // append in the list, in the card-container div
    const list = document.querySelector(`.panel[data-list-id="${card.list_id}"]`);
    const cardContainer = list.querySelector('.card-container');
    cardContainer.appendChild(cloneTemplate);
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
  handleAddCardForm: async function(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const response = await fetch(`${utilsModule.base_url}cards`, {
        method: 'POST',
        body: formData
      });
      if(response.status === 201) {
        const card = await response.json();
        cardModule.makeCardInDOM(card);
      } else {
        console.log('post /cards something went wrond')
      }
      utilsModule.hideModals();
    } catch(error) {
      console.error('handle card form:', error);
    }
  },
  showEditCard: function(event) {
    console.log('clic edit card btn');
    const card = event.target.closest('.box');
    card.querySelector('.card--content').classList.add('is-hidden');
    card.querySelector('.edit-card-form').classList.remove('is-hidden');
  },
  hideEditCard: function(cardId) {
    const card = document.querySelector(`.box[data-card-id="${cardId}"]`);
    card.querySelector('.card--content').classList.remove('is-hidden');
    card.querySelector('.edit-card-form').classList.add('is-hidden');
  },
  handleEditCardForm: async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cardBox = event.target.closest('.box');
    const cardId = formData.get('card-id');
    const cardContent = cardBox.querySelector('.card-title');
    try {
      const response = await fetch(`${utilsModule.base_url}cards/${cardId}`, {
        method: 'PATCH',
        body: formData
      });
      if(response.status === 200) {
        cardContent.textContent = formData.get('content');
        cardBox.style.backgroundColor = formData.get('color');
        cardModule.hideEditCard(cardId);
      } else {
        console.log('post /cards something went wrond');
      }
    } catch(error) {
      console.error('handle edit card form:', error);
    }
  },
  onCardDrop: async function (event) {
    // get origin & destination list
    const originList = event.from;
    const destinationList = event.to;
    // get origin/ destination cards and call fetch patch function
    const originCards = originList.querySelectorAll('.box');
    await cardModule.moveCards(originCards);
    const destinationCards = destinationList.querySelectorAll('.box');
    await cardModule.moveCards(destinationCards);
  },
  moveCards: async function(cards) {
    cards.forEach( async (card, index) => {
      const id = card.dataset.cardId;
      const listId = card.closest('.panel').dataset.listId;
      const formData = new FormData();
      formData.append('position', index);
      formData.append('list_id', listId);
      try {
        await fetch(`${utilsModule.base_url}cards/${id}`, {
          method: 'PATCH',
          body: formData
        });
      } catch(error) {
      console.error('on card drag n drop:', error);
    }
    });
  },
  deleteCard: async function(event) {
    event.preventDefault();
    const card = event.target.closest('.box');
    const cardId = card.dataset.cardId;
    try {
      const response = await fetch(`${utilsModule.base_url}cards/${cardId}`, {
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
};

module.exports = cardModule;
},{"./tagModule":4,"./utilsModule":5}],3:[function(require,module,exports){
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
},{"./cardModule":2,"./utilsModule":5}],4:[function(require,module,exports){
const tagModule = {
  makeTagInCardInDOM: function(cardId, tag) {
    const cardTagBloc = document.querySelector(`.box[data-card-id="${cardId}"] .card-tag-bloc`);
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('tag', 'is-link');
    tagSpan.textContent = tag.name;
    tagSpan.style.backgroundColor = tag.color;
    tagSpan.dataset.tagId = tag.id;
    tagSpan.addEventListener('dblclick', tagModule.removeTagFromCard);
    cardTagBloc.appendChild(tagSpan);
  },
  makeTagSelectModalInDOM: function(tag) {
    const tagSelectOption = document.createElement('option');
    tagSelectOption.textContent = tag.name;
    tagSelectOption.value = tag.id;
    const tagModalSelect = document.getElementById('addTagToCard').querySelector('.tag-list-select');
    tagModalSelect.appendChild(tagSelectOption);
  },
  showAddTagCardModal: function(event) {
    const cardId = event.target.closest('.box').dataset.cardId;
    const addTagToCardModal = document.getElementById('addTagToCard');
    addTagToCardModal.querySelector('form').dataset.cardId = cardId;
    addTagToCardModal.classList.add('is-active');
  },
  handleAddTagToCardForm: async function(event) {
    event.preventDefault();
    const cardId = event.target.dataset.cardId;
    const formData = new FormData(event.target);
    try {
      
      const response = await fetch(`${utilsModule.base_url}cards/${cardId}/tags`, {
        method: 'POST',
        body: formData
      });
      if(response.status === 200) {
        // empty the card tag bloc and refill with new list of tags
        const card = await response.json();
        const tags = card.tags;
        const tag = card.tags.find((tag) => tag.id == formData.get('id'));
        tagModule.makeTagInCardInDOM(cardId, tag);
      } else {
        console.log('post /cards something went wrond')
      }
      utilsModule.hideModals();
    } catch(error) {
      console.error('handle tag to card form:', error);
    }
  },
  removeTagFromCard: async function(event) {
    const tag = event.target
    const tagId = tag.dataset.tagId;
    const cardId = event.target.closest('.box').dataset.cardId;
    //!
    //console.log(`on veut enlever le tag ${tagId} de la carte ${cardId}`);
    try {
      const response = await fetch(`${utilsModule.base_url}cards/${cardId}/tags/${tagId}`, {
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
};

module.exports = tagModule;
},{}],5:[function(require,module,exports){
const utilsModule = {
  base_url: 'http://localhost:3000/',
  hideModals: function() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('is-active'));
  },
};

module.exports = utilsModule;
},{}]},{},[1]);
