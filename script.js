/* PAGE LOAD + SCROLL ANIMATION */
const animatedItems = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

animatedItems.forEach(item => observer.observe(item));

/* TYPING ANIMATION */
const words = ["Full Stack Web Developer", "AI Engineer", "Data Analyst"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing");

function typeEffect() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  }

  let speed = isDeleting ? 60 : 120;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 300;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();



/* MOBILE MENU */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.onclick = () => {
  navLinks.classList.toggle("active");
};


const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 100) {
      section.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submit");
  const msg = document.getElementById("statusMsg");

  btn.onclick = (e) => {
    e.preventDefault();

    msg.style.display = "block";

    setTimeout(() => {
      msg.style.display = "none";
    }, 5000);
  };
});

