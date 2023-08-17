// Vue2 EOL
const vue2EOL = new Date('December 31, 2023 23:59:59').getTime();
const businessDayMilliseconds = 24 * 60 * 60 * 1000; // Assuming 24 hours per business day

const holidayCalendar = [
  // Add your holidays here
];

// Update the countdown every second
const countdownInterval = setInterval(() => updateCountdown(vue2EOL), 1000);

function calculateCountDownTime(targetDate) {
  const currentDate = new Date();
  const currentDateTimestamp = currentDate.getTime();
  const timeDifference = targetDate - currentDateTimestamp;

  const businessDays = calculateBusinessDaysRemaining();
  const hours = Math.floor(
    (timeDifference % businessDayMilliseconds) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return {
    businessDays,
    hours,
    minutes,
    seconds,
  };

  function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  function isHoliday(date) {
    // Check if the given date is a holiday based on your holiday calendar
    // Implement the logic to check against the list of holidays
    return false;
  }

  function calculateBusinessDaysRemaining() {
    let currentDateTimestamp = currentDate.getTime();

    let businessDays = 0;

    while (currentDateTimestamp < targetDate) {
      currentDate.setDate(currentDate.getDate() + 1);

      if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
        businessDays++;
      }

      currentDateTimestamp = currentDate.getTime();
    }

    return businessDays;
  }
}

function updateView(timeLeft, labels) {
  Object.values(timeLeft).forEach((date, index) => {
    const label = labels[index];
    label.textContent = date;
  });
}

function updateCountdown(targetDate) {
  const timeLeft = calculateCountDownTime(targetDate);
  const countDownDisplay = document.querySelectorAll(
    '[data-vue-eol-countdown-number]'
  );

  updateView(
    [timeLeft.businessDays, timeLeft.hours, timeLeft.minutes, timeLeft.seconds],
    countDownDisplay
  );
}

// Initial call to set up the countdown
updateCountdown(vue2EOL);
