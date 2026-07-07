document.addEventListener('DOMContentLoaded', function() {
  // Date tabs filtering
  const dateTabs = document.querySelectorAll('.date-tab');
  dateTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      dateTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filters depending on the page
      applyMovieDetailFilters();
      applyShowtimeFilters();
    });
  });

  // Showtime filtering function for Movie Detail Page
  function applyMovieDetailFilters() {
    const activeTab = document.querySelector('.date-tab.active');
    if (!activeTab) return;
    const selectedDate = activeTab.dataset.date;
    if (!selectedDate) return;

    const roomEls = document.querySelectorAll('.room-showtimes');
    let anyVisible = false;
    roomEls.forEach(roomEl => {
      let visibleCount = 0;
      const btns = roomEl.querySelectorAll('.showtime-btn');
      btns.forEach(btn => {
        if (btn.dataset.date === selectedDate) {
          btn.style.display = 'flex';
          visibleCount++;
        } else {
          btn.style.display = 'none';
        }
      });
      if (visibleCount > 0) {
        roomEl.style.display = 'block';
        anyVisible = true;
      } else {
        roomEl.style.display = 'none';
      }
    });
    // If no showtimes visible for the selected date, show everything
    if (!anyVisible) {
      document.querySelectorAll('.showtime-btn').forEach(btn => btn.style.display = 'flex');
      document.querySelectorAll('.room-showtimes').forEach(r => r.style.display = 'block');
    }
  }

  // Showtime filtering function for General Showtime Page
  function applyShowtimeFilters() {
    const activeTab = document.querySelector('.date-tab.active');
    if (!activeTab) return;
    const selectedDate = activeTab.dataset.date;
    
    const statusTab = document.querySelector('.status-tab.active');
    const selectedStatus = statusTab ? statusTab.dataset.status : '';

    document.querySelectorAll('.screening-card').forEach(card => {
      const dateMatch = !selectedDate || card.dataset.date === selectedDate;
      const statusMatch = !selectedStatus || card.dataset.status === selectedStatus;
      
      if (dateMatch && statusMatch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Run filters once on load to filter by the default active date
  applyMovieDetailFilters();
  applyShowtimeFilters();

  // Status tab filter for Showtime Page
  const statusTabs = document.querySelectorAll('.status-tab');
  statusTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      statusTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      applyShowtimeFilters();
    });
  });

  // Showtime buttons selection UI state helper
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
  if (adOverlay && !sessionStorage.getItem('adPopupShown')) {
    // Hiện sau 60 giây (1 phút)
    setTimeout(function() {
      adOverlay.classList.add('active');
      sessionStorage.setItem('adPopupShown', 'true');
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
