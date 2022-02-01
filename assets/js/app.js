
// on objet qui contient des fonctions
const app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.addListenerToActions();
  },
  addListenerToActions: function() {
    // récupérer le bouton "ajouter une liste"
    // je lui attache un écouteur d'évènement click
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    // récupérer les boutons close
    // const btnsClose = document.querySelectorAll('.close');
    const btnsClose = document.getElementsByClassName('close');
    // puis leur attacher un écouteur d'évènement click
    for(const btn of btnsClose) {
      btn.addEventListener('click', app.hideModals);
    }
    // on intercepte la soumission du formulaire d'ajout de liste
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);

    // on va cibler les boutons + permettant d'afficher la modale d'ajout de carte
    const btnsAddCard = document.querySelectorAll('.panel a.is-pulled-right');
    for(const btn of btnsAddCard) {
      btn.addEventListener('click', app.showAddCardModal);
    }

    // intercepter la soumission du formulaire d'ajout de carte
    document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
    
  },
  showAddListModal: function() {
    // récupérer la div modal
    const modal = document.getElementById('addListModal');
    // on va ajouter la classe is-active de Bulma sur la modal
    modal.classList.add('is-active');
  },
  showAddCardModal: function(event) {
    // récupérer l'input list_id du formulaire
    const input = document.querySelector('#addCardModal input[name="list_id"]');
    // modifier sa valeur avec l'id de la liste cliquée
    input.value = event.target.closest('.panel').getAttribute('data-list-id');
    // même chose en utilisant l'API data attribute, on accède à la valeur de l'attribut custom data-list-id. 
    input.value = event.target.closest('.panel').dataset.listId;
    // cibler la modale de card
    const modal = document.getElementById('addCardModal');
    // puis l'afficher
    modal.classList.add('is-active');
  },
  hideModals: function() {
    // récupérer les modales
    const modals = document.querySelectorAll('.modal');
    
    // retirer la classe is-active de Bulma
    for(const modal of modals) {
      modal.classList.remove('is-active');
    }
  },
  handleAddListForm: function(event) {
    // empêcher le rechargement de la page
    event.preventDefault();
    // récupère les données du formulaire
    const formData = new FormData(event.target);
    // créé la liste dans le DOM à partir des données du formulaire
    app.makeListInDOM(formData);
    // fermer la modale
    app.hideModals();

  },
  makeListInDOM: function(formData) {
    // récupérer le template de liste et en faire un clone
    const template = document.getElementById('listTemplate');
    // faire un clone de ce template
    // const cloneTemplate = template.content.cloneNode(true);
    const cloneTemplate = document.importNode(template.content, true);
    // on modifie le clone du template en fonction des données du formulaire
    // ici on modifie le titre de la liste
    cloneTemplate.querySelector('h2').textContent = formData.get('name');
    // attacher l'évènement click sur le bouton + de la liste
    cloneTemplate.querySelector('a.is-pulled-right').addEventListener('click', app.showAddCardModal);
    // on l'insère dans le DOM
    document.querySelector('.card-lists').appendChild(cloneTemplate);
  },
  handleAddCardForm: function(event) {
    // on coupe le rechargement de la page
    event.preventDefault();
    // récupérer les données du formulaire
    const formData = new FormData(event.target);
    // créer la carte dans le DOM
    app.makeCardInDOM(formData);
    // cacher la modale
    app.hideModals();
  },
  makeCardInDOM: function(formData) {
    // récupérer le template
    const template = document.getElementById('cardTemplate');
    // cloner ce template pour qu'on puisse le manipuler
    const cloneTemplate = document.importNode(template.content, true);
    // modifier ce clone du template
    cloneTemplate.querySelector('h3').textContent = formData.get('content');
    // insérer le clone du template dans le DOM
    document.querySelector(`.panel[data-list-id="${formData.get('list_id')}"] .panel-block`).appendChild(cloneTemplate);
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );