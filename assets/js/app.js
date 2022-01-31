
var app = {
  addListenerToAction: () => {
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', app.hideModals));
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
  },
  showAddListModal: () => {
    const addListModal = document.getElementById('addListModal');
    addListModal.classList.add('is-active');
  },
  hideModals: () => {
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => modal.classList.remove('is-active'));
  },
  handleAddListForm: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    return formData;
  },
  // ----------- INIT ----------- //
  init: function () {
    app.addListenerToAction();
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );