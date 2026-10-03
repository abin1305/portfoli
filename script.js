/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC & SHOWCASE ENGINE
   Author: Abin Y
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Init All Modules
  initHeroCanvas();
  initCustomCursor();
  initNavbarScroll();
  initTypingEffect();
  initCounters();
  initAboutTabs();
  initSkillFilters();
  initProjectsShowcase();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initCopyButtons();
});

/* --- 1. Hero Particle Canvas --- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const particles = [];
  const particleCount = Math.floor((width * height) / 18000);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 - dist / 800})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* --- 2. Custom Glow Cursor --- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* --- 3. Navbar & Scroll Progress --- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Highlight
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Hamburger Mobile Menu Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --- 4. Typing Effect --- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing');
  if (!typingElement) return;

  const roles = [
    'Full Stack Web Developer',
    'AI & Machine Learning Engineer',
    'Data Analytics Enthusiast',
    'MERN Stack Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --- 5. Metric Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / target));

        let current = 0;
        const timer = setInterval(() => {
          current += 1;
          counter.textContent = current;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.5 });

  const metricsBar = document.querySelector('.metrics-bar');
  if (metricsBar) observer.observe(metricsBar);
}

/* --- 6. About Tabs --- */
function initAboutTabs() {
  const tabBtns = document.querySelectorAll('.about-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(`tab-${targetTab}`);
      if (targetEl) targetEl.classList.add('active');
    });
  });
}

/* --- 7. Skill Category Filters --- */
function initSkillFilters() {
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-skill-category');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --- 8. Unified Projects Database & Showcase Engine (Curated Top Projects Showcase) --- */
const projectsData = [
  // --- FEATURED TOP STANDOUT PROJECTS ---
  {
    id: 1,
    title: 'Tomato – Food Ordering Web App',
    category: 'fullstack',
    categoryName: 'Full Stack',
    featured: true,
    description: 'A full stack food ordering platform allowing users to explore restaurant menus, select gourmet dishes, manage cart orders, and process checkout seamlessly.',
    tech: ['HTML5', 'Node.js', 'Express.js', 'MongoDB', 'CSS3'],
    image: 'images/food_order.png',
    github: 'https://github.com/abin1305/food-order.git',
    live: null
  },
  {
    id: 2,
    title: 'Hostel & Student Attendance Management System',
    category: 'fullstack',
    categoryName: 'Full Stack',
    featured: true,
    description: 'Enterprise hostel management software featuring Admin & Student portals, room allocation, daily attendance tracking, meal planner, and automated monthly billing.',
    tech: ['React.js', 'node.js', 'TailwindCSS'],
    image: 'images/hostel_management.png',
    github: 'https://github.com/abin1305/nexus_hostel_management_system.git',
    live: null
  },
  {
    id: 3,
    title: 'newsbag – AI News Aggregator App',
    category: 'aiml',
    categoryName: 'AI & ML',
    featured: true,
    description: 'A modern news platform leveraging Python backend services to fetch real-time headlines, categorize stories, and present personalized news feeds.',
    tech: ['React.js', 'TailwindCSS', 'Python', 'REST API'],
    image: 'images/news.png',
    github: 'https://github.com/abin1305/news-app.git',
    live: 'https://news-app-9r46.onrender.com/'
  },
  {
    id: 4,
    title: 'InsiderJobs – Job Portal Website',
    category: 'fullstack',
    categoryName: 'Full Stack',
    featured: true,
    description: 'A modern job portal website with user authentication, job search functionality, candidate profiles, and responsive filterable job listings.',
    tech: ['React.js', 'TailwindCSS', 'Express.js', 'Node.js', 'MongoDB'],
    image: 'images/insiderjobs.png',
    github: 'https://github.com/abin1305/insiderjobs.git',
    live: 'https://insiderjobs-zdsx-amog242kl-abin1305s-projects.vercel.app'
  },
  {
    id: 5,
    title: 'Responsive Calculator Web Application',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A simple and responsive calculator web application designed with a clean Casio-inspired interface.',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    image: 'images/calculator.png',
    github: 'https://github.com/abin1305/calculator.git',
    live: 'https://calculator-eta-six-62.vercel.app/'
  },
  {
    id: 6,
    title: 'Forever – Fashion E-Commerce Website',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: true,
    description: 'A modern and responsive fashion e-commerce website designed for browsing and shopping clothing collections.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'images/forever.png',
    github: 'https://github.com/abin1305/forever-ecommerse-website.git',
    live: 'https://forever-ecommerse-website-63dl.vercel.app/'
  },
  {
    id: 7,
    title: 'Sales Revenue Analysis by Country & Product',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: true,
    description: 'A comprehensive data analytics project examining sales revenue across countries, customer demographics, and product lines with Pandas and Matplotlib.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    image: 'images/tata_country.png',
    github: 'https://github.com/abin1305/tata-data-analysis.git',
    live: null
  },
  
  {
    id: 8,
    title: 'Solar System Web Visualization',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'An interactive web visualization of the solar system built for educational purposes, demonstrating planetary orbits and spatial dynamics.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'images/solar_system.png',
    github: 'https://github.com/abin1305/solar-system.git',
    live: 'https://solar-system-zeta-rosy.vercel.app'
  },
  {
    id: 9,
    title: 'Lumina – Online Learning Platform',
    category: 'fullstack',
    categoryName: 'Full Stack',
    featured: true,
    description: 'An online learning platform designed to help users explore future career paths, register for courses, and access interactive tech learning materials.',
    tech: ['React.js', 'TailwindCSS', 'Node.js', 'MongoDB'],
    image: 'images/lumina.png',
    github: 'https://github.com/abin1305/lumina-education-app.git',
    live: null
  },

  // --- FULL STACK & BACKEND PROJECTS ---
  {
    id: 10,
    title: 'GreenCart – Online Grocery Shopping',
    category: 'fullstack',
    categoryName: 'Full Stack',
    featured: false,
    description: 'An online grocery shopping web application that allows users to browse fresh produce, explore categories, and shop daily essentials with database persistence.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'HTML5', 'CSS3'],
    image: 'images/greencart.png',
    github: 'https://github.com/abin1305/greencart.git',
    live: null
  },

  {
    id: 11,
    title: 'To-Do Manager – Task Web App',
    category: 'fullstack',
    categoryName: 'Full Stack',
    featured: false,
    description: 'A task management application allowing users to create, edit, update completion status, and organize daily activities with MongoDB backend.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    image: 'images/todo.png',
    github: 'https://github.com/abin1305/todo-list.git',
    live: null
  },
 

  // --- DATA ANALYTICS PROJECTS ---
  {
    id: 12,
    title: 'Monthly Revenue Trend Analysis',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'A business intelligence analysis tracking monthly revenue fluctuations, seasonality patterns, and growth opportunities using exploratory data techniques.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    image: 'images/montly_revenue.png',
    github: 'https://github.com/abin1305/montly-revenue-analysis.git',
    live: null
  },
  {
    id: 13,
    title: 'Supply Chain Analysis',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'The analysis examines yearly and monthly price patterns, state and market differences, and price variability to identify areas that may require supply-chain improvement. ',
    tech: ['python','Excel'],
    image: 'images/supply.png',
    github: 'https://github.com/abin1305/Supply-Chain-Analysis.git',
    live: null
  },

  // --- FRONTEND & UI ENGINEERING PROJECTS ---
  {
    id: 14,
    title: 'KILANGI – Jewellery E-Commerce Showcase',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A modern jewellery showcase website designed to present elegant gold and silver collections with a clean user interface and smooth category navigation.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'images/kilangi.png',
    github: 'https://github.com/abin1305/KILANGI.git',
    live: 'https://kilangi-zkfe.vercel.app/'
  },
  {
    id: 15,
    title: 'Modern Signup & Social Login Page',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A clean and responsive user registration interface featuring username, email, password, and confirm-password fields.',
    tech: ['HTML5', 'CSS3'],
    image: 'images/signup.png',
    github: 'https://github.com/abin1305/signup-form.git',
    live: 'https://signup-form-mxag.vercel.app/'
  },
  {
    id: 16,
    title: 'Online Learning Landing Page (Xypo)',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A modern educational landing page designed to encourage users to learn programming and build career skills through an engaging interface.',
    tech: ['HTML5', 'CSS3'],
    image: 'images/xypo.png',
    github: 'https://github.com/abin1305/Xypo-Learning-App.git',
    live: 'https://xypo-learning-app.vercel.app/'
  },
  {
    id: 17,
    title: 'Urban Fashion – Fashion Landing Page',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A stylish fashion landing page designed to showcase modern clothing collections and promote seasonal trends with a clean, visually appealing UI.',
    tech: ['HTML5', 'CSS3'],
    image: 'images/urbanfashion.png',
    github: 'https://github.com/abin1305/fashion-landing-page.git',
    live: 'https://fashion-landing-page-sigma.vercel.app'
  },
  {
    id: 18,
    title: 'Adventure Travel – Destination Website',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A visually engaging travel landing page designed to inspire users to explore new destinations, showcasing adventure experiences and outdoor trips.',
    tech: ['HTML5', 'CSS3'],
    image: 'images/travel.png',
    github: 'https://github.com/abin1305/Travelling-landing-page.git',
    live: 'https://travelling-landing-page-rho.vercel.app'
  },
  {
    id: 19,
    title: 'Quiz Master – Interactive Quiz App',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'An interactive quiz application allowing users to test their knowledge across science, technology, geography, and general knowledge.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'images/quizmaster.png',
    github: 'https://github.com/abin1305/Quiz-master.git',
    live: 'https://quiz-master-mu-teal.vercel.app'
  },
  {
    id: 20,
    title: 'Freelancer Portfolio Landing Page',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'An engaging landing page for a freelancer to showcase services, skillsets, portfolio work, and encourage client contact.',
    tech: ['HTML5', 'CSS3', 'Bootstrap'],
    image: 'images/logo_freelancer.png',
    github: 'https://github.com/abin1305/freelancer-landing-page.git',
    live: 'https://freelancer-landing-page-eight.vercel.app'
  },
  {
    id: 21,
    title: 'Travel Destination Slider Website',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'An interactive travel website featuring a dynamic destination slider that showcases popular locations and highlights unique attractions.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'images/image_slider.png',
    github: 'https://github.com/abin1305/image-slider.git',
    live: 'https://image-slider-silr.vercel.app'
  },
  {
    id: 22,
    title: 'Real Estate Agency Website',
    category: 'frontend',
    categoryName: 'Frontend',
    featured: false,
    description: 'A modern and responsive real estate agency website designed to help users explore properties and find their dream home.',
    tech: ['HTML5', 'CSS3'],
    image: 'images/real_estate.png',
    github: 'https://github.com/abin1305/logo_Real-Estate-Agency.git',
    live: 'https://logoreal-estate-epvj.vercel.app/'
  },
  {
    id: 23,
    title: 'TechPulse 2026 – Technology Event Registration Platform',
    category: 'fullstack',
    categoryName: 'Fullstack',
    featured: true,
    description: 'A modern and responsive technology event registration website designed for the TechPulse 2026 summit.',
    tech: ['React','MongoDB','Node.js','Express.js'],
    image: 'images/event-participation.png',
    github: 'https://github.com/abin1305/event_participation.git',
    live: null
  },
  {
    id: 24,
    title: 'NourishBridge – Food Redistribution Platform',
    category: 'fullstack',
    categoryName: 'Fullstack',
    featured: true,
    description: 'A modern and responsive food redistribution platform that connects restaurants, hotels, catering services, and event organizers with NGOs, shelters, and communities in need.',
    tech: ['React','MongoDB','Node.js','Express.js'],
    image: 'images/food-distribution.png',
    github: 'https://github.com/abin1305/food-distribution.git',
    live: null
  },
  {
    id: 25,
    title: 'CareerForge – Student Career & Placement Hub',
    category: 'fullstack',
    categoryName: 'Fullstack',
    featured: true,
    description: 'A modern student career and placement management dashboard designed to help students prepare for campus placements and track their career progress.',
    tech: ['React','MongoDB','Node.js','Express.js'],
    image: 'images/carrierforage.png',
    github: 'https://github.com/abin1305/carrierforage.git',
    live: null
  },
  {
    id: 26,
    title: 'PrepMatrix – AI-Powered Placement Intelligence Platform',
    category: 'fullstack',
    categoryName: 'Fullstack',
    featured: true,
    description: 'A modern AI-powered career and placement preparation platform designed to help students prepare for company recruitment processes.',
    tech: ['React','MongoDB','Node.js','Express.js'],
    image: 'images/placement.png',
    github: 'https://github.com/abin1305/placement-support-website.git',
    live: null
  },
   {
    id: 27,
    title: 'SFO Flight Analytics Dashboard',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'It visualizes flight volume, busiest routes, longest routes, daily flight trends, total flights, and global flight connections using charts and an interactive map.',
    tech: ['Tableau'],
    image: 'images/flightdata.png',
    github: 'https://github.com/abin1305/Flight-Analytics-Dashboard.git',
    live: null
  },
   {
    id: 27,
    title: 'Banking Loan Risk & Credit Analytics Dashboard',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'An Excel-based banking analytics dashboard designed to analyze loan applications, approval patterns, and credit risk.',
    tech: ['Excel'],
    image: 'images/loan_anaysis.png',
    github: 'https://github.com/abin1305/banking-loan-risk.git',
    live: null
  },
  {
    id: 28,
    title: 'COVID-19 Global Data Analytics Dashboard',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'It visualizes confirmed, recovered, and death cases across countries using maps, charts, trend analysis, and country-level comparisons.',
    tech: ['Tableau'],
    image: 'images/covid.png',
    github: 'https://github.com/abin1305/covid19_analysis.git',
    live: null
  },
    {
    id: 29,
    title: 'Netflix Data Analysis',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'A Netflix content analysis project that explores the distribution of movies and TV shows based on content ratings.',
    tech: ['python','matplotlib','seaborn'],
    image: 'images/netflix.png',
    github: 'https://github.com/abin1305/netflix-data-analysis.git',
    live: null
  },
   {
    id: 30,
    title: 'Retail-Sales-Analysis',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'The Retail Sales Analytics Dashboard is an end-to-end data analytics project that analyzes retail sales data to identify sales trends, customer behavior, product performance, and business opportunities. ',
    tech: ['python','tableu','power BI','Excel','SQL'],
    image: 'images/retail.png',
    github: 'https://github.com/abin1305/Retail-Sales-Analysis.git',
    live: null
  },
   {
    id: 31,
    title: 'Space Mission & Launch Analytics Dashboard',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'An interactive Tableau dashboard for analyzing space mission and launch data across different companies and launch sites.',
    tech: ['tableu'],
    image: 'images/space.png',
    github: 'https://github.com/abin1305/space-mission.git',
    live: null
  },
   {
    id: 32,
    title: 'World Happiness Report – Life Expectancy Analysis',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'A World Happiness Report data analysis project exploring differences in life expectancy across countries.',
    tech: ['tableu'],
    image: 'images/hapiness.png',
    github: 'https://github.com/abin1305/happiness_report.git',
    live: null
  },
   {
    id: 33,
    title: 'onion market analysis and price trend prediction',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'It involves analyzing onion market dynamics, identifying price trends, and predicting future market behavior based on historical data, market conditions, and demand-supply factors. ',
    tech: ['python','Excel'],
    image: 'images/onion.png',
    github: 'https://github.com/abin1305/Onion_Market_Analysis.git',
    live: null
  },
  {
    id: 34,
    title: 'crop yield optimization and prediction',
    category: 'analytics',
    categoryName: 'Data Analytics',
    featured: false,
    description: 'This report develops a data-driven crop yield optimization strategy for onion using the publicly available Crop Yield in Indian States Dataset. ',
    tech: ['python','Excel'],
    image: 'images/product.png',
    github: 'https://github.com/abin1305/market_analysis_and-_trend_prediction_onion.git',
    live: null
  },
];

function initProjectsShowcase() {
  const projectsGrid = document.getElementById('projectsGrid');
  const searchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const noProjectsMsg = document.getElementById('noProjectsMessage');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  if (!projectsGrid) return;

  let currentFilter = 'all';
  let currentSearch = '';

  function updateFilterCounts() {
    const counts = {
      all: projectsData.length,
      featured: projectsData.filter(p => p.featured).length,
      fullstack: projectsData.filter(p => p.category === 'fullstack').length,
      frontend: projectsData.filter(p => p.category === 'frontend').length,
      aiml: projectsData.filter(p => p.category === 'aiml').length,
      analytics: projectsData.filter(p => p.category === 'analytics').length
    };

    Object.keys(counts).forEach(key => {
      const el = document.getElementById(`count-${key}`);
      if (el) el.textContent = `(${counts[key]})`;
    });

    const sectionHeaderTitle = document.querySelector('.projects-section .section-title');
    if (sectionHeaderTitle) {
      sectionHeaderTitle.innerHTML = `All My <span>Projects</span> (${projectsData.length})`;
    }
  }

  function renderProjects() {
    const filtered = projectsData.filter(project => {
      let matchesCategory = false;
      if (currentFilter === 'all') {
        matchesCategory = true;
      } else if (currentFilter === 'featured') {
        matchesCategory = project.featured === true;
      } else {
        matchesCategory = project.category === currentFilter;
      }

      const matchesSearch = project.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            project.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            project.tech.some(t => t.toLowerCase().includes(currentSearch.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      projectsGrid.innerHTML = '';
      if (noProjectsMsg) noProjectsMsg.classList.remove('hidden');
    } else {
      if (noProjectsMsg) noProjectsMsg.classList.add('hidden');
      projectsGrid.innerHTML = filtered.map(project => `
        <div class="project-card animate-up" data-id="${project.id}">
          <div class="project-thumb-container">
            <span class="project-category-badge">${project.categoryName}</span>
            ${project.featured ? `<span class="project-featured-badge"><i class="ri-star-fill"></i> Top Project</span>` : ''}
            <button class="project-quick-view" title="Quick View" onclick="openProjectModal(${project.id})">
              <i class="ri-eye-line"></i>
            </button>
            <img src="${project.image}" alt="${project.title}" class="project-thumb" loading="lazy" />
          </div>

          <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>

            <div class="project-tech-stack">
              ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>

            <div class="project-card-footer">
              <a href="${project.github}" target="_blank" class="project-link-btn">
                <i class="ri-github-fill"></i> GitHub
              </a>
              ${project.live ? `
                <a href="${project.live}" target="_blank" class="project-link-btn live-btn">
                  <i class="ri-external-link-line"></i> Live Demo
                </a>
              ` : `
                <button class="project-link-btn" onclick="openProjectModal(${project.id})">
                  <i class="ri-information-line"></i> Details
                </button>
              `}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Category Filter Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderProjects();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      if (clearSearchBtn) {
        if (currentSearch.length > 0) clearSearchBtn.classList.add('active');
        else clearSearchBtn.classList.remove('active');
      }
      renderProjects();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      clearSearchBtn.classList.remove('active');
      renderProjects();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      currentFilter = 'all';
      if (clearSearchBtn) clearSearchBtn.classList.remove('active');

      filterBtns.forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
      });

      renderProjects();
    });
  }

  // Initial Render & Count Sync
  updateFilterCounts();
  renderProjects();
}

/* --- 9. Modal Popup Engine --- */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDescription');
  const modalTech = document.getElementById('modalTechTags');
  const modalGithub = document.getElementById('modalGithubLink');
  const modalLive = document.getElementById('modalLiveLink');

  if (modalImg) modalImg.src = project.image;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalCategory) modalCategory.textContent = project.categoryName;
  if (modalDesc) modalDesc.textContent = project.description;

  if (modalTech) {
    modalTech.innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  }

  if (modalGithub) modalGithub.href = project.github;

  if (modalLive) {
    if (project.live) {
      modalLive.href = project.live;
      modalLive.style.display = 'inline-flex';
    } else {
      modalLive.style.display = 'none';
    }
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

/* --- 10. Contact Form AJAX Submission (Web3Forms) --- */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  const statusMessage = document.querySelector('.status-msg');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const json = JSON.stringify(Object.fromEntries(formData.entries()));

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="ri-loader-4-line ri-spin"></i>`;
    }

    if (statusMessage) {
      statusMessage.innerHTML = 'Sending...';
      statusMessage.style.display = 'block';
      statusMessage.className = 'status-msg';
    }

    fetch(form.action, {
      method: form.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: json,
    })
      .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
          if (statusMessage) {
            statusMessage.innerHTML = jsonResponse.message || 'Message sent successfully!';
            statusMessage.classList.add('success');
          }
          form.reset();
        } else {
          if (statusMessage) {
            statusMessage.innerHTML = jsonResponse.message || 'Submission failed.';
            statusMessage.classList.add('error');
          }
        }
      })
      .catch((error) => {
        if (statusMessage) {
          statusMessage.innerHTML = 'Something went wrong!';
          statusMessage.classList.add('error');
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Send Message</span> <i class="ri-send-plane-line"></i>`;
        }
        setTimeout(() => {
          if (statusMessage) {
            statusMessage.style.display = 'none';
          }
        }, 5000);
      });
  });
}

/* --- 11. Back to Top Button --- */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('active');
    } else {
      backBtn.classList.remove('active');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- 12. Copy to Clipboard Helper --- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="ri-check-line" style="color: #38ef7d;"></i>`;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });
}
