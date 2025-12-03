/* ========================================
   Fabrizio Pasini - Game Developer
   ======================================== */

// ========== CONSTANTS & STATE ==========
const STATE = {
  currentFilter: 'all',
  projects: [],
  activeSection: 'hero',
  visibleCount: 2, // How many currently shown
  itemsPerBatch: 2 // How many to add when clicking Load More
};

function getInitialCount() {
  return window.innerWidth < 768 ? 3 : 6; 
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCookieConsent();
  loadProjects();
  initCopyrightYear();
  initScrollAnimations();
});

// ========== THEME MANAGEMENT ==========
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ========== NAVIGATION ==========
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  initSectionObserver();
}

// ========== SECTION OBSERVER ==========
function initSectionObserver() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        STATE.activeSection = sectionId;

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, options);

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ========== PROJECT LOADING & FILTERING ==========
async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    const data = await response.json();
    STATE.projects = data.projects.sort((a, b) => b.id - a.id);

    STATE.visibleCount = getInitialCount();
    STATE.itemsPerBatch = getInitialCount();

    renderProjects();
    initProjectFilters();
    initLoadMore();
  } catch (error) {
    console.error('Error loading projects:', error);
    showEmptyState('Failed to load projects. Please refresh the page.');
  }
}

function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      STATE.visibleCount += STATE.itemsPerBatch;
      renderProjects(STATE.currentFilter, false);
    });
  }
}

function renderProjects(filter = 'all', resetCount = true) {
  const projectsGrid = document.getElementById('projectsGrid');
  const emptyState = document.getElementById('emptyState');
  const loadMoreContainer = document.getElementById('loadMoreContainer');

  if (!projectsGrid) return;

  if (resetCount) {
    STATE.currentFilter = filter;
    STATE.visibleCount = getInitialCount();
  }

  const filteredProjects = filter === 'all' 
    ? STATE.projects 
    : STATE.projects.filter(project => project.tags.includes(filter));

  if (filteredProjects.length === 0) {
    projectsGrid.innerHTML = '';
    emptyState.style.display = 'block';
    loadMoreContainer.style.display = 'none';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  const projectsToShow = filteredProjects.slice(0, STATE.visibleCount);

  projectsGrid.innerHTML = projectsToShow.map(project => createProjectCard(project)).join('');

  if (STATE.visibleCount >= filteredProjects.length) {
    loadMoreContainer.style.display = 'none';
  } else {
    loadMoreContainer.style.display = 'block';
  }

  initLazyLoading();
}

function createProjectCard(project) {
  const links = [];
  
  // Link Logic (Keep this exactly as it was)
  if (project.links.artstation) {
    links.push(`<a href="${project.links.artstation}" target="_blank" rel="noopener" class="project-link"><i class="fab fa-artstation"></i> ArtStation</a>`);
  }
  if (project.links.itch) {
    links.push(`<a href="${project.links.itch}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-gamepad"></i> Itch.io</a>`);
  }
  if (project.links.github) {
    links.push(`<a href="${project.links.github}" target="_blank" rel="noopener" class="project-link"><i class="fab fa-github"></i> GitHub</a>`);
  }
  if (project.links.behance) {
    links.push(`<a href="${project.links.behance}" target="_blank" rel="noopener" class="project-link"><i class="fab fa-behance"></i> Behance</a>`);
  }
  if (project.links.website) {
      links.push(`<a href="${project.links.website}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-globe"></i> View Project</a>`);
   }
   
   let clientHtml = '';
   
   if (project.clients && project.clients.length > 0) {
          const logosHtml = project.clients.map(client => `
              <a href="${client.url}" target="_blank" rel="noopener" title="Client: ${client.name}">
                 <img src="${client.image}" alt="${client.name}">
              </a>
          `).join('');
          
          clientsHtml = `<div class="client-badge">${logosHtml}</div>`;
      }
      
      // (Fallback)
      else if (project.client) {
          clientsHtml = `
            <div class="client-badge">
              <a href="${project.client.url}" target="_blank" rel="noopener" title="Client: ${project.client.name}">
                 <img src="${project.client.image}" alt="${project.client.name}">
              </a>
            </div>
          `;
      }
  
  return `
    <article class="project-card" data-tags='${JSON.stringify(project.tags)}'>
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <span class="project-status">${project.status}</span>
      </div>
      <div class="project-content">
              <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                ${clientsHtml} </div>
        
        <p class="project-description">${project.description}</p>
        
        ${project.tech ? `
          <div class="project-tech">
            ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
          </div>
        ` : ''}
        
        ${links.length > 0 ? `
          <div class="project-links">
            ${links.join('')}
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');
      STATE.currentFilter = filter;

      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        card.classList.add('hidden');
      });

      setTimeout(() => {
        renderProjects(filter);
      }, 300);
    });
  });
}

function showEmptyState(message = 'No projects found with the selected filters.') {
  const emptyState = document.getElementById('emptyState');
  const projectsGrid = document.getElementById('projectsGrid');

  if (emptyState && projectsGrid) {
    projectsGrid.innerHTML = '';
    emptyState.style.display = 'block';
    emptyState.querySelector('p').textContent = message;
  }
}

// ========== LAZY LOADING ==========
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// ========== COOKIE CONSENT ==========
function initCookieConsent() {
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptButton = document.getElementById('cookieAccept');

  if (!cookieConsent || !acceptButton) return;

  const consentGiven = localStorage.getItem('cookieConsent');

  if (!consentGiven) {
    cookieConsent.style.display = 'block';
  }

  acceptButton.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.style.display = 'none';
  });
}

// ========== COPYRIGHT YEAR ==========
function initCopyrightYear() {
  const copyrightElement = document.getElementById('copyright-year');
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.textContent = `© ${currentYear} Fabrizio Pasini. All rights reserved.`;
  }
}

// ========== PERFORMANCE OPTIMIZATION ==========
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========== ACCESSIBILITY ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');

    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }
});

// Focus trap for mobile menu
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// ========== UTILITY FUNCTIONS ==========
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function getScrollProgress() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return (winScroll / height) * 100;
}

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// ========== CONSOLE WELCOME MESSAGE ==========
console.log(
  '%c👾 Welcome to Fabrizio Pasini\'s Portfolio! 👾',
  'color: #00D9FF; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);'
);
console.log(
  '%cGame Developer | Unreal Engine & Unity Specialist',
  'color: #0093E9; font-size: 12px;'
);
console.log(
  '%cInterested in collaboration? Let\'s connect!',
  'color: #8E8E93; font-size: 11px;'
);