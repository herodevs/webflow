const backButton = document.getElementById('thank-you-go-back');

const calendarDisplayElement = document.getElementById(
  'calendar-display-container'
);

const html = `
  <iframe
    src="https://meetings.hubspot.com/peter1250/nes-sdr-round-robin"
    frameborder="0"
    style="width: 100%; height: 100%; min-height: 730px"
  />
`;
calendarDisplayElement.innerHTML = html;

if (!document.referrer) {
  backButton.style.display = 'none';
} else {
  document.getElementById('thank-you-go-back').addEventListener('click', () => {
    window.history.back();
  });
}
