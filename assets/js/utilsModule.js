const utilsModule = {
  base_url: 'http://localhost:3000/',
  hideModals: function() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('is-active'));
  },
};

module.exports = utilsModule;