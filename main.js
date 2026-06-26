
document.addEventListener('DOMContentLoaded', () => {
  // Core Elements
  const leftPanel = document.getElementById('left-panel');
  const rightPanel = document.getElementById('right-panel');
  const leftSlides = document.querySelectorAll('.slide-content');
  const rightSlides = document.querySelectorAll('.slide-visual');
  const dotsContainer = document.getElementById('dots-container');
  
  const slideLength = leftSlides.length;
  let activeIndex = 0;
  let isAnimating = false;

  // 1. Initial Setup
  // Position the right panel so the last element in its DOM (Visual 1) is visible at the top.
  rightPanel.style.top = `-${(slideLength - 1) * 100}vh`;

  // Generate Pagination Dots
  for (let i = 0; i < slideLength; i++) {
	const dot = document.createElement('div');
	dot.classList.add('dot');
	if (i === 0) dot.classList.add('is-active');
	dot.addEventListener('click', () => changeSlide(i));
	dotsContainer.appendChild(dot);
  }
  const dots = document.querySelectorAll('.dot');

  // 2. Core Transition Logic
  const changeSlide = (index) => {
	// Prevent action if currently animating, out of bounds, or already on the requested slide
	if (isAnimating || index < 0 || index >= slideLength || index === activeIndex) return;
	
	isAnimating = true;
	activeIndex = index;

	// Apply Translations
	// Left goes UP (negative)
	leftPanel.style.transform = `translateY(-${activeIndex * 100}vh)`;
	// Right goes DOWN (positive)
	rightPanel.style.transform = `translateY(${activeIndex * 100}vh)`;

	// Update CSS classes for text staggers and image settling
	leftSlides.forEach(slide => slide.classList.remove('is-active'));
	rightSlides.forEach(slide => slide.classList.remove('is-active'));
	dots.forEach(dot => dot.classList.remove('is-active'));

	// Target the specific slides
	document.querySelector(`.slide-content[data-index="${activeIndex}"]`).classList.add('is-active');
	document.querySelector(`.slide-visual[data-index="${activeIndex}"]`).classList.add('is-active');
	dots[activeIndex].classList.add('is-active');

	// Unlock after CSS transition duration (1000ms)
	setTimeout(() => {
	  isAnimating = false;
	}, 1000); 
  };

  // 3. Event Listeners (Scroll & Keyboard)
  
  // Mouse Wheel Hijacking
  window.addEventListener('wheel', (e) => {
	// Disable JS scrolling on mobile screens where standard CSS scrolling takes over
	if (window.innerWidth <= 900) return;
	
	if (e.deltaY > 0) {
	  changeSlide(activeIndex + 1); // Scroll Down -> Next Slide
	} else if (e.deltaY < 0) {
	  changeSlide(activeIndex - 1); // Scroll Up -> Prev Slide
	}
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
	if (window.innerWidth <= 900) return;

	if (e.key === 'ArrowDown' || e.key === 'PageDown') {
	  changeSlide(activeIndex + 1);
	} else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
	  changeSlide(activeIndex - 1);
	}
  });

  // Touch Swiping (For tablets in landscape, or generic touch devices > 900px width)
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
	touchStartY = e.touches[0].clientY;
  });
  window.addEventListener('touchend', (e) => {
	if (window.innerWidth <= 900) return;
	const touchEndY = e.changedTouches[0].clientY;
	const delta = touchStartY - touchEndY;
	
	if (delta > 50) {
	  changeSlide(activeIndex + 1); // Swiped up
	} else if (delta < -50) {
	  changeSlide(activeIndex - 1); // Swiped down
	}
  });
});
