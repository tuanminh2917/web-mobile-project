document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.carousel-wrapper');
  const items = document.querySelectorAll('.carousel-item');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (!wrapper || !items.length) return;

  let currentIndex = 0;
  const totalItems = items.length;

  function goToSlide(index) {
    if (index < 0) index = totalItems - 1;
    if (index >= totalItems) index = 0;
    currentIndex = index;
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  let autoplay = setInterval(() => goToSlide(currentIndex + 1), 4000);

  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoplay));
    container.addEventListener('mouseleave', () => {
      clearInterval(autoplay);
      autoplay = setInterval(() => goToSlide(currentIndex + 1), 4000);
    });
  }
});
