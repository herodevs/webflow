const IS_PRODUCTION = window.location.href.indexOf('www.herodevs.com') > 0 ? true : false;

if (IS_PRODUCTION) {
  window.LogRocket && window.LogRocket.init('9cf0rr/herodevs-website');
  window.LogRocket && window.LogRocket.getSessionURL(function (sessionURL) {
    window.analytics && window.analytics.track('LogRocket', {
      sessionURL: sessionURL,
    });
  });
}

$('form[action^="https://api.hsforms.com"]').each(function (i) { // intercept forms whos action goes to hubspot
$(this).find("input[type=checkbox]").val("true")
$(this).submit(function (e) { // when the form submits
    e.preventDefault() //stop the form from submitting to webflow
    console.log({ target: e.target });
    const formData = new FormData(e.target) // get the form data
    console.log({ formData: formData.entries() })
    const parsedFormData = [...formData.entries()].map(dataObject => ({ // convert data to array
        name: dataObject[0], // make sure the name of the input is the same as the hubspot input name
        value: dataObject[1]  // the value of the input
    }))
    
    try {
      if (pricingSelected) {
        let plan = pricingSelected;
        if (selectedProduct && selectedProduct === 'vue'){ 
          plan = pricingSelected.toLowerCase().trim() === 'corporate' ?
            'Core':
            'Core + Essentials';
        }
        const extraData = { name: 'plan', value: plan };
        parsedFormData.push(extraData)
      }
    } catch (err) {
      console.log('We have no pricingSelected on this page.');
    }
  
    try {
      if (selectedProduct) {
        const products = {
          vue: "NES Vue",
          protractor: "NES Protractor",
          boostrap: "NES Bootstrap",
          spring: "NES Spring",
          drupal: "NES Drupal",
          something: "Something Else",
          endbridge: "Endbridge",
          other: "Other",
        }
        const productValueName = products[selectedProduct];
        console.log({ productValueName })
        const extraData = { name: 'product_interest', value: productValueName };
        parsedFormData.push(extraData);
      }
    } catch (err) {
      console.log('We have no selectedProduct on this page.');
    }

    console.log(parsedFormData);

    const formDataAsObject = parsedFormData.reduce((acc, current) => {
      let newAcc = {...acc }
      newAcc[current.name] = current.value;
      return newAcc;
    }, {});

    if (IS_PRODUCTION) {
      LogRocket.identify(formDataAsObject.email, {
        name: formDataAsObject.firstname + ' ' + formDataAsObject.lastname,
        email: formDataAsObject.email,

        // Add your own custom user variables here
        company: formDataAsObject.company,
        phone: formDataAsObject.phone,
        plan: formDataAsObject.plan
      });
    }

    const goToWebinarWebinarKey = parsedFormData.find(input => input.name === 'goToWebinarWebinarKey')?.value // looks for an input with the name goToWebinarWebinarKey
    const sfdcCampaignId = parsedFormData.find(input => input.name === 'sfdcCampaignId')?.value// looks for an input with the name sfdcCampaignId
    const hutk = document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, "$1") || undefined // looks for an input with the name hutk, the hubspot user token
    //console.log(hutk)
    const processingPrompt = $(this).find("[id*='gdpr-processing-prompt']")// looks for an element with the id gdpr-processing-prompt
    const communicationConsent = parsedFormData
      .filter(item => item.name.includes('LEGAL_CONSENT')).map(item => { // finds LEGAL_CONSENT options and stores them
        const element = $(`#${item.name.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1")}`)[0] // checks if they've checked the checkbox to consent
        const label = $("span[for='" + $(element).attr('id').replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1") + "']") // gets the label of the checkbox
        return {
            value: element.checked,
            text: label.text(),
            subscriptionTypeId: parseInt(item.name.split("LEGAL_CONSENT.subscription_type_")[1]) // the subscription the user is consenting to
        }
      })
    const ignoredFields = ["cc-num", "cc-number", "gdpr", "LEGAL_CONSENT", "goToWebinarWebinarKey", "sfdcCampaignId"]
    const data = { // the data we send to hubspot
      fields: parsedFormData.filter(item => !ignoredFields.find(ignoredField => item.name.includes(ignoredField))), // set the form data but ignore certain fields
      context: {
        pageUri: window.location.href, // log the current url
        pageName: document.title, // log the pages title
        sfdcCampaignId: sfdcCampaignId, // salesforce campaign id
        goToWebinarKey: goToWebinarWebinarKey, // go to meeting key
        hutk: hutk, // hubspot user token
      },
      ...(!processingPrompt) ? {} : {
        legalConsentOptions: {
          consent: {
            ...(!processingPrompt) ? {} : {
              consentToProcess: true,
              text: processingPrompt.text(),
            },
            ...(!communicationConsent) ? {} : {
              communications: communicationConsent
            }
          }
        }
      }
    };

    const final_data = JSON.stringify(data); // turn that javascript object into a json string

    $.ajax({
      url: e.target.action,
      method: "POST",
      data: final_data,
      contentType: "application/json",
      success: function (response) {
        if (response) {
          // if response inline, display contents
          if (response.inlineMessage) {

            /**
             * page is NOT disclosures
             */
            if (!~window.location.href.indexOf('support/disclosures')) {
              const calendarContainer = document.getElementById('calendar-container');
              const current = new Date();
              const html = `
                <iframe
                 src="https://calendly.com/jtrainque/30min-1?embed_domain=hero-devs-24601.webflow.io&embed_type=Inline&hide_gdpr_banner=1&month=${current.getFullYear()}-${current.getMonth() + 1}"
                 frameborder="0"
                 style="width: 100%; height: 100%; min-height: 500px"
                />
              `;
              calendarContainer.innerHTML = html;
              const contactFormContainer = document.getElementById('general-contact-form');
              contactFormContainer.innerHTML = html;
              const innerHeight = '875px';
              const outerHeight = '900px'
              contactFormContainer.querySelector('iframe').style.minHeight = innerHeight;
              contactFormContainer.style.minHeight = outerHeight;
              contactFormContainer.style.maxheight = outerHeight;
            } else {
              /**
               * page IS disclosures
               */
              const parent = $(e.target).parent();
              parent.children("form").css("display", "none"); // hide form
              let ms = 5000;
              const reset = function(seconds) { 
                return '<p>Resetting form in ' + seconds + ' seconds</p>'
              }
              parent.children(".w-form-done").css("display", "block").html(response.inlineMessage + reset(ms/1000));
  
              const interval = setInterval(function() {
                if (ms === 1000) {
                  window.location.reload();
                  return clearInterval(interval);
                }
                ms = ms - 1000
                const message = response.inlineMessage + reset(ms/1000);
                parent.children(".w-form-done").html(message);
              }, 1000);
            }
          }
        } else {
          console.log('response but no inlineMessage or redirectUri')
        }
      },
      error: function () {
        console.log("error on the form submitting")
        $(e.target).css('display', 'none').siblings('.w-form-fail').css('display', 'block') // replace .w-form-fail with your own form done section
      }
    });
  });
})