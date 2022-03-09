// Modal
// Open/close modal layer, disable scrolling when modal opens

document.addEventListener('DOMContentLoaded', () => {

  // Find body 
  const BODY = document.body; 
  // Scroll bar width
  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;  

  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
    $el.querySelector('.js-modal-focus').focus()
    BODY.classList.add('modal-open');
    BODY.style.paddingRight = scrollbarWidth + "px";    
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
    BODY.classList.remove('modal-open');
    BODY.setAttribute('style', '')

  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-backdrop, .modal-close, .modal-head .delete, .modal-footer .btn, .js-close') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });  


  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});  