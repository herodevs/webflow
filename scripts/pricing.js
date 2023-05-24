const servicesToggle = document.querySelector('#services-toggle')
const productsToggle = document.querySelector('#products-toggle')

const angularToggle = document.querySelector('#angular-toggle')
const vueToggle = document.querySelector('#vue-toggle')
const protractorToggle = document.querySelector('#protractor-toggle')

const corpPrice = document.querySelector('#corporate-price')
const enterprisePrice = document.querySelector('#enterprise-price')
const corpDesc = document.querySelector('#corporate-description')
const enterpriseDesc = document.querySelector('#enterprise-description')

const categoryPricingSection = document.querySelector('#category-pricing')
const nesProductSelectro = document.querySelector('#nes-product-selector')
const servicesCallToAction = document.querySelector('#services-call-to-action')

const MODAL_BACKDROP = '.modal-backdrop';
const PRICING_MODAL = 'pricing-calculator-modal';
const MODAL_CARD = '.modal-card';
const STEP_MESSAGE = '.step-message';

const step1 = document.getElementById('pricing-step-1');
const step2 = document.getElementById('pricing-step-2');
const step3 = document.getElementById('pricing-step-3');

const step1Next = document.getElementById('step-1-btn');
const step2Next = document.getElementById('step-2-next');
const step2Before = document.getElementById('step-2-previous');
const step3Before = document.getElementById('step-3-previous');
// const step3Next = document.getElementById('');

const step1Form = document.getElementById('step-1-form');
const step2Form = document.getElementById('step-2-form');
const step3Form = document.getElementById('step-3-form');

const pricingCalculatorModal = document.getElementById(PRICING_MODAL);
const pricingCalculatorModalBackdrop = document.querySelector(MODAL_BACKDROP);
const pricingModalCard = document.querySelector(MODAL_CARD);
const stepMessage = document.querySelector(STEP_MESSAGE);

if (pricingCalculatorModal.style.display === 'block') {
  pricingCalculatorModal.style.display = 'none';
}

const modalParts = {
  modal: pricingCalculatorModal,
  backdrop: pricingCalculatorModalBackdrop,
  card: pricingModalCard
};

const progressBar = document.getElementById('pricing-progress-bar');
const progress = (progressBar || { firstChild: { style: { width: '0px' }} }).firstChild;
const productSelectedLabel = document.getElementById('product-selected');

const firstNameInput = document.getElementById('firstname');
const lastNameInput = document.getElementById('lastname');
const phoneInput = document.getElementById('phone');
const companyInput = document.getElementById('company');
const emailInput = document.getElementById('email');

const errorChild = document.getElementById('error-message');
const errorMessage = (errorChild || { parentElement: { style: { display: 'none' } } }).parentElement;
const productLabel = document.getElementById('product-label');
const seatsInput = document.getElementById('seats');

const errorMessageStep2 = document.getElementById('error-message-s2');
const successMessageStep2 = document.getElementById('success-message-s2');

const pricePerSeat = document.getElementById('price-per-seat');
const pricePerSeatInfo = document.getElementById('price-per-seat-info');

const detailSeats = document.getElementById('detail-seats');
const detailAdditional = document.getElementById('detail-additional');
const detailBilled = document.getElementById('detail-billed');
const detailProduct = document.getElementById('detail-product');

const generalForm = document.getElementById('submission-form');
const scheduleCallButton = document.getElementById('schedule-call');

const firstName = document.getElementById('pricing-firstname');
const lastName = document.getElementById('pricing-lastname');
const company = document.getElementById('pricing-company');
const email = document.getElementById('pricing-email');
const phone = document.getElementById('pricing-phone');
const submitButton = document.getElementById('general-contact-form-submit-button');
const calendarContainer = document.getElementById('calendar-container');
const submitForm = document.getElementById('pricing-calculator-submit-form');

const priceInfo = document.getElementById('pricing-info');

submitButton.type = 'submit'

let selectedCategory = 'products'
let selectedProduct = 'vue'

const toggle = {
    on: {
        button: 'toggle--active',
        text: 'toggle-text--active'
    },
    off: {
        button: 'toggle--unactive',
        text: 'toggle-text--unactive'
    },
    nes: {
        on: {
            button: 'nes-toggle--active',
            text: 'toggle-text--active'
        },
        off: {
            button: 'nes-toggle--unactive',
            text: 'toggle-text--unactive'
        },
    }
}

const ANGULAR_CORP = "Contact Sales for Pricing";
const ANGULAR_ENTERPRISE = ANGULAR_CORP;

const ANGULAR_DESC_CORP = 'Billed annually. Priced per seat.';
const ANGULAR_DESC_ENTERPRISE = ANGULAR_DESC_CORP;

const VUE_CORP = ANGULAR_CORP;
const VUE_ENTERPRISE = ANGULAR_ENTERPRISE;

const VUE_DESC_CORP = ANGULAR_DESC_CORP + "\nPrices increase on June 1st.";
const VUE_DESC_ENTERPRISE = ANGULAR_DESC_ENTERPRISE + "\nPrices increase on June 1st.";

const PROTRACTOR_CORP = ANGULAR_CORP;
const PROTRACTOR_ENTERPRISE = ANGULAR_ENTERPRISE;

const PROTRACTOR_DESC_CORP = ANGULAR_DESC_CORP;
const PROTRACTOR_DESC_ENTERPRISE = ANGULAR_DESC_ENTERPRISE;

function renderPricing() {
    if (selectedCategory === 'services') {
        servicesToggle.className = toggle.on.button
        servicesToggle.firstChild.className = toggle.on.text
        
        productsToggle.className = toggle.off.button
        productsToggle.firstChild.className = toggle.off.text
        
        categoryPricingSection.style.display = 'none'
        nesProductSelectro.style.display = 'none'
        servicesCallToAction.style.display = 'block'
    }

    if (selectedCategory === 'products') {
        servicesToggle.className = toggle.off.button
        servicesToggle.firstChild.className = toggle.off.text
        
        productsToggle.className = toggle.on.button
        productsToggle.firstChild.className = toggle.on.text
        
        categoryPricingSection.style.display = 'block'
        nesProductSelectro.style.display = 'block'
        servicesCallToAction.style.display = 'none'
    }

    if (selectedProduct === 'angular') {
        angularToggle.className = toggle.nes.on.button
        angularToggle.firstChild.className = toggle.nes.on.text
        
        vueToggle.className = toggle.nes.off.button
        vueToggle.firstChild.className = toggle.nes.off.text
        
        protractorToggle.className = toggle.nes.off.button
        protractorToggle.firstChild.className = toggle.nes.off.text
        
        corpPrice.innerText = ANGULAR_CORP
        enterprisePrice.innerText = ANGULAR_ENTERPRISE
        corpDesc.innerText = ANGULAR_DESC_CORP
        enterpriseDesc.innerText = ANGULAR_DESC_ENTERPRISE

        document.querySelectorAll('.talk-to-sales-button').forEach(btn => {
            btn.textContent = 'Talk to Sales'
        })
    }

    if (selectedProduct === 'vue') {
        angularToggle.className = toggle.nes.off.button
        angularToggle.firstChild.className = toggle.nes.off.text
        
        vueToggle.className = toggle.nes.on.button
        vueToggle.firstChild.className = toggle.nes.on.text
        
        protractorToggle.className = toggle.nes.off.button
        protractorToggle.firstChild.className = toggle.nes.off.text
        
        corpPrice.innerText = VUE_CORP
        enterprisePrice.innerText = VUE_ENTERPRISE
        corpDesc.innerText = VUE_DESC_CORP
        enterpriseDesc.innerText = VUE_DESC_ENTERPRISE

        document.querySelectorAll('.talk-to-sales-button').forEach(btn => {
            btn.textContent = 'Get a Custom Quote'
        })
    }

    if (selectedProduct === 'protractor') {
        angularToggle.className = toggle.nes.off.button
        angularToggle.firstChild.className = toggle.nes.off.text
        
        vueToggle.className = toggle.nes.off.button
        vueToggle.firstChild.className = toggle.nes.off.text
        
        protractorToggle.className = toggle.nes.on.button
        protractorToggle.firstChild.className = toggle.nes.on.text
        
        corpPrice.innerText = PROTRACTOR_CORP
        enterprisePrice.innerText = PROTRACTOR_ENTERPRISE
        corpDesc.innerText = PROTRACTOR_DESC_CORP
        enterpriseDesc.innerText = PROTRACTOR_DESC_ENTERPRISE

        document.querySelectorAll('.talk-to-sales-button').forEach(btn => {
            btn.textContent = 'Get a Custom Quote'
        })
    }
}

servicesToggle.addEventListener('click', () => {
    selectedCategory = 'services'
    renderPricing()
})
productsToggle.addEventListener('click', () => {
    selectedCategory = 'products'
    renderPricing()
})

angularToggle.addEventListener('click', () => {
    selectedProduct = 'angular'
    renderPricing()
})
vueToggle.addEventListener('click', () => {
    selectedProduct = 'vue'
    renderPricing()
})
protractorToggle.addEventListener('click', () => {
    selectedProduct = 'protractor'
    renderPricing()
})

let showModal = false;
let pricingSelected = null;


document.querySelectorAll('.talk-to-sales-button').forEach(btn => {
    btn.addEventListener('click',() => {
        pricingSelected = btn.id;
				if (selectedProduct === 'angular') {
					window.open("https://xlts.dev/contact-us?referral=herodevs");
				} else {
          modalParts.backdrop.style.display = 'block';
          modalParts.card.style.display = 'inline-block';
          modalParts.modal.display = 'block';
          switch (selectedProduct) {
            case 'vue': 
              addOrUpdateURLParams({ 'pricing_step': '1', product: 'vue' });
              break;
            case 'protractor': 
              addOrUpdateURLParams({ 'pricing_step': '1', product: 'protractor' });
              break;
          }
				}
    })
})

renderPricing()

firstNameInput.placeholder = 'Enter your first name';
lastNameInput.placeholder = 'Enter your last name';
phoneInput.placeholder = 'Enter phone number';
companyInput.placeholder = 'Enter company name';
emailInput.placeholder = 'Enter company email';
seatsInput.value = 1;

const TOTAL_STEPS = 3;

const products = {
  angular: 'AngularJS', 
  vue: 'NES Vue2', 
  protractor: 'NES Protractor'
}

const searchParams = getCurrentParams();
const initialParams = getCurrentParamsObject();

renderStep(initialParams);

seatsInput.type = 'number';
seatsInput.addEventListener('input', (e) => {
  // Get the current input value
  let currentValue = parseInt(e.target.value, 10);

  if (currentValue === NaN) {
    e.target.value = 1;
    return;
  }

  // Ensure the value is between 1 and 10
  if (currentValue < 1) {
    e.target.value = 1;
    return;
  }
  // Update the input value with the constrained value
  e.target.value = currentValue;
});

step1Form.addEventListener('submit', (e) => {
    e.preventDefault();
});

step2Form.addEventListener('submit', (e) => {
    e.preventDefault();
    step1Form.style.display = 'block';
    errorMessageStep2.style.display = 'none';
    successMessageStep2.style.display = 'none';

});

step3Form.addEventListener('submit', (e) => {
    e.preventDefault();
});

function getCurrentParams () {
    const url = new URL(window.location.href)
    return url.searchParams
}

function getCurrentParamsObject() {
    const searchParams = getCurrentParams();
    const paramsObject = {};
    searchParams.forEach((value, key) => {
        paramsObject[key] = value;
    });
    return paramsObject;
}

function addOrUpdateURLParams(paramsToUpdate) {
    const currentParams = getCurrentParams();

    for (const [key, value] of Object.entries(paramsToUpdate)) {
        if (value === null) {
            currentParams.delete(key);
        } else {
            currentParams.set(key, value);
        }
    }

    let newRelativePathQuery = window.location.pathname;

    if (currentParams.toString()) {
        newRelativePathQuery += "?" + currentParams.toString();
    }

    window.history.pushState(null, "", newRelativePathQuery);
    
    const updatedParams = getCurrentParamsObject();
    
    renderStep(updatedParams);
}

function renderModal(showPricingModal) {
    pricingCalculatorModal.style.display = showPricingModal ? 'block' : 'none';
    errorMessage.style.display = 'none';
    errorMessageStep2.style.display = 'none';
}

function calculatePrice(seats) {
    let price;

    if (seats >= 1 && seats <= 4) {
        price = 4000;
    } else if (seats >= 5 && seats <= 60) {
        price = seats * 1000;
    } else if (seats >= 61 && seats <= 100) {
        price = 60000;
    } else {
        price = null;
    }

    return price;
}

function formatPrice(number) {
    if (number) {
        return number.toLocaleString('en-US');
    } else {
        return null;
    }
}


function renderStep(params) {
    const pricingStep = params['pricing_step'];
    const productSelected = params['product'];

    if (!pricingStep) {
        renderModal(false)
        return;
    }

    const selectedProductText = products[productSelected];
    if (selectedProductText) {
        productSelectedLabel.textContent = selectedProductText;
        productLabel.textContent = selectedProductText;
    } else { 
        productSelectedLabel.textContent = 'Select a Product'
    }
    
    renderModal(true);
    const step = Number(pricingStep);
    progress.style.width = `${(progressBar.offsetWidth / 100) * (100 / TOTAL_STEPS * step)}px`;

    switch (step) {
        case 1:
            step1.style.display = 'block';
            step2.style.display = 'none';
            step3.style.display = 'none';
            generalForm.style.display = 'none';
            calendarContainer.style.display = 'none';
            stepMessage.textContent = `Step ${step} of ${TOTAL_STEPS}`;
            break;
        case 2:
            step1.style.display = 'none';
            step2.style.display = 'block';
            step3.style.display = 'none';
            generalForm.style.display = 'none';
            calendarContainer.style.display = 'none';
            stepMessage.textContent = `Step ${step} of ${TOTAL_STEPS}`;
            emulateFormSubmission();
            break;

        case 3:
            const seats = parseInt(params['seats'], 10);
            if (!seats) {
                throw new Error('No seats added');
            }
            const anualPrice = formatPrice(calculatePrice(seats));
            if (anualPrice) {
                const pricePerSeatText = formatPrice(calculatePrice(seats)/seats);
                if (seats <= 4) {
                    pricePerSeat.textContent = `$4,000`;
                } else {
                    pricePerSeat.textContent = `$${pricePerSeatText}`;
                }

                // This is the "per seat/year" text
                pricePerSeatInfo.style.display = 'block';
            } else {
                pricePerSeat.textContent = 'Talk to Sales';

                // This is the "per seat/year" text
                pricePerSeatInfo.style.display = 'none'
            }

            if (seats <= 4) {
                detailSeats.textContent = `Up to 4`;
                pricePerSeatInfo.textContent = 'per year';
                priceInfo.textContent = `Up to 4 total seats.`;
            } else { 
                detailSeats.textContent = seats;
                pricePerSeatInfo.textContent = 'per seat/year';
                priceInfo.textContent = `$${anualPrice} for ${seats} total seat${seats > 1 ? 's' : ''}.`;
            }
            detailBilled.textContent = 'Annually';
            detailProduct.textContent = selectedProductText;
            detailAdditional.textContent = '$1,000/year';
            

            step1.style.display = 'none';
            step2.style.display = 'none';
            step3.style.display = 'block';
            generalForm.style.display = 'none';
            calendarContainer.style.display = 'none';
            stepMessage.textContent = `You're all set!`;
            showCalendar()
            break;
          case 4:
            step1.style.display = 'none';
            step2.style.display = 'none';
            step3.style.display = 'none';
            stepMessage.textContent = `Select a date for a call`;
            showCalendar()
            break;
    }
}

function emulateFormSubmission() {
  generalForm.style.display = 'none';

  firstName.value = firstNameInput.value;
  firstName.name = 'firstname';

  lastName.value = lastNameInput.value;
  lastName.name = 'lastname';

  company.value = companyInput.value;
  company.name = 'company';

  email.value = emailInput.value;
  email.name = 'email';

  phone.value = phoneInput.value;
  phone.name = 'phone';

  submitButton.type = 'submit'
  submitButton.click();
}

function showCalendar() {
  // append div element for calendly
  var divElement = document.createElement('div');
  divElement.id = 'calendly-container';
  document.body.appendChild(divElement);

  Calendly.initInlineWidget({
    url: [
      'https://calendly.com/jtrainque/30min-1?',
      'hide_gdpr_banner=1',
    ].join('&'),
    parentElement: divElement,
    prefill: {},
    utm: {}
  });

  const markup = document.getElementById('calendly-container').innerHTML;

  calendarContainer.innerHTML = `
    <div style="height: 800px">
      <div id="calendly-small" style="height: 100%;">${markup}</div>
    </div>
  `;

  //     calendarContainer.innerHTML = `
  //   <div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/hdfrosty/nes-meeting?embed=true"></div>
  // `;
  calendarContainer.style.display = 'block';
  // var MeetingsEmbedCode=function(t){function e(t){return t.querySelectorAll("iframe").length>0}t.elementContainsIFrame=e;function n(t,e){return t||e?"&parentPageUrl="+t+e:""}t.getParentPageUrl=n;function o(t){var e=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),o=0;o<n.length;o++){var r=n[o].trim(),a=t+"=";if(r.substring(0,t.length+1)===a){e=r.substring(t.length+1);break}}return e}function r(t){return t?"&parentHubspotUtk="+t:""}t.getParentUtkParam=r;function a(t){return t?"&"+t.substr(1):""}t.getParentQueryParams=a;function i(t,e,n){return(t?"&ab="+t:"")+(e?"&abStatus="+e:"")+(n?"&contentId="+n:"")}t.buildAbTestingParams=i;function s(){var t=(new Date).getTime();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,(function(e){var n=(t+16*Math.random())%16|0;t=Math.floor(t/16);return("x"===e?n:3&n|8).toString(16)}))}function u(){var t=window.crypto||window.msCrypto,e=new Uint16Array(8);t.getRandomValues(e);var n=function(t){for(var e=t.toString(16);e.length<4;)e="0"+e;return e};return n(e[0])+n(e[1])+n(e[2])+n(e[3])+n(e[4])+n(e[5])+n(e[6])+n(e[7])}function c(){var t=window.crypto||window.msCrypto;return void 0!==t&&void 0!==t.getRandomValues&&void 0!==window.Uint16Array?u():s()}function d(){var t=window.__hsUserToken||o("hubspotutk");if(!t){var e=c();t=e;window.__hsUserToken=e}return t}t.getOrSetHubspotUtk=d;var p=["https://local.hubspot.com","https://local-eu1.hubspot.com","https://local.hubspotqa.com","https://local-eu1.hubspotqa.com","https://app.hubspot.com","https://app-eu1.hubspot.com","https://app.hubspotqa.com","https://app-eu1.hubspotqa.com","https://meetings.hubspot.com","https://meetings-eu1.hubspot.com","https://meetings.hubspotqa.com","https://meetings-eu1.hubspotqa.com"];function h(t){return p.indexOf(t)>-1}t.isHubSpotOrigin=h;function g(t,e){var n=t[t.message?"message":"data"];(h(t.origin)||t.origin.indexOf(window.origin)>-1)&&n.height&&(e.style.height=n.height+"px")}t.resize=g;var m=window._hsp=window._hsp||[];function l(t,e){t&&"readyForConsentListener"===t.data&&m.push(["addPrivacyConsentListener",function(t){var n=t.allowed,o=t.categories,r=n||o.analytics;e.contentWindow.postMessage({type:"privacy-consent",shouldTrackAnalytics:r},"*")}])}t.addPrivacyConsentListener=l;function w(n){var o,r=document.querySelectorAll(n),a=[];for(o=0;o<r.length;o++){var i=r[o],s=i.dataset.src,u=i.dataset.title,c=document.createElement("iframe"),d=i.dataset.ab,p=i.dataset.abStatus,h=i.dataset.contentId,g=t.getOrSetHubspotUtk();i.height="100%";c.src=s+t.getParentUtkParam(g)+t.getParentPageUrl(window.location.origin,window.location.pathname)+t.getParentQueryParams(window.location.search)+t.buildAbTestingParams(d,p,h);u&&(c.title=u);c.width="100%";c.style.minWidth="312px";c.style.minHeight="516px";c.style.height="756px";c.style.border="none";c.setAttribute("data-hs-ignore","true");if(!e(i)){i.appendChild(c);window.addEventListener("message",(function(e){t.resize(e,c)}));window.addEventListener("message",(function(e){t.addPrivacyConsentListener(e,c)}));a.push(c)}}return a}t.createMeetingsIframe=w;w(".meetings-iframe-container");window.hbspt||(window.hbspt={});window.hbspt.meetings||(window.hbspt.meetings={});window.hbspt.meetings.create=w;"object"==typeof exports&&(module.exports=t);return t}(MeetingsEmbedCode||{});

  
  // setTimeout(() => {
  //   document.querySelector('.meetings-iframe-container').style.height = 'auto';
  // }, 1500);
}

function verifyStep1() {
    const formReady = !!firstNameInput.value &&
                      !!lastNameInput.value &&
                      !!emailInput.value;
                      // !!phoneInput.value &&
                      // !!companyInput.value;

    if (!formReady) {
        errorMessage.style.display = 'block';
        errorMessage.firstChild.textContent = 'Please complete the form to continue 🙏🏽';
        return false;
    }

    errorMessage.style.display = 'none';
    return true;
}

function verifyStep2() {
    const formReady = !!seatsInput.value;
    if (!formReady) {
        errorMessageStep2.style.display = 'block';
        errorMessageStep2.firstChild.textContent = 'Please select the number of seats 💺';
        return false;
    }
    errorMessageStep2.style.display = 'none';
    return true;
}

step1Next.addEventListener('click', () => {
    if (verifyStep1()) {
        addOrUpdateURLParams({ 'pricing_step': '2' });
    }
});

step2Next.addEventListener('click', () => {
    if (verifyStep2()) {
        addOrUpdateURLParams({ 'pricing_step': '3', seats: seatsInput.value });
    }
});

step2Before.addEventListener('click', () => {
    addOrUpdateURLParams({ 'pricing_step': '1' });
});

step3Before.addEventListener('click', () => {
    addOrUpdateURLParams({ 'pricing_step': '2' });
});

pricingCalculatorModalBackdrop.addEventListener('click', () => {
addOrUpdateURLParams({ 'pricing_step': null, product: null, seats: null });
    // create function to reset state
})

window.addEventListener('popstate', function(event) {
    // Your code to execute when the back button is clicked
    const updatedParams = getCurrentParamsObject();
    renderStep(updatedParams);
});

scheduleCallButton.addEventListener('click', () => {
  addOrUpdateURLParams({ 'pricing_step': '4' });
})
