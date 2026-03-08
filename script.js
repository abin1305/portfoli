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


/* CONTACT FORM HANDLING */
const contactForm = document.querySelector('.contact-form');
const statusMessage = document.querySelector('.status-msg');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const json = JSON.stringify(Object.fromEntries(formData.entries()));

  statusMessage.innerHTML = 'Sending...';
  statusMessage.style.display = 'block';
  statusMessage.className = 'status-msg';

  fetch(form.action, {
    method: form.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: json,
  })
    .then(async (response) => {
      let jsonResponse = await response.json();
      if (response.status == 200) {
        statusMessage.innerHTML = jsonResponse.message;
        statusMessage.classList.add('success');
        form.reset(); // This clears the form fields
      } else {
        statusMessage.innerHTML = jsonResponse.message;
        statusMessage.classList.add('error');
      }
    })
    .catch((error) => {
      statusMessage.innerHTML = 'Something went wrong!';
      statusMessage.classList.add('error');
    })
    .finally(() => {
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 5000);
    });
});
