document.addEventListener('DOMContentLoaded', function() {
  // Date tabs
  const dateTabs = document.querySelectorAll('.date-tab');
  dateTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      dateTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Showtime buttons
  const showtimeBtns = document.querySelectorAll('.showtime-btn');
  showtimeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      showtimeBtns.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      this.classList.toggle('open');
    });
  }

  // Popup ad - cookie based dismiss
  const popup = document.querySelector('.ad-popup');
  const popupClose = document.querySelector('.ad-popup-close');
  if (popup && popupClose) {
    if (!localStorage.getItem('adPopupDismissed')) {
      setTimeout(() => popup.classList.add('show'), 2000);
    }
    popupClose.addEventListener('click', function() {
      popup.classList.remove('show');
      localStorage.setItem('adPopupDismissed', 'true');
    });
    popup.addEventListener('click', function(e) {
      if (e.target === this) {
        popup.classList.remove('show');
        localStorage.setItem('adPopupDismissed', 'true');
      }
    });
  }

  // View counter animation
  const viewCounters = document.querySelectorAll('.view-counter');
  viewCounters.forEach(counter => {
    const target = parseInt(counter.dataset.count) || 0;
    let current = 0;
    const increment = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current.toLocaleString();
    }, 40);
  });
});
