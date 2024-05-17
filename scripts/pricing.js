console.log('!!!!!!!!!!!!!!HERODEVS: BOOTING PRICING PAGE!!!!!!!!!!!!!!!!')
/**
 *  * ------------------------------------------------------------------------------------------------------
 *  * -------------------------------------------------------------- 
 *  * ------------------------------------------
 *  *            TABLE OF CONTENTS
 *  *        --------------------------
 *  *        Sections:
 *  *         - Static page variables (new)
 *  *         - Helper Functions (new)
 *  *         - Initialization (new)
 *  * ---------------------------------------
 *  * -------------------------------------------------------------- 
 *  * ------------------------------------------------------------------------------------------------------
 */




/**
 * ------------------------------------------------------------------------------------------------------
 *   Section: STATIC PAGE VARIABLES
 * -----------------------------------
 *  This section instantiates page variables based on dom elements
 *  and/or the necessity for declaration to be used throughout.
 *  It is scoped to the global window
 * ------------------------------------------------------------------------------------------------------
 */

const heroDevsCustomerKey = 'herodevsCustomer';

// title: card area contents
const title0 = document.getElementById('left-column-header');
const title1 = document.getElementById('right-column-header');

// subtitles: card area contents
const subtitle0 = document.querySelector('#corporate-price');
const subtitle1 = document.querySelector('#enterprise-price');

// descriptions: card area contents
const description0 = document.querySelector('#corporate-description');
const description1 = document.querySelector('#enterprise-description');

// highlights: card area contents, just below the CTA
const highlightSection0 = title0.parentElement.parentElement.querySelectorAll('.pricing__bullet-list')[0];
const highlightSection1 = title1.parentElement.parentElement.querySelectorAll('.pricing__bullet-list')[0];

// CTAs: calls to action, for each product package
const CTA0 = title0.parentElement.parentElement.querySelectorAll('.pricing__call-to-action')[0]
const CTA1 = title1.parentElement.parentElement.querySelectorAll('.pricing__call-to-action')[0];

// error element for custom pricing tool modal forms
const errorMessage = () => (
  document.getElementById('error-message') || { parentElement: { style: { display: 'none' } } }
).parentElement;

// title of modal
const productLabel = document.getElementById('product-label');

/**
 * ------------------------------------------------------------------------------------------------------
 *  Section: HELPER FUNCTIONS
 * ----------------------------
 *  This alphabetized section declares helper functions needed to instantiate our 
 *  @param ProductsDefintion. It is initialized via @function initialize() and drives
 *  the display and all behaviors of the product pricing page
 *  It is scoped to the global window
 * ------------------------------------------------------------------------------------------------------
 */

function addOrUpdateURLParams(paramsToUpdate, skipPushState) {
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
    newRelativePathQuery += '?' + currentParams.toString();
  }

  if (!skipPushState) {
    window.history.pushState(null, '', newRelativePathQuery);

    const updatedParams = getCurrentParamsObject();

    renderCustomQuoteToolStep(updatedParams);
  }
}

function formatPrice(number) {
  return number ? number.toLocaleString('en-US') : null;
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

/**
 * 
 * The default renderer used for the product package highlights, which is a
 * checkmarked, bulleted list of features.
 * @param {*} highlights The product package highlights
 * @returns void
 */
function defaultRenderPackageHighlights(highlights) {
  /**
   * `scope` ensures styles only apply to their own elements, when rendered
   * The reason for this is bc we are adding dynamic `<style>` tags to the page, which will 
   * affect anything else with the same class name. This ensures they're always unique to the 
   * elements they're meant to apply style to.
   */ 
  const scope = Date.now() + Math.floor(Math.random() * 100); 
  const bullets = highlights.map((highlight, i) => {
    const icon = highlight.icon ?
      '<img style="display: inline-block" src="' + highlight.icon + '" loading="lazy" width="20" alt="" class="pricing-checkmark">':
      '';
    const textStyleCorrection = highlight.icon ? 'margin: -1.35em 0 0 2em;': '';
    const text = `<div class="pricing__bullet-text" style="${textStyleCorrection}">${highlight.text}</div>`;

    const containerStyleCorrection = highlight.icon ? 'display: block' : '';
    return [
      `<div class="bullet-container" style="${containerStyleCorrection}">`,
        icon,
        text,
      '</div>'
    ].join('');

  });

  // TODO: put this css somewhere else?
  const styles = `
  <style>
    #category-pricing {
      min-width: 720px;
    }

    #category-pricing:first-child {
      height: 0;
    }

    .core-plus-parent-container-${scope} {
      padding-right: 50px !important;
    }

    .core-plus-bullet-${scope} {
      text-align: center;
    }

    .core-plus-${scope} {
      /* display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(${highlights.length}, 1fr);
      grid-auto-flow: column;*/
      border-radius: 10px 10px 10px 10px;
      margin-top: 1em;
      width: calc(100% + 18px);
    }
    
    .core-plus-column-${scope} {
      display: contents;
    }
    
    .core-plus-cell-${scope} {
      text-align: left;
      padding: 15px 5px 5px 10px;
      line-height: .5em;
      white-space: nowrap;
    }

    @media screen and (max-width: 959px) {
      .pricing-checkmark {
        float: left !important;
      }

      #category-pricing {
        min-width: unset;
      }

      .core-plus-parent-container-${scope} {
        padding-right: 0 !important;
      }

      .core-plus-bullet-${scope} {
        margin: 0 10% 0 10%;
      }

      .core-plus-${scope} {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(10, 1fr);
        width: 93% !important;
        margin: auto !important;
        margin-top: 1em !important;
      }

      .core-plus-column-${scope} .hider {
        display: none !important;
      }
      
      .core-plus-cell-${scope} {
        display: block !important;
        padding: 15px 5px 5px 9% !important;
      }

      .pricing__bullet-text {
        margin: -1.35em 0 2em 2em !important;
      }
    }

  </style>`

  return [
    styles,
    '<div class="bullet-container" style="padding-right: 0; display: block;">',
      `<div class="core-plus-${scope}">`,
        bullets.join(''),
      '</div>',
    '</div>',
  ].join('')
}

function defaultCTAClick(selectedProductPackage) {
  initializeCustomQuoteToolFor(selectedProductPackage);
}

function showCalendar(show) {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = `
  <iframe
    src="https://meetings.hubspot.com/josh-trainque/nes-round-robin"
    frameborder="0"
    style="width: 100%; height: 100%; min-height: 760px"
  />
`;


  calendarContainer.style.display = (show !== false) ? 'block': 'none';

  // this is a test
  setTimeout(() => {
    const iframeContainer = document.querySelector(
      '.meetings-iframe-container'
    );

    if (iframeContainer) {
      iframeContainer.style.minHeight = 'auto';
    }

    calendarContainer.querySelector('iframe').style.minHeight = innerHeight;
  }, 1500);
}


/**
 * Sets DOM elements based on the `product` param`
 * @param {ProductsDefinition} product
 */
function displaySelectedProduct(product) {

  displaySelectedProductPackages(product);

  setSelectedProductToggle(product);

}

function displaySelectedProductPackages(product) {
  /**
   * Set content for each @ProductDefinition.{product}.{package} definition
   */ 
  for (let i = 0; i < product.packages.length; i++) {
    const package = product.packages[i];

    // set title
    eval('title' + i).innerText = package.plan || package.title;

    // set subtitle
    eval('subtitle' + i).innerText = package.subtitle;

    // set description
    eval('description' + i).innerText = package.description;

    // set the highlights
    eval('highlightSection' + i).innerHTML = package.generateHighlightMarkup();

    // set CTA click context
    const cta = eval('CTA' + i);
    cta.firstChild.removeAttribute('href');
    cta.firstChild.innerText = package.CTA.text;
    cta.onclick = (e) => {
      package.CTA.onClick({
        product,
        package
      })
    }

    /**
     *  Set any/all remaining @ProductDefinition.{product}.{package} display here, below this comment.
     *  Before merging, move finalized code above this comment.
     */
  }
}

function getCurrentParamsObject() {
  const searchParams = new URL(window.location.href).searchParams;
  const paramsObject = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });
  return paramsObject;
}

/**
 * Initializes the pricing page
 */
function initialize () {
  initializeProductsDefinition();
}

function initializeCustomQuoteToolFor(selectedProductPackage) {
  document.getElementById('submission-form').style.display = 'none';
  const currentStepHiddenForm = () => document.getElementById('submission-form').querySelector('form')
  const addlElements = [
    { name: 'product_interest', value: selectedProductPackage.product.interest },
    { name: 'plan', value: selectedProductPackage.package.plan || selectedProductPackage.package.title } 
  ];

  function fieldsAreValid_byName(formFieldNames) {
    const allInputs = currentStepHiddenForm().querySelectorAll('input');
    const getByName = (name) => {
      for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].name === name) {
          return allInputs[i];
        }
      }
    }

    for (let i = 0; i < formFieldNames.length; i++) {
      const inputToValidate = getByName(formFieldNames[i]);
      if (inputToValidate && !(inputToValidate.value || '').trim()) { 
        return false;
      }
    }
    return true;
  }

  function validateAndTrySubmit(step) {
    step.syncForms();
    const formValid = fieldsAreValid_byName(step.formElements.map((e) => e.name));
    if (!formValid) {
      const errorContainer = errorMessage();
      errorContainer.style.display = 'block';
      errorContainer.firstChild.innerHTML = 'You must complete the form before submitting.'
      return;
    }
    $(currentStepHiddenForm()).submit();
    step.parent.goToNextStep();
  }


  
  function CustomQuoteToolStep(config) {
    const init = () => {
      let curForm = this.getCurrentForm();
      if (curForm && !curForm.stolen) {
        curForm = curForm.replaceWith(curForm.cloneNode(true));
        curForm = this.getCurrentForm();
        curForm.addEventListener('submit', (e) => { e.preventDefault(); });

        // set next button action
        const nextButton = this.getNextButton();
        if (nextButton) {
          nextButton.setAttribute('href', window.location.href)
          nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.parent.steps[this.index].onNext(this);
          });
        }

        // set previous button action
        const previousButton = this.getPreviousButton();
        if (previousButton) {
          previousButton.setAttribute('href', window.location.href)
          previousButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.parent.steps[this.index].onPrevious(this);
          })
        }

        curForm.action = currentStepHiddenForm().action;

        curForm.stolen = true;
      }
    }

    Object.assign(this, config );
    const self = this;

    /**
     * sets the hidden form to the form elements
     * @param {*} formItems 
     */
    this.setCustomerFormElements = (formItems) => {
      const dedupe = (elems) => {
        const hash = {};
        for (let i = 0; i < elems.length; i++) {
          hash[elems[i].name] = elems[i];
        }
        return Object.values(hash);
      }
      this.parent.formElements = dedupe([ ...this.parent.formElements, ...formItems, ...addlElements ]);
      self.formElements = dedupe(formItems);
      currentStepHiddenForm().innerHTML = '';
      formItems.forEach((formItem) => {
        const formElement = document.createElement('input');
        Object.keys(formItem).forEach((key) => {
          formElement.setAttribute(key, formItem[key])
        });
        const firstValue = (formItem.element || { value:'' }).value;
        formElement.setAttribute('value', firstValue || formItem.value);

        currentStepHiddenForm().appendChild(formElement)
      });
    }

    /**
     * syncs the hidden form and the display form
     * @returns form data
     */
    this.syncForms = () => {
      self.setCustomerFormElements(self.parent.formElements);
      const formItems = this.parent.formElements;
      const customerProperties = [];
      formItems.forEach((formItem) => {
        customerProperties.push({
          name: formItem.name,
          value: formItem.value || (formItem.element || { value:'' }).value
        })
      });

      currentStepHiddenForm().querySelectorAll('input').forEach((inputElement) => {
        const formElement = customerProperties.filter((prop) => inputElement.name === prop.name)[0];
        inputElement.value = (formElement || { value: '' }).value;
      });

    }

    this.getContainer = () => {
      return document.getElementById('pricing-step-' + (this.index + 1))
    }

    this.getCurrentForm = () => {
      return document.getElementById('step-' + (this.index + 1) + '-form')
    }
    this.getNextButton = () => {
      return document.getElementById('step-' + (this.index + 1) + (this.index === 0 ? '-btn' : '-next'))
    }
    this.getPreviousButton = () => {
      return document.getElementById('step-' + (this.index + 1) + '-previous')
    }

    init();
    return this;
  }

  function CustomQuoteTool(stepConfigs) {
    const self = this;
    this.formElements = []
    this.currentStepIndex = 0;
    this.steps = stepConfigs.map((stepConfig, i) => new CustomQuoteToolStep({ ...stepConfig, index: i, parent: this }));

    Object.defineProperty(this, 'stepNo', {
      get : function () { return self.currentStepIndex + 1 }
    });

    this.setModalProgressForStepNo = (stepNo) => {
      // set modal progress
      document.querySelector(`.step-message`).textContent = `Step ${stepNo} of ${this.steps.length}`;

      // set custom quote tool progress progress status (top of modal)
      const progressBarElem = document.getElementById('pricing-progress-bar');
      const progress = (progressBarElem || { firstChild: { style: { width: '0px' } } }).firstChild;
      progress.style.width = `${
        (progressBarElem.offsetWidth / 100) * ((100 / this.steps.length) * (this.stepNo))
      }px`;
    }

    this.showCurrentFormContainer = (stepNo, show) => {
      const container = document.getElementById(`pricing-step-${stepNo}`);
      container.style.display = (show !== false) ? 'block': 'none';
    }

    this.showStep = (stepIndex, show) => {

      if (show !== false) { // we're showing the current step to user
        this.setModalProgressForStepNo(stepIndex+1);

        this.showCurrentFormContainer(stepIndex+1, show);

        this.steps[stepIndex].getContainer().style.display = 'block';
        this.steps[stepIndex].initStep(this.steps[stepIndex])

        // hide others
        this.steps.forEach((_step, i) => {
          if (i === this.currentStepIndex) return;
          this.steps[i].getContainer().removeAttribute('style');
          this.steps[i].getContainer().style.display = 'none';
          this.showStep(i, false);
        });
      }
    }

    this.goToNextStep = () => {
      if (this.currentStepIndex < (this.steps.length - 1)) {
        this.currentStepIndex = this.currentStepIndex+1;
      } else {
        this.currentStepIndex = 0;
      }
      this.showStep(this.currentStepIndex)
    }

    this.goToPreviousStep = () => {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex = this.currentStepIndex-1;
      } else {
        this.currentStepIndex = 0;
      }
      this.showStep(this.currentStepIndex)
    }

    return this;
  }


  // show modal first, so elements are present on page
  showCustomQuoteToolModal();

  const customQuoteTool = new CustomQuoteTool([ //steps
    {
      // step 1: contact information
      initStep: (step) => {
        errorMessage().style.display = 'none'
        step.setCustomerFormElements([
          {
            name: 'firstname',
            type: 'text',
            element: document.getElementById('firstname')
          },
          {
            name: 'lastname',
            type: 'text', 
            element: document.getElementById('lastname')
          },
          {
            name: 'phone',
            type: 'text',
            element: document.getElementById('phone')
          },
          {
            name: 'company',
            type: 'text',
            element: document.getElementById('company')
          },
          {
            name: 'email',
            type: 'text',
            element: document.getElementById('email')
          },
        ]);
      },
      onNext: (step) => {
        validateAndTrySubmit(step);
      },
      onPrevious: (_step) => {
        //noop
      }
    },
    {
      // step 2: number of seats
      initStep: (step) => {
        const seatsElement = document.getElementById('seats');
        seatsElement.value = 1;
        step.setCustomerFormElements([
          {
            name: 'nes_seats',
            type: 'number',
            element: seatsElement
          }
        ]);
        const labelElem = step.getCurrentForm().querySelector('label[for=seats]');
        document.getElementById('seats').min = 1;
        labelElem.innerText = labelElem.innerText.replace('[product name]', selectedProductPackage.product.interest);
      },
      onNext: (step) => {
        validateAndTrySubmit(step);
      },
      onPrevious: (step) => {
        step.parent.goToPreviousStep();
      }
    },
    {
      initStep: (step) => {
        const seats = step.parent.formElements.filter((formElement) => formElement.name === 'seats')[0];
        const pricePerSeat = document.getElementById('price-per-seat');
        const pricePerSeatInfo = document.getElementById('price-per-seat-info');
        const detailSeats = document.getElementById('detail-seats');
        const priceInfo = document.getElementById('pricing-info');
        const detailBilled = document.getElementById('detail-billed');
        const detailProduct = document.getElementById('detail-product');
        const detailAdditional = document.getElementById('detail-additional');
        const calendarContainer = document.getElementById('calendar-container');
        const stepMessage = document.querySelector('.step-message');

        const anualPrice = formatPrice(calculatePrice(seats));
        if (anualPrice) {
          const pricePerSeatText = formatPrice(calculatePrice(seats) / seats);
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
          pricePerSeatInfo.style.display = 'none';
        }

        if (seats <= 4) {
          detailSeats.textContent = `Up to 4`;
          pricePerSeatInfo.textContent = 'per year';
          priceInfo.textContent = `Up to 4 total seats.`;
        } else {
          detailSeats.textContent = seats;
          pricePerSeatInfo.textContent = 'per seat/year';
          priceInfo.textContent = `$${anualPrice} for ${seats} total seat${
            seats > 1 ? 's' : ''
          }.`;
        }

        detailBilled.textContent = 'Annually';
        detailProduct.textContent = selectedProductPackage.product.interest;
        detailAdditional.textContent = '$1,000/year';

        currentStepHiddenForm().style.display = 'none';
        calendarContainer.style.display = 'none';
        stepMessage.textContent = `You're all set!`;
        showCalendar();
      },
      onNext: (step) => {
        // noop
      },
      onPrevious: (step) => {
        // document.getElementById('pricing-step-3').style.display = 'none'
        showCalendar(false)
        step.parent.goToPreviousStep();
      }
    }
  ])


  //set modal title
  productLabel.textContent = selectedProductPackage.product.interest;

  customQuoteTool.currentStepIndex = 0;
  // set first step
  customQuoteTool.showStep(customQuoteTool.currentStepIndex);

}

/**
 * Does 3 things:
 *  1. Initializes the ProductDefinition
 *  2. Attaches an event listener which calls @displaySelectedProduct for each 
 *     @ProductDefinition.{product} configuration, when the @ProductDefinition.{product}.toggle.element is clicked
 *  3. Selects @ProductDefinition.vue as the default product to display
 * @returns void
 */
function initializeProductsDefinition() {

  const ProductsDefinition = {
    angularjs: {
      interest: 'AngularJS NES',
      toggle: {
        element: document.querySelector('#angular-toggle'),
      },
      packages: [
        {
          title: 'Core',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angularjs.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Core + Essentials',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angularjs.packages[1].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Angular UI Router',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Angular UI Bootstrap',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'angular-filter',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'angular-local-storage',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'angular-moment',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'angular-translate',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'angular-translate-loader-static-files',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Protractor',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'ui-select',
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'ui-sortable',
            },
          ]
        },
      ]
    },
    angular: {
      interest: 'Angular NES',
      toggle: {
        element: document.querySelector('#nes-angular-toggle'),
        select: () => {}
      },
      packages: [
        {
          title: 'Corporate',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angular.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '4 seats – additional seats available'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Enterprise',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angular.packages[1].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Includes 100 seats'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Dedicated account manager'
            }
          ]
        },
      ]
    },
    vue: {
      interest: 'Vue NES',
      toggle: {
        element: document.querySelector('#vue-toggle'),
        select: () => {}
      },
      packages: [
        {
          title: 'Core',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.vue.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Core + Essentials',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => renderVueCoreEssentialsHighlights(ProductsDefinition.vue.packages[1].highlights),
          highlights: [
            {
              icon: 'https://herodevs.github.io/webflow/images/nuxt.png',
              text: 'Nuxt',
            },
            {
              icon: 'https://herodevs.github.io/webflow/images/Vuetify.png',
              text: 'Vuetify',
            },
            {
              icon: 'https://herodevs.github.io/webflow/images/BootstrapVue.png',
              text: 'BootstrapVue',
            },
            {
              icon: 'https://herodevs.github.io/webflow/images/vuejs.png',
              text: 'Vue Router',
            },
            {
              icon: 'https://herodevs.github.io/webflow/images/vuejs.png',
              text: 'Vuex',
            }
          ]
        },
      ]
    },
    protractor: {
      interest: 'Protractor NES',
      toggle: {
        element: document.querySelector('#protractor-toggle'),
      },
      packages: [
        {
          title: 'Corporate',
          subtitle: 'Free through Aug 2024',
          description: '',
          CTA: {
            text: 'Get A Free License',
            onClick: () => {
              window.location.href = `${window.location.origin}/support/nes-protractor#contact-us`;
            }
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.protractor.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '4 seats – additional seats available'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Enterprise',
          subtitle: 'Free through Aug 2024',
          description: '',
          CTA: {
            text: 'Get A Free License',
            onClick: () => {
              window.location.href = `${window.location.origin}/support/nes-protractor#contact-us`;
            }
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.protractor.packages[1].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Includes 100 seats'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Dedicated account manager'
            }
          ]
        },
      ]
    },
    nesBootstrap: {
      interest: 'Bootstrap NES',
      toggle: {
        element: document.querySelector('#bootstrap-toggle')
      },
      packages: [
        {
          title: 'Corporate',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angular.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '4 seats – additional seats available'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Enterprise',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angular.packages[1].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Includes 100 seats'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Dedicated account manager'
            }
          ]
        },
      ]
    },
    nesDrupal: {
      interest: 'Drupal NES',
      toggle: {
        element: document.querySelector('#drupal-toggle'),
      },
      packages: [
        {
          title: 'Drupal 7 Core',
          plan: 'Core',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat and number of sites.',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.nesDrupal.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Compatible with Linux distributions (such as Ubuntu and CentOS), Windows Server, MacOS Server'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Compatible with supported D7 versions'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Compatible with modern browsers'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Drupal 7 Essentials',
          plan: 'Core + Essentials',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat.',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.nesDrupal.packages[1].highlights),
          highlights: [
            {
              icon: '',
              text: '‍Our Drupal Essentials support coverage includes all contrib modules*.'
            },
            {
              icon: '',
              text: '*This excludes custom-modules, modules which break due to 3rd party APIs, closed-source / closed-license modules.'
            }
          ]
        },
      ]
    },
    jQuery: {
      interest: 'jQuery NES',
      toggle: {
        element: document.querySelector('#nes-jquery-toggle'),
        select: () => {}
      },
      packages: [
        {
          title: 'Corporate',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angular.packages[0].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '4 seats – additional seats available'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            }
          ]
        },
        {
          title: 'Enterprise',
          subtitle: 'Contact Sales for Pricing',
          description: 'Billed annually. Priced per seat',
          CTA: {
            text: 'Get A Custom Quote',
            onClick: defaultCTAClick
          },
          generateHighlightMarkup: () => defaultRenderPackageHighlights(ProductsDefinition.angular.packages[1].highlights),
          highlights: [
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Includes 100 seats'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Continuous vulnerability scanning'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Modern browser compatibility'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: '14-day critical patch SLA'
            },
            {
              icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
              text: 'Dedicated account manager'
            }
          ]
        },
      ]
    },
  }

  // do work for each product configuration
  Object.keys(ProductsDefinition).forEach((productKey) => {
    try {
      /**
       * Add a parent reference to each product for per-product portability
       */
      ProductsDefinition[productKey].parent = ProductsDefinition;

      /**
       * Register a callback with an event listener,
       *  for each of the keys of the @ProductsDefinition add click event listener, which, when clicked, displays content for the appropriate product
       */ 
      ProductsDefinition[productKey].toggle.element.addEventListener(
        'click',
        () => {
          window.sessionStorage.currentProduct = productKey;
          displaySelectedProduct(ProductsDefinition[productKey]);
        }
      );
    } catch (ex) {
      console.error('HERODEVS ERROR: fetching productKey: ' + productKey, ex);
    }
  })

  const currentProduct = ProductsDefinition[window.sessionStorage.currentProduct] || ProductsDefinition.vue;
  
  /**
   * select a default product 
   */
  displaySelectedProduct(currentProduct)
}

/**
 * Generates the highlights section for the Vue Core Essentials product,
 * an outlier in that there is a custom table under the CTA
 * @param {*} highlights 
 * @returns 
 */
function renderVueCoreEssentialsHighlights(highlights) {
  /**
   * `scope` ensures styles only apply to their own elements, when rendered
   * The reason for this is bc we are adding dynamic `<style>` tags to the page, which will 
   * affect anything else with the same class name. This ensures they're always unique to the 
   * elements they're meant to apply style to.
   */ 
  const scope = Date.now() + Math.floor(Math.random() * 100);
  const leftColumn = highlights.slice(0, 2);
  const rightColumn = highlights.slice(2, 5)
  
  const getColumn = items => {
    return `
    <div class="core-plus-column-${scope}">
      ${items
        .map(item => {
          const itemIcon = item.icon
            ? `<img src="${item.icon}" loading="lazy" width="20" alt="">`
            : `&nbsp;`;
          const itemName = item.text
            ? `<span class="pricing__bullet-text">${item.text}</span>`
            : ``;
          const className =
            item.icon && item.text ? `core-plus-cell-${scope}` : 'hider';
          return `
              <div class="${className}">
                ${itemIcon}
                ${itemName}
              </div>
            `;
        })
        .join('')}
    </div>
  `;
  };

  return `<style>
      .core-plus-parent-container-${scope} {
        
      }

      .core-plus-bullet-${scope} {
        text-align: center;
      }

      .core-plus-${scope} {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-auto-flow: row;
        border-radius: 10px 10px 10px 10px;
        margin-top: 1em;
        width: calc(100% + 18px);
      }
      
      .core-plus-column-${scope} {
        display: contents;
      }
      
      .core-plus-cell-${scope} {
        border: 1px solid #feeefd;
        text-align: left;
        padding: 15px 5px 5px 10px;
        line-height: .5em;
        white-space: nowrap;
      }


      @media screen and (max-width: 959px) {
        .core-plus-parent-container-${scope} {
          padding-right: 0 !important;
        }

        .core-plus-bullet-${scope} {
          margin: 0 10% 0 10%;
        }

        .core-plus-${scope} {
          grid-template-columns: repeat(1, 1fr) !important;
          grid-template-rows: repeat(6, 1fr) !important;
          width: 93% !important;
          margin: auto !important;
          margin-top: 1em !important;
        }

        .core-plus-column-${scope} .hider {
          display: none !important;
        }
        
        .core-plus-cell-${scope} {
          display: block !important;
          border: 1px solid #feeefd !important;
          padding: 15px 5px 5px 9% !important;
        }

        .core-plus-${scope} .core-plus-column-${scope}:first-child .core-plus-cell-${scope}:first-child {
          border-radius: 5px 5px 0 0 !important;
        }

        .core-plus-${scope} .core-plus-column-${scope}:first-child .core-plus-cell-${scope}:last-child {
          border-radius: 0 0 0 0 !important;
        }

        .core-plus-${scope} .core-plus-column-${scope}:last-child .core-plus-cell-${scope}:last-child {
          border-radius: 0 0 5px 5px !important;
        }

        .core-plus-${scope} .core-plus-column-${scope}:last-child .core-plus-cell-${scope}:first-child {
          border-radius: 0 0 0 0 !important;
        }
      }

    </style>

    <div class="bullet-container core-plus-parent-container-${scope}" style="padding-right: 0; display: block;">

      <div class="pricing__bullet-text core-plus-bullet-${scope}" style="white-space: normal">
        Everything in Core plus compatibility and security patching for:
      </div>

      
      <div class="core-plus-${scope}">
        ${getColumn(leftColumn)}
        ${getColumn(rightColumn)}
      </div>
    </div>`;

}

/**
 * Sets the currently selected product button in the left column of all products
 * @param {*} selectedProduct 
 */
function setSelectedProductToggle(selectedProduct) {

  /**
  * toggle classes: the columnar buttons down the left side of the page
  */
  const onToggle = {
    buttonClass: 'nes-toggle--active',
    textClass: 'toggle-text--active',
  };

  const offToggle = {
    buttonClass: 'nes-toggle--unactive',
    textClass: 'toggle-text--unactive',
  };

  function turnOnProductButtonFor(toggleElement) {
    toggleElement.classList.remove(offToggle.buttonClass);
    toggleElement.classList.add(onToggle.buttonClass);

    toggleElement.firstChild.classList.remove(offToggle.textClass);
    toggleElement.firstChild.classList.add(onToggle.textClass);
  }

  function turnOffProductButtonFor(toggleElement) {
    toggleElement.classList.remove(onToggle.buttonClass);
    toggleElement.classList.add(offToggle.buttonClass);

    toggleElement.firstChild.classList.remove(onToggle.textClass);
    toggleElement.firstChild.classList.add(offToggle.textClass);
  }

  const ProductsDefinition = selectedProduct.parent;
  Object.values(ProductsDefinition).forEach((anyDefinedProduct) => {
    if (anyDefinedProduct.interest === selectedProduct.interest) {
      turnOnProductButtonFor(selectedProduct.toggle.element);
    } else { 
      turnOffProductButtonFor(anyDefinedProduct.toggle.element);
    }
  });
  
}

/**
 * 
 * Hides/Shows the Custom Quote Tool Modal
 * @param {*} tf truthy/falsy value, determines whether to hide or show
 * @returns void
 */
function showCustomQuoteToolModal(show) {
  const hideBackdrop = () => showCustomQuoteToolModal(false)
  // handles to modal parts
  const pricingCalculatorModal = document.getElementById('pricing-calculator-modal');
  const pricingCalculatorModalBackdrop = document.querySelectorAll('.modal-backdrop')[0];
  const pricingModalCard = document.querySelectorAll('.modal-card')[0];

  if (show !== false) {
    pricingCalculatorModal.setAttribute('style', 'display: block !important');
    pricingCalculatorModalBackdrop.setAttribute('style', 'display: block !important');
    pricingModalCard.setAttribute('style', 'display: inline-block !important');
    pricingCalculatorModalBackdrop.addEventListener('click', hideBackdrop)
    return;
  }

  window.location.reload();
  pricingCalculatorModal.setAttribute('style', 'display: none !important');
  pricingCalculatorModalBackdrop.setAttribute('style', 'display: none !important');
  pricingModalCard.setAttribute('style', 'display: none !important');
  pricingCalculatorModalBackdrop.removeEventListener('click', hideBackdrop)
} 


/**
 * ------------------------------------------------------------------------------------------------------
 *  Section: INITIALIZATION
 * ----------------------------
 *  This alphabetized section declares helper functions needed to instantiate our @param ProductsDefintion. the
 *  which is then initialized (via @function initialize()).
 *  It is scoped to the global window
 * ------------------------------------------------------------------------------------------------------
 */

initialize();
