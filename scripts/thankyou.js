const calendarDisplayElement = document.getElementById('calendar-display-container');
const backButton = document.getElementById('thank-you-go-back');
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
calendarDisplayElement.innerHTML = calendarContainer.innerHTML;
const innerHeight = '875px';
const outerHeight = '900px';
calendarDisplayElement.querySelector('iframe').style.minHeight = innerHeight;
calendarDisplayElement.style.minHeight = outerHeight;
calendarDisplayElement.style.maxheight = outerHeight;

if (!document.referrer) {
  backButton.style.display = 'none';
} else {
  document.getElementById('thank-you-go-back').addEventListener('click', () => {
    window.history.back();
  });
}
