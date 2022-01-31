
const app = {
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
    const listTitle = new FormData(event.target).get('name');
    app.makeListInDOM(listTitle);
    app.hideModals();
  },
  makeListInDOM: (listTitle) => {
    //!
    console.log(`value: ${listTitle}  type: ${typeof listTitle}`);
    const template = document.getElementById('listTemplate');
    const cloneTemplate = document.importNode(template.content, true);

    const h2Title = cloneTemplate.getElementById('newListTitle');
    h2Title.setAttribute('id', listTitle);
    h2Title.textContent = listTitle;
    
    const kanbanBoard = document.getElementById('kabanBoard');
    kanbanBoard.appendChild(cloneTemplate);
  },
  // ----------- INIT ----------- //
  init: () => {
    app.addListenerToAction();
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );