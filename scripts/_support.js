let showModal = false;
let pricingSelected = null;
let timeout = 0;
let totalIterationsLimit = 12;
let selectedProduct = 'unknown';

const scriptElement = document.getElementById('herodevs-script-src');
if (scriptElement) {
  selectedProduct = scriptElement.attributes['data-product'].value;
}

const modal = document.querySelector('#price-modal');
const modalBackdrop = document.querySelector('#price-modal-backdrop');
const modalCloseIcon = document.querySelector('#price-modal-close-icon');

function renderModal() {
    modal.style.display = showModal ? 'block' : 'none';
}

function appendHiddenInput(parent, name, value) {
  let elementIsAlreadyThere = false;
  for (let i = 0; i < parent.length; i++) {
    if (parent[i].name.toLowerCase() === name.toLowerCase()) {
      elementIsAlreadyThere = true;
    }
  }
  if (elementIsAlreadyThere) {
    return;
  }
  const theInput = document.createElement('input');
  theInput.type = 'hidden';
  theInput.name = name;
  theInput.value = value;
  parent.appendChild(theInput)
}

function getForm() {
  return document.getElementById('wf-form-Contact-Form');
}

function addHiddenInputsToContactForm(form, productInterest, pricingPlan) {;
  appendHiddenInput(form, 'product_interest', productInterest);
  // appendHiddenInput(form, 'plan', pricingPlan);
}

function waitAndAppendHiddenInputsToForm(form, i) {
  if (!form && (i < totalIterationsLimit)) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      i++;
      waitAndAppendHiddenInputsToForm(getForm(), i);
    }, 250);
  } else {
    if (!form) {
      return;
    }
    addHiddenInputsToContactForm(form, selectedProduct, pricingSelected);
  }
}

document.querySelectorAll('.talk-to-sales-button').forEach(btn => {
    btn.addEventListener('click',() => {
        showModal = true;
        pricingSelected = btn.id;
        waitAndAppendHiddenInputsToForm(getForm(), 0);
        renderModal();
    })
})

modalBackdrop.addEventListener('click', () => {
    showModal = false;
		pricingSelected = null;
    renderModal();
});
modalCloseIcon.addEventListener('click', () => {
    showModal = false;
		pricingSelected = null;
    renderModal();
});

renderModal()