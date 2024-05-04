const originalColumns = [];
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
        parentClasses + ' ' + 'core-plus-parent-container',
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

    const parent =
      document.querySelector('.core-plus-bullet').parentElement.parentElement;
    const parentClasses = parent.getAttribute('class');
    if (!~parentClasses.indexOf('core-plus-parent-container')) {
      parent.setAttribute(
        'class',
        parentClasses + ' ' + 'core-plus-parent-container',
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
    'right-column-header',
  );
  leftPricingColumnHeader.innerText = 'Core';
  rightPricingColumnHeader.innerText = 'Core + Essentials';
  const productTheeStallion = ~window.location.href.indexOf('support/nes-vue')
    ? 'vue'
    : ~window.location.href.indexOf('support/nes-angularjs')
      ? 'angularjs'
      : '';

  setPricingColumnsBody(productTheeStallion);
} else {
  setPricingColumnsBody();
}
