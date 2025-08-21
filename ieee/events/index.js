// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

hamburger.addEventListener('click', () => {
    navContainer.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        navContainer.classList.remove('active');
    }
});


// ************************************   
// first slider 
const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let currentIndex = 0;
let autoPlayInterval;

function updateSlider(index) {
  const slideWidth = slider.children[0].offsetWidth;
  slider.style.transform = `translateX(-${index * slideWidth}px)`;

  dots.forEach(dot => dot.classList.replace('bg-[#003B71]', 'bg-gray-300'));
  dots[index].classList.replace('bg-gray-300', 'bg-[#003B71]');
}

function goToNextSlide() {
  currentIndex = (currentIndex + 1) % dots.length;
  updateSlider(currentIndex);
}

function startAutoPlay() {
  autoPlayInterval = setInterval(goToNextSlide, 5000); 
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay(); 
}

nextBtn.addEventListener('click', () => {
  goToNextSlide();
  stopAutoPlay();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + dots.length) % dots.length;
  updateSlider(currentIndex);
  stopAutoPlay();
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    currentIndex = +dot.dataset.index;
    updateSlider(currentIndex);
    stopAutoPlay();
  });
});


startAutoPlay();


// *********************************
// sec slider 


const teamSlider = document.getElementById('team-slider');
const teamDots = document.querySelectorAll('.team-dot');
const teamNextBtn = document.getElementById('teamNextBtn');
const teamPrevBtn = document.getElementById('teamPrevBtn');
let teamIndex = 0;
let teamAutoPlayInterval;

function updateTeamSlider(index) {
  const slideWidth = teamSlider.children[0].offsetWidth;
  teamSlider.style.transform = `translateX(-${index * slideWidth}px)`;

  teamDots.forEach(dot => dot.classList.replace('bg-[#003B71]', 'bg-gray-300'));
  teamDots[index].classList.replace('bg-gray-300', 'bg-[#003B71]');
}

function goToNextTeamSlide() {
  teamIndex = (teamIndex + 1) % teamDots.length;
  updateTeamSlider(teamIndex);
}

function startTeamAutoPlay() {
  teamAutoPlayInterval = setInterval(goToNextTeamSlide, 5000);
}

function stopTeamAutoPlay() {
  clearInterval(teamAutoPlayInterval);
  startTeamAutoPlay();
}

teamNextBtn.addEventListener('click', () => {
  goToNextTeamSlide();
  stopTeamAutoPlay();
});

teamPrevBtn.addEventListener('click', () => {
  teamIndex = (teamIndex - 1 + teamDots.length) % teamDots.length;
  updateTeamSlider(teamIndex);
  stopTeamAutoPlay();
});

teamDots.forEach(dot => {
  dot.addEventListener('click', () => {
    teamIndex = +dot.dataset.index;
    updateTeamSlider(teamIndex);
    stopTeamAutoPlay();
  });
});

startTeamAutoPlay();
