(function () {
  const timers = new WeakMap();

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function setTimerValues(banner, days, hours, minutes, seconds) {
    const daysEl = banner.querySelector('[data-promo-days]');
    const hoursEl = banner.querySelector('[data-promo-hours]');
    const minutesEl = banner.querySelector('[data-promo-minutes]');
    const secondsEl = banner.querySelector('[data-promo-seconds]');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  function msToParts(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    totalSeconds = Math.floor(totalSeconds / 60);
    const minutes = totalSeconds % 60;
    totalSeconds = Math.floor(totalSeconds / 60);
    const hours = totalSeconds % 24;
    const days = Math.floor(totalSeconds / 24);

    return { days, hours, minutes, seconds };
  }

  function getLoopDurationMs(banner) {
    const days = parseInt(banner.dataset.loopDays || '0', 10) || 0;
    const hours = parseInt(banner.dataset.loopHours || '0', 10) || 0;
    return (days * 24 + hours) * 60 * 60 * 1000;
  }

  function getTargetDate(banner) {
    if (banner.dataset.countdownLoop === 'true') {
      const duration = getLoopDurationMs(banner);
      if (duration <= 0) return null;

      const start = banner.dataset.loopStart ? new Date(banner.dataset.loopStart) : new Date();
      if (Number.isNaN(start.getTime())) return null;

      const elapsed = Date.now() - start.getTime();
      if (elapsed < 0) return new Date(start.getTime() + duration);

      const cycles = Math.floor(elapsed / duration);
      return new Date(start.getTime() + (cycles + 1) * duration);
    }

    if (!banner.dataset.countdownEnd) return null;

    const end = new Date(banner.dataset.countdownEnd);
    return Number.isNaN(end.getTime()) ? null : end;
  }

  function tickBanner(banner) {
    const target = getTargetDate(banner);
    if (!target) return;

    const remaining = Math.max(0, target.getTime() - Date.now());
    const parts = msToParts(remaining);
    setTimerValues(banner, parts.days, parts.hours, parts.minutes, parts.seconds);

    if (remaining === 0 && banner.dataset.countdownLoop !== 'true') {
      banner.classList.add('pdp-promo-banner--expired');
    }
  }

  function initBanner(banner) {
    if (timers.has(banner)) return;

    tickBanner(banner);
    const intervalId = window.setInterval(() => tickBanner(banner), 1000);
    timers.set(banner, intervalId);
  }

  function initAll(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-promo-banner]').forEach(initBanner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (event) => {
    initAll(event.target);
  });
})();
