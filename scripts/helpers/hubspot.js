(async () => {
  const HS_CONF = {
    ACTION: 'https://api.hsforms.com',
    REDIRECT_RULES: [],
  };

  $(`form[action^="${HS_CONF.ACTION}"]`).each(function (i) {
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

      if (window.HD.IS_PROD) {
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
        input => input.name === 'goToWebinarWebinarKey',
      )?.value; // looks for an input with the name goToWebinarWebinarKey
      const sfdcCampaignId = parsedFormData.find(
        input => input.name === 'sfdcCampaignId',
      )?.value; // looks for an input with the name sfdcCampaignId
      const hutk =
        document.cookie.replace(
          /(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
          '$1',
        ) || undefined; // looks for an input with the name hutk, the hubspot user token
      //console.log(hutk)
      const processingPrompt = $(this).find("[id*='gdpr-processing-prompt']"); // looks for an element with the id gdpr-processing-prompt
      const communicationConsent = parsedFormData
        .filter(item => item.name.includes('LEGAL_CONSENT'))
        .map(item => {
          // finds LEGAL_CONSENT options and stores them
          const element = $(
            `#${item.name.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1')}`,
          )[0]; // checks if they've checked the checkbox to consent
          const label = $(
            "span[for='" +
              $(element)
                .attr('id')
                .replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1') +
              "']",
          ); // gets the label of the checkbox
          return {
            value: element.checked,
            text: label.text(),
            subscriptionTypeId: parseInt(
              item.name.split('LEGAL_CONSENT.subscription_type_')[1],
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
            !ignoredFields.find(ignoredField =>
              item.name.includes(ignoredField),
            ),
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
      const theUrl = `${e.target.action}?_=${Date.now()}`;

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
                ((isOnURL('/support') || isOnURL('/contact')) &&
                  !isOnURL('support/disclosures')) ||
                isOnURL('jw-test')
              ) {
                document.location.href = '../thank-you';
              } else if (isOnURL('/newsletter-archive')) {
                document.location.href = './form-submitted-newsletter-signup';
              } else if (isOnURL('/our-partners')) {
                document.location.href = './form-submitted-partners-thank-you';
              } else if (isOnURL('/blog-posts/')) {
                document.location.href = '../form-submitted-newsletter-signup';
              } else if (isOnURL('/vulnerability-directory/')) {
                document.location.href = '../vulnerability-alerts-signup';
              } else if (isOnURL('/vulnerability-directory')) {
                document.location.href = './vulnerability-alerts-signup';
              } else if (isOnURL('/pricing')) {
                document.location.href = './thank-you';                
              } else if (isOnURL('drupal-7-channel-partners')) {
                document.location.href = './form-submitted-partners';
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
})();
