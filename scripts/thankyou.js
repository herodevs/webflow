const backButton = document.getElementById('thank-you-go-back');

var html = `
  <iframe
    src="https://meetings.hubspot.com/josh-trainque/nes-round-robin"
    frameborder="0"
    style="width: 100%; height: 100%; min-height: 730px"
  />
`;
calendarContainer.innerHTML = html;
calendarDisplayElement.innerHTML = calendarContainer.innerHTML;


if (!document.referrer) {
  backButton.style.display = 'none';
} else {
  document.getElementById('thank-you-go-back').addEventListener('click', () => {
    window.history.back();
  });
}
