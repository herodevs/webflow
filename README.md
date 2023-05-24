# Webflow

This repo is a collection of scripts that power webflow herodevs.com site interactions.


## Scripts

### `/scripts/pricing.js`

This script drives interactions on the `herdevs.com/pricing` page. It primarily does 3 things:

1. controls the product toggle and subsequent pricing wells
  - includes some verbiage
2. controls the modals that open when clicking the CTAs in the pricing wells
  - includes setting modal display properties before showing (separately from settings within webflow)
3. controls the form stepper modal interactions and submission
  - users are walked through a series of form inputs a'la stepper, which is controlled/determined via url params which are controlled/read/handled within this script

### `/scripts/global.js`



### `/scripts/_support.js` (NOT CURRENTLY USED)

This script drives interactions on the `herdevs.com/support/*` pages. Where it is included in the page in webflow, there are 2 properties needed in order to drive this script:

1. `id` 
  - This is needed in webflow so that the script can, at runtime, find the script element and read the `data-product` attribute value, which corresponds to the appropriate `product_interest` value from Hubspot
2. `data-product`
  - This is the Hubspot product value for a give `product_interest`

The script is activated/runs when a user clicks the CTAs on any of the `support/*` pages. When it runs, the script uses the `id` attribute of the `<script>` tag that included it, and reads the `data-product` attribute of that `<script>` tag. The script will then add the value of that `data-product` attribute to the form, as hidden inputs, to then be submitted when the user completes the form.
