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