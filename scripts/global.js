console.log('!!!!!!!!!!!!!!HERODEVS: BOOTING GLOBAL SCRIPT!!!!!!!!!!!!!!!!')
let GLOBALJS_IS_PRODUCTION = window.location.href.indexOf('www.herodevs.com') > 0 ? true : false;

if (GLOBALJS_IS_PRODUCTION) {
  window.LogRocket && window.LogRocket.init('9cf0rr/herodevs-website');
  window.LogRocket &&
    window.LogRocket.getSessionURL(function (sessionURL) {
      window.analytics &&
        window.analytics.track('LogRocket', {
          sessionURL: sessionURL,
        });
    });
}

$('form[action^="https://api.hsforms.com"]').each(function (i) {
  // intercept forms whos action goes to hubspot
  $(this).find('input[type=checkbox]').val('true');
  $(this).submit(function (e) {
    // when the form submits
    e.preventDefault(); //stop the form from submitting to webflow
    console.log({ target: e.target });
    const formData = new FormData(e.target); // get the form data
    console.log({ formData: formData.entries() });
    const parsedFormData = [...formData.entries()].map(dataObject => ({
      // convert data to array
      name: dataObject[0], // make sure the name of the input is the same as the hubspot input name
      value: dataObject[1], // the value of the input
    }));

    for (let i = 0; i < parsedFormData.length; i++) {
      if (parsedFormData[i] && parsedFormData[i].name === 'nes_seats') {
        parsedFormData[i].value = +parsedFormData[i].value;
      }
    }

    console.log(parsedFormData);

    const formDataAsObject = parsedFormData.reduce((acc, current) => {
      let newAcc = { ...acc };
      newAcc[current.name] = current.value;
      return newAcc;
    }, {});

    if (GLOBALJS_IS_PRODUCTION) {
      LogRocket.identify(formDataAsObject.email, {
        name: formDataAsObject.firstname + ' ' + formDataAsObject.lastname,
        email: formDataAsObject.email,

        // Add your own custom user variables here
        company: formDataAsObject.company,
        phone: formDataAsObject.phone,
        plan: formDataAsObject.plan,
      });
    }

    const goToWebinarWebinarKey = parsedFormData.find(
      input => input.name === 'goToWebinarWebinarKey'
    )?.value; // looks for an input with the name goToWebinarWebinarKey
    const sfdcCampaignId = parsedFormData.find(
      input => input.name === 'sfdcCampaignId'
    )?.value; // looks for an input with the name sfdcCampaignId
    const hutk =
      document.cookie.replace(
        /(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      ) || undefined; // looks for an input with the name hutk, the hubspot user token
    //console.log(hutk)
    const processingPrompt = $(this).find("[id*='gdpr-processing-prompt']"); // looks for an element with the id gdpr-processing-prompt
    const communicationConsent = parsedFormData
      .filter(item => item.name.includes('LEGAL_CONSENT'))
      .map(item => {
        // finds LEGAL_CONSENT options and stores them
        const element = $(
          `#${item.name.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1')}`
        )[0]; // checks if they've checked the checkbox to consent
        const label = $(
          "span[for='" +
            $(element)
              .attr('id')
              .replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1') +
            "']"
        ); // gets the label of the checkbox
        return {
          value: element.checked,
          text: label.text(),
          subscriptionTypeId: parseInt(
            item.name.split('LEGAL_CONSENT.subscription_type_')[1]
          ), // the subscription the user is consenting to
        };
      });
    const ignoredFields = [
      'cc-num',
      'cc-number',
      'gdpr',
      'LEGAL_CONSENT',
      'goToWebinarWebinarKey',
      'sfdcCampaignId',
    ];
    const data = {
      // the data we send to hubspot
      fields: parsedFormData.filter(
        item =>
          !ignoredFields.find(ignoredField => item.name.includes(ignoredField))
      ), // set the form data but ignore certain fields
      context: {
        pageUri: window.location.href, // log the current url
        pageName: document.title, // log the pages title
        sfdcCampaignId: sfdcCampaignId, // salesforce campaign id
        goToWebinarKey: goToWebinarWebinarKey, // go to meeting key
        hutk: hutk, // hubspot user token
      },
      ...(!processingPrompt
        ? {}
        : {
            legalConsentOptions: {
              consent: {
                ...(!processingPrompt
                  ? {}
                  : {
                      consentToProcess: true,
                      text: processingPrompt.text(),
                    }),
                ...(!communicationConsent
                  ? {}
                  : {
                      communications: communicationConsent,
                    }),
              },
            },
          }),
    };

    const final_data = JSON.stringify(data); // turn that javascript object into a json string
    const theUrl = `${e.target.action}?_=${Date.now()}`
    $.ajax({
      url: theUrl,
      method: 'POST',
      data: final_data,
      contentType: 'application/json',
      success: function (response, status, xhr) {
        function isOnURL(url) {
          return !!~window.location.href.indexOf(url);
        }
        console.log('url', theUrl);
        if (response) {
          // if response inline, display contents
          if (response.inlineMessage) {
            /**
             * page is NOT disclosures
             */
            if (
              (
                (isOnURL('/support') || isOnURL('/contact')) &&
                !isOnURL('support/disclosures')
              ) || isOnURL('jw-test')
            ) {
              document.location.href = '../thank-you';
            } else if (isOnURL('/newsletter-archive')) {
              document.location.href = './form-submitted-newsletter-signup';
            } else if (isOnURL('/our-partners')) {
              document.location.href = './form-submitted-partners-thank-you';
            } else if (isOnURL('support/disclosures')) {
              /**
               * page IS disclosures
               */
              const parent = $(e.target).parent();
              parent.children('form').css('display', 'none'); // hide form
              let ms = 5000;
              const reset = function (seconds) {
                return '<p>Resetting form in ' + seconds + ' seconds</p>';
              };
              parent
                .children('.w-form-done')
                .css('display', 'block')
                .html(response.inlineMessage + reset(ms / 1000));

              const interval = setInterval(function () {
                if (ms === 1000) {
                  window.location.reload();
                  return clearInterval(interval);
                }
                ms = ms - 1000;
                const message = response.inlineMessage + reset(ms / 1000);
                parent.children('.w-form-done').html(message);
              }, 1000);
            }
          }
        } else {
          console.log('response but no inlineMessage or redirectUri');
        }
      },
      error: function () {
        console.log('error on the form submitting');
        $(e.target)
          .css('display', 'none')
          .siblings('.w-form-fail')
          .css('display', 'block'); // replace .w-form-fail with your own form done section
      },
    });
  });
});

// const pricingColumnNodes = document.querySelectorAll('.pricing__bullet-list');
const originalColumns = [];
// pricingColumnNodes.forEach(n => originalColumns.push(n.cloneNode(true)));

function setPricingColumnsBody(theSelectedProduct) {
  const columns = document.querySelectorAll('.pricing__bullet-list');
  const leftColumn = columns[0];
  const rightColumn = columns[1];
  const leftBullets = [
    'Continuous vulnerability scanning',
    'Modern browser compatibility',
    '14-day critical patch SLA',
  ].map(bullet => {
    return `
      <div class="bullet-container">
        <img src="https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg" loading="lazy" width="20" alt="" class="pricing-checkmark">
        <div class="pricing__bullet-text">${bullet}</div>
      </div>
    `;
  });

  if (theSelectedProduct === 'vue') {

    leftColumn.innerHTML = leftBullets.join('');

    const right_leftBulletItems = [
      {
        icon: 'https://herodevs.github.io/webflow/images/nuxt.png',
        name: 'Nuxt',
      },
      {
        icon: 'https://herodevs.github.io/webflow/images/Vuetify.png',
        name: 'Vuetify',
      },
      { icon: '', name: '' },
    ];
    const right_rightBulletItems = [
      {
        icon: 'https://herodevs.github.io/webflow/images/BootstrapVue.png',
        name: 'BootstrapVue',
      },
      {
        icon: 'https://herodevs.github.io/webflow/images/vuejs.png',
        name: 'Vue Router',
      },
      {
        icon: 'https://herodevs.github.io/webflow/images/vuejs.png',
        name: 'Vuex',
      },
    ];

    const getColumn = items => {
      return `
        <div class="core-plus-column">
        ${items
          .map(item => {
            const itemIcon = item.icon
              ? `<img src="${item.icon}" loading="lazy" width="20" alt="">`
              : `&nbsp;`;
            const itemName = item.name
              ? `<span class="pricing__bullet-text">${item.name}</span>`
              : ``;
            const className =
              item.icon && item.name ? `core-plus-cell` : 'hider';
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

    rightColumn.innerHTML = `
      <style>

        .core-plus-parent-container {
          padding-right: 50px !important;
        }

        .core-plus-bullet {
          text-align: center;
        }

        .core-plus {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          grid-auto-flow: column;
          border-radius: 10px 10px 10px 10px;
          margin-top: 1em;
          width: calc(100% + 18px);
        }
        
        .core-plus-column {
          display: contents;
        }
        
        .core-plus-cell {
          border: 1px solid #feeefd;
          text-align: left;
          padding: 15px 5px 5px 10px;
          line-height: .5em;
          white-space: nowrap;
        }

        .core-plus .core-plus-column:first-child .core-plus-cell:first-child {
          border-radius: 5px 0 0 0;
          border-right: 0;
        }
        .core-plus .core-plus-column:first-child .core-plus-cell:last-child {
          border-radius: 0 0 0 5px;
          border-right: 0;
        }

        .core-plus .core-plus-column:first-child .core-plus:nth-of-type(2) {
          border-right: 0;
        }

        .core-plus .core-plus-column:last-child .core-plus-cell:last-child {
          border-radius: 0 0 5px 0;
          border-top: 0;
        }

        .core-plus .core-plus-column:last-child .core-plus-cell:first-child {
          border-radius: 0 5px 0 0;
        }

        @media screen and (max-width: 959px) {
          .core-plus-parent-container {
            padding-right: 0 !important;
          }

          .core-plus-bullet {
            margin: 0 10% 0 10%;
          }

          .core-plus {
            grid-template-columns: repeat(1, 1fr) !important;
            grid-template-rows: repeat(6, 1fr) !important;
            width: 93% !important;
            margin: auto !important;
            margin-top: 1em !important;
          }

          .core-plus-column .hider {
            display: none !important;
          }
          
          .core-plus-cell {
            border: 1px solid #feeefd !important;
            padding: 15px 5px 5px 9% !important;
          }

          .core-plus .core-plus-column:first-child .core-plus-cell:first-child {
            border-radius: 5px 5px 0 0 !important;
          }

          .core-plus .core-plus-column:first-child .core-plus-cell:last-child {
            border-radius: 0 0 0 0 !important;
          }

          .core-plus .core-plus-column:last-child .core-plus-cell:last-child {
            border-radius: 0 0 5px 5px !important;
          }

          .core-plus .core-plus-column:last-child .core-plus-cell:first-child {
            border-radius: 0 0 0 0 !important;
          }
        }

      </style>

      <div class="bullet-container" style="padding-right: 0; display: block;">

        <div class="pricing__bullet-text core-plus-bullet" style="white-space: normal">
          Everything in Core plus compatibility and security patching for:
        </div>

        
        <div class="core-plus">
          ${getColumn(right_leftBulletItems)}
          ${getColumn(right_rightBulletItems)}
        </div>
      </div>

    `;
    const parent =
      document.querySelector('.core-plus-bullet').parentElement.parentElement;
    const parentClasses = parent.getAttribute('class');
    if (!~parentClasses.indexOf('core-plus-parent-container')) {
      parent.setAttribute(
        'class',
        parentClasses + ' ' + 'core-plus-parent-container'
      );
    }
  } else if (theSelectedProduct === 'angularjs') {
    const leftBullets = [
      'Continuous vulnerability scanning',
      'Modern browser compatibility',
      '14-day critical patch SLA',
    ].map(bullet => {
      return `
        <div class="bullet-container">
          <img src="https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg" loading="lazy" width="20" alt="" class="pricing-checkmark">
          <div class="pricing__bullet-text">${bullet}</div>
        </div>
      `;
    });

    // Angular UI Components
      // Angular UI Bootstrap
      // angular-filter
      // angular-local-storage
      // angular-moment
      leftColumn.innerHTML = leftBullets.join('');
      const right_leftBulletItems = [
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'Angular UI Router',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'Angular UI Bootstrap',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'angular-filter',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'angular-local-storage',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'angular-moment',
        },
      ];
      // angular-translate
      // angular-translate-loader-static-files
      // Protractor
      // ui-select
      // ui-sortable
      const right_rightBulletItems = [
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'angular-translate',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'angular-translate-loader-static-files',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'Protractor',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'ui-select',
        },
        {
          icon: 'https://assets.website-files.com/62865614b39c464b76d339aa/63fe08dd56f1ef2552260c0c_check_circle.svg',
          name: 'ui-sortable',
        },
      ];

    const getColumn = items => {
      return `
        <div class="core-plus-column">
          ${items
            .map(item => {
              const itemIcon = item.icon
                ? `<img src="${item.icon}" loading="lazy" width="20" alt="">`
                : `&nbsp;`;
              const itemName = item.name
                ? `<span class="pricing__bullet-text">${item.name}</span>`
                : ``;
              const className =
                item.icon && item.name ? `core-plus-cell` : 'hider';
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

    rightColumn.innerHTML = `
      <style>

        .core-plus-parent-container {
          padding-right: 50px !important;
        }

        .core-plus-bullet {
          text-align: center;
        }

        .core-plus {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          grid-template-rows: repeat(10, 1fr);
          grid-auto-flow: column;
          border-radius: 10px 10px 10px 10px;
          margin-top: 1em;
          width: calc(100% + 18px);
        }
        
        .core-plus-column {
          display: contents;
        }
        
        .core-plus-cell {
          text-align: left;
          padding: 15px 5px 5px 10px;
          line-height: .5em;
          white-space: nowrap;
        }

        .core-plus .core-plus-column:first-child .core-plus-cell:first-child {
          border-radius: 5px 0 0 0;
          border-right: 0;
          border-bottom: 0;
        }

        .core-plus .core-plus-column:first-child .core-plus-cell:last-child {
          border-radius: 0 0 0 5px;
          border-top: 0;
          border-right: 0;
        }

        .core-plus .core-plus-column:first-child .core-plus:nth-of-type(2) {
          border-right: 0;
        }

        .core-plus .core-plus-column:last-child .core-plus-cell:last-child {
          border-radius: 0 0 5px 0;
          border-top: 0;
        }

        .core-plus .core-plus-column:last-child .core-plus-cell:first-child {
          border-radius: 0 5px 0 0;
          border-bottom: 0;
        }

        @media screen and (max-width: 959px) {
          .core-plus-parent-container {
            padding-right: 0 !important;
          }

          .core-plus-bullet {
            margin: 0 10% 0 10%;
          }

          .core-plus {
            grid-template-columns: repeat(1, 1fr);
            grid-template-rows: repeat(10, 1fr);
            width: 93% !important;
            margin: auto !important;
            margin-top: 1em !important;
          }

          .core-plus-column .hider {
            display: none !important;
          }
          
          .core-plus-cell {
            display: block !important;
            padding: 15px 5px 5px 9% !important;
          }

          .core-plus .core-plus-column:first-child .core-plus-cell:first-child {
            border-radius: 5px 5px 0 0 !important;
          }

          .core-plus .core-plus-column:first-child .core-plus-cell:last-child {
            border-radius: 0 0 0 0 !important;
          }

          .core-plus .core-plus-column:last-child .core-plus-cell:last-child {
            border-radius: 0 0 5px 5px !important;
          }

          .core-plus .core-plus-column:last-child .core-plus-cell:first-child {
            border-radius: 0 0 0 0 !important;
          }
        }

      </style>

      <div class="bullet-container" style="padding-right: 0; display: block;">

        <div class="pricing__bullet-text core-plus-bullet" style="white-space: normal">
          Everything in Core plus compatibility and security patching for:
        </div>

        
        <div class="core-plus">
          ${getColumn(right_leftBulletItems.concat(right_rightBulletItems))}

        </div>
      </div>

    `;

    const parent = document.querySelector('.core-plus-bullet').parentElement.parentElement;
    const parentClasses = parent.getAttribute('class');
    if (!~parentClasses.indexOf('core-plus-parent-container')) {
      parent.setAttribute(
        'class',
        parentClasses + ' ' + 'core-plus-parent-container'
      );
    }
    
  } else {
    // pricingColumnNodes.forEach((column, i) => {
    //   column.innerHTML = originalColumns[i].innerHTML;
    // });
  }
  //
}
if (
  ~window.location.href.indexOf('support/nes-vue') ||
  ~window.location.href.indexOf('support/nes-angularjs')
) {
  const leftPricingColumnHeader = document.getElementById('left-column-header');
  const rightPricingColumnHeader = document.getElementById(
    'right-column-header'
  );
  leftPricingColumnHeader.innerText = 'Core';
  rightPricingColumnHeader.innerText = 'Core + Essentials';
  const productTheeStallion = ~window.location.href.indexOf('support/nes-vue') ? 'vue' :
    ~window.location.href.indexOf('support/nes-angularjs') ? 'angularjs': '';

  setPricingColumnsBody(productTheeStallion);
} else {
  setPricingColumnsBody();
}

// Hide CTA's on header when stuck
(function () {
  createStuckCSSClass();
  const navbar = document.getElementById('Navbar');

  // Set sentinel on body after the navbar
  const sentinel = (function putSentinel(debugMode) {
    const sentinelElement = generateSentinelElement();
    insertBefore(sentinelElement, navbar);

    return sentinelElement;

    function generateSentinelElement() {
      const sentinelEl = document.createElement('div');
      sentinelEl.style.height = '100px';
      sentinelEl.style.width = '100%';
      sentinelEl.style.position = 'absolute';
      sentinelEl.style.visibility = 'hidden';

      if (debugMode) {
        sentinelEl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        sentinelEl.style.visibility = 'unset';
        sentinelEl.style.zIndex = 10000000;
      }

      return sentinelEl;
    }

    function insertBefore(el, referenceNode) {
      referenceNode.parentNode.insertBefore(el, referenceNode);
    }
  })();

  const observer = new IntersectionObserver(records => onAppears(records), {
    threshold: [0, 1],
  });

  observer.observe(sentinel);

  function onAppears(entries) {
    if (entries[0].intersectionRatio === 0) {
      navbar.classList.add('stuck');
    } else if (entries[0].intersectionRatio === 1) {
      navbar.classList.remove('stuck');
    }
  }

  function createStuckCSSClass() {
    const stuckStyle = document.createElement('style');
    stuckStyle.innerHTML = `
      .stuck [data-hide-when-stuck] { 
        display: none;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(stuckStyle);
  }
})();
