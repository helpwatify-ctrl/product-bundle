document.addEventListener("DOMContentLoaded", () => {
  // --- Dynamic Year ---
  document.getElementById("year").textContent = new Date().getFullYear();

  // --- 8 Hour Countdown Timer Logic ---
  const TIMER_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  const STORAGE_KEY = "bundle_offer_end_time";

  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function getEndTime() {
    let storedEndTime = localStorage.getItem(STORAGE_KEY);

    if (!storedEndTime) {
      // First visit: Set end time to now + 8 hours
      const newEndTime = Date.now() + TIMER_DURATION_MS;
      localStorage.setItem(STORAGE_KEY, newEndTime);
      return newEndTime;
    }

    // Check if expired
    if (Date.now() > parseInt(storedEndTime)) {
      // If expired, reset for another 8 hours from now
      // Alternatively, could be strictly looping based on modulo, but "restart after 8 hours" usually means reset on expire.
      const newEndTime = Date.now() + TIMER_DURATION_MS;
      localStorage.setItem(STORAGE_KEY, newEndTime);
      return newEndTime;
    }

    return parseInt(storedEndTime);
  }

  let endTime = getEndTime();

  function updateTimer() {
    const now = Date.now();
    let remainingTime = endTime - now;

    if (remainingTime <= 0) {
      // Timer finished, restart instantly
      endTime = Date.now() + TIMER_DURATION_MS;
      localStorage.setItem(STORAGE_KEY, endTime);
      remainingTime = TIMER_DURATION_MS;
    }

    // Calculate hours, minutes, seconds
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Update DOM with zero-padding
    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = minutes.toString().padStart(2, "0");
    secondsEl.textContent = seconds.toString().padStart(2, "0");
  }

  // Initialize an update immediately, then every second
  updateTimer();
  setInterval(updateTimer, 1000);
});
