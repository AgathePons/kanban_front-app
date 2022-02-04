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