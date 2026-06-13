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

  // Avatar dropdown
  const avatarBtn = document.getElementById('avatarBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    document.addEventListener('click', function() {
      dropdownMenu.classList.remove('show');
    });
    dropdownMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // ===================== AD POPUP (trang chủ, hiện sau 1 phút) =====================
  const adOverlay = document.getElementById('adPopupOverlay');
  if (adOverlay) {
    // Hiện sau 60 giây (1 phút)
    setTimeout(function() {
      adOverlay.classList.add('active');
    }, 60000);
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

// Hàm đóng popup quảng cáo (global, gọi từ HTML)
function closeAdPopup(event, force) {
  const overlay = document.getElementById('adPopupOverlay');
  if (!overlay) return;
  // Nếu click vào overlay (nền tối), đóng popup
  if (force || (event && event.target === overlay)) {
    overlay.classList.remove('active');
  }
}
