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
