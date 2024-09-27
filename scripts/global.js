(async () => {
  console.log(`
██╗  ██╗███████╗██████╗  ██████╗ ██████╗ ███████╗██╗   ██╗███████╗
██║  ██║██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔════╝██║   ██║██╔════╝
███████║█████╗  ██████╔╝██║   ██║██║  ██║█████╗  ██║   ██║███████╗
██╔══██║██╔══╝  ██╔══██╗██║   ██║██║  ██║██╔══╝  ╚██╗ ██╔╝╚════██║
██║  ██║███████╗██║  ██║╚██████╔╝██████╔╝███████╗ ╚████╔╝ ███████║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝
`);
  window.HD = {
    IS_PROD:
      window.location.href.toLowerCase().indexOf('www.herodevs.com') > -1,
  };
  //LIB_SCRIPTS: ['log-rocket.js', 'hubspot.js'],
  const HD_CONF = {
    LIB_SCRIPTS: ['hubspot.js'],
    SCRIPT: {
      ENV: window.HD.IS_PROD ? 'main' : 'staging',
      PATH: `https://raw.githubusercontent.com/herodevs/webflow/${window.HD.IS_PROD ? 'main' : 'staging'}/scripts`,
    },
    FEATURES: [],
  };

  console.log(`BOOTING [${window.HD.IS_PROD ? 'PRODUCTION' : 'STAGING'}]`);

  // LOAD HELPERS
  for (let script of HD_CONF.LIB_SCRIPTS) {
    loadScript(script, `${HD_CONF.SCRIPT.PATH}/helpers/${script}`);
  }

  // LOAD FEATURES
  for (let { page, script } of HD_CONF.FEATURES) {
    if (page) {
      // CONDITIONALLY RENDER BASED ON PAGE
    } else {
      // LOAD FOR ALL PAGES
      loadScript(script, `${HD_CONF.SCRIPT.PATH}/features/${script}`);
    }
  }

  function loadScript(name, script) {
    console.log(`[${name}]: Loading`);
    $.ajax({
      type: 'GET',
      url: script,
      cache: false,
      error: () => console.error(`[${name}]: Loading failed`),
      success: data => {
        const scriptElem = document.createElement('script');
        scriptElem.innerHTML = data;
        scriptElem.setAttribute('type', 'text/javascript');
        document.body.appendChild(scriptElem);
        console.log(`[${name}]: Loaded`);
      },
    });
  }
})();
