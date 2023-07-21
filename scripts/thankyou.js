if (!document.referrer) {
  backButton.style.display = 'none';
} else {
  document.getElementById('thank-you-go-back').addEventListener('click', () => {
    window.history.back();
  });
}
