const LG_CONF = {
  INIT: '9cf0rr/herodevs-website',
  TRACK_STRING: 'LogRocket',
};

if (window.HD.IS_PROD) {
  window.LogRocket && window.LogRocket.init(LG_CONF.INIT);
  window.LogRocket &&
    window.LogRocket.getSessionURL(function (sessionURL) {
      window.analytics &&
        window.analytics.track(LG_CONF.TRACK_STRING, {
          sessionURL: sessionURL,
        });
    });
}
