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