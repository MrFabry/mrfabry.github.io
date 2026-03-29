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

// fallback loader for file:// protocol (no fetch)
function loadProjectsViaScript() {
  return new Promise((resolve, reject) => {
    window.__projectsCallback = (data) => resolve(data);
    const script = document.createElement('script');
    script.src = 'projects.json.js';
    script.onerror = () => reject(new Error('script load failed'));
    document.head.appendChild(script);
    setTimeout(() => reject(new Error('timeout')), 3000);
  });
}

// ========== INLINE PROJECT DATA (fallback for file:// protocol) ==========
const PROJECTS_DATA = {"projects":[{"id":9,"title":"VR By Bridge Simulator","description":"A Bridge-based simulator that provides engineers with a realistic virtual environment to train and refine maintenance procedures safely and efficiently.","image":"Images/Projects/Project9vrbridge.webp","status":"In Progress","tags":["Unreal Engine","VR","Work in Progress"],"tech":["Unreal Engine","C++","Blueprints","3D","VR MetaQuest 3"],"clients":[{"name":"Newo Design","url":"https://newodesign.it","image":"Images/Badges/newo-logo.webp"}],"links":{"website":"https://youtu.be/IgfvTkT7uc8"}},{"id":8,"title":"Realtime-Environment Interactive Visualization Apps","description":"Interactive architectural visualizations and walkthroughs using Unreal Engine for high-end architecture projects.","image":"Images/Projects/Project10archviz.webp","status":"Prototypes","tags":["Unreal Engine","Prototypes"],"tech":["Unreal Engine","C++","Blueprints","3D","PixelStreaming","Cesium","ArchViz"],"clients":[{"name":"Newo Design","url":"https://newodesign.it","image":"Images/Badges/newo-logo.webp"}],"links":{"website":"https://youtu.be/J79uv_6Mk7A"}},{"id":7,"title":"BigBroApp","description":"Innovative Tamagotchi-style game for famous Twitch streamer Moonryde featuring post-apocalyptic character management.","image":"Images/Projects/Project8bigbro.webp","status":"In Progress","tags":["Unity","Work in Progress"],"tech":["Unity","C#","2D","Mobile","Project Manager"],"clients":[{"name":"MoonRyde twitch","url":"https://www.twitch.tv/moonryde/","image":"Images/Badges/moonride-logo.webp"},{"name":"BigBro SRL","url":"https://www.linkedin.com/company/bigbrosrl/about/","image":"Images/Badges/bigbrosrl-logo.webp"}],"links":{"website":"https://www.twitch.tv/moonryde/"}},{"id":6,"title":"Adopted","description":"A particular legend has been widespread about an entity in the mountains that kidnaps and makes children disappear. A horror experience focused on atmosphere and storytelling.","image":"Images/Projects/Project1Adopted.webp","status":"Released","tags":["Unreal Engine","Released Games"],"tech":["Unreal Engine","Blueprints","3D","Horror"],"clients":[{"name":"Quasar Institute for Advanced Design","url":"https://quasarinstitute.it/","image":"Images/Badges/quasar-logo.webp"}],"links":{"artstation":"https://www.artstation.com/artwork/xYkReW","itch":"https://fabriziop.itch.io/adopted"}},{"id":5,"title":"Zombie Siege Chronicles","description":"Defend your refuge against relentless undead hordes in this intense tower defense game set in the zombie apocalypse.","image":"Images/Projects/Project2ZombieSiegeChronicles.webp","status":"Released","tags":["Unreal Engine","Released Games"],"tech":["Unreal Engine","C++","3D","Strategy"],"clients":[{"name":"The Rookies","url":"https://www.therookies.co/","image":"Images/Badges/rookies-logo.webp"},{"name":"Rainbow Academy","url":"https://www.rainbowacademy.it/","image":"Images/Badges/rainbowacademy-logo.webp"}],"links":{"website":"https://www.therookies.co/entries/31862","itch":"https://fabriziop.itch.io/zombie-siege-chronicles"}},{"id":4,"title":"Tank War Tactics","description":"A turn-based strategy game where players command a team of tanks to battle against enemy AI-controlled tanks.","image":"Images/Projects/Project3TankWarTactics.webp","status":"Released","tags":["Unreal Engine","Released Games"],"tech":["Unreal Engine","C++","Turn-Based"],"clients":[{"name":"Rainbow Academy","url":"https://www.rainbowacademy.it/","image":"Images/Badges/rainbowacademy-logo.webp"}],"links":{"artstation":"https://mrfabry.artstation.com/projects/m8xgYZ","itch":"https://fabriziop.itch.io/tank-war-tactical"}},{"id":3,"title":"Franizia","description":"Made for a game jam. A 2D adventure-platformer made in Unity where you have to repair your spaceship.","image":"Images/Projects/Project4Franizia.webp","status":"Prototype","tags":["Unity","Prototypes"],"tech":["Unity","C#","2D","Platformer"],"clients":[{"name":"Quasar Institute for Advanced Design","url":"https://quasarinstitute.it/","image":"Images/Badges/quasar-logo.webp"}],"links":{"behance":"https://www.behance.net/gallery/101528399/FRANIZIA"}},{"id":2,"title":"Caos Arena","description":"A Fantasy FPS game! Defend the tomb of the ancient Gods from hordes of enemies. Made for an exam project.","image":"Images/Projects/Project5Caosarena.webp","status":"Released","tags":["Unreal Engine","Released"],"tech":["Unreal Engine","Blueprints","3D"],"clients":[{"name":"Quasar Institute for Advanced Design","url":"https://quasarinstitute.it/","image":"Images/Badges/quasar-logo.webp"}],"links":{"artstation":"https://www.artstation.com/artwork/nEkywK","itch":"https://fabriziop.itch.io/caos-arena"}},{"id":1,"title":"Lab 403","description":"You have managed to enter the fearsome laboratory 403. Made for an exam project.","image":"Images/Projects/Project6Lab403.webp","status":"Released","tags":["Unreal Engine","Released"],"tech":["Unreal Engine","Blueprints","3D"],"clients":[{"name":"Quasar Institute for Advanced Design","url":"https://quasarinstitute.it/","image":"Images/Badges/quasar-logo.webp"}],"links":{"artstation":"https://www.artstation.com/artwork/nEkbr6","itch":"https://fabriziop.itch.io/lab403"}},{"id":0,"title":"Sucked In","description":"This game was developed by a team of four in ten days during the Zagarolo Game City Game Jam.","image":"Images/Projects/Project7suckedin.webp","status":"Released","tags":["Unity","Released"],"tech":["Unity","C#","2D","Game Jam"],"clients":[{"name":"Lazion Innova - Zagarolo Game City","url":"https://www.lazioinnova.it/","image":"Images/Badges/lazioinnova.webp"}],"links":{"behance":"https://www.behance.net/gallery/122652769/SUCKED-IN","itch":"https://zagarolo-game-city.itch.io/sucked-in"}}]};

// ========== PROJECT LOADING & FILTERING ==========
async function loadProjects() {
  try {
    let data;
    try {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error('fetch failed');
      data = await response.json();
    } catch (fetchErr) {
      // file:// protocol fallback — use inline data
      data = PROJECTS_DATA;
    }
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

  const header = `<div class="projects-table-header">
    <span></span>
    <span>Ref</span>
    <span>Project</span>
    <span>Engine</span>
    <span>Tags</span>
    <span>Links</span>
    <span style="text-align:right">Status</span>
  </div>`;
  projectsGrid.innerHTML = header + projectsToShow.map(project => createProjectCard(project)).join('');

  if (STATE.visibleCount >= filteredProjects.length) {
    loadMoreContainer.style.display = 'none';
  } else {
    loadMoreContainer.style.display = 'block';
  }

  initLazyLoading();
}

function createProjectCard(project) {
  const links = [];
  if (project.links.artstation) links.push(`<a href="${project.links.artstation}" target="_blank" rel="noopener" class="project-link"><i class="fab fa-artstation"></i></a>`);
  if (project.links.itch)       links.push(`<a href="${project.links.itch}"       target="_blank" rel="noopener" class="project-link"><i class="fas fa-gamepad"></i></a>`);
  if (project.links.github)     links.push(`<a href="${project.links.github}"     target="_blank" rel="noopener" class="project-link"><i class="fab fa-github"></i></a>`);
  if (project.links.behance)    links.push(`<a href="${project.links.behance}"    target="_blank" rel="noopener" class="project-link"><i class="fab fa-behance"></i></a>`);
  if (project.links.website)    links.push(`<a href="${project.links.website}"    target="_blank" rel="noopener" class="project-link"><i class="fas fa-globe"></i></a>`);

  let clientsHtml = '';
  if (project.clients && project.clients.length > 0) {
    const logosHtml = project.clients.map(c => `<a href="${c.url}" target="_blank" rel="noopener" title="${c.name}"><img src="${c.image}" alt="${c.name}" loading="lazy"></a>`).join('');
    clientsHtml = `<div class="client-badge">${logosHtml}</div>`;
  } else if (project.client) {
    clientsHtml = `<div class="client-badge"><a href="${project.client.url}" target="_blank" rel="noopener" title="${project.client.name}"><img src="${project.client.image}" alt="${project.client.name}"></a></div>`;
  }

  const isLive = project.status === 'In Progress' || project.status === 'Prototype';
  const statusClass = isLive ? 'wip live' : '';
  const statusMobileClass = isLive ? 'live-m' : '';
  const idxPad = String(project.id).padStart(3, '0');

  const engineRaw = project.tech ? project.tech.find(t => t === 'Unreal Engine' || t === 'Unity') || project.tech[0] : '';
  const engineTag = engineRaw === 'Unreal Engine' ? 'UE5' : engineRaw;
  const engineSub = project.tech ? project.tech.find(t => t === 'C++' || t === 'C#' || t === 'Blueprints') || '' : '';

  const vrTag = project.tags.includes('VR');
  const techBadges = project.tech
    ? project.tech.filter(t => t !== engineTag && t !== engineSub).slice(0, 4)
        .map(t => `<span class="tech-badge${t==='VR'||vrTag&&t.includes('VR')?' vr':''}">${t}</span>`).join('')
    : '';

  return `
    <div class="project-card" data-tags='${JSON.stringify(project.tags)}'>
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <div class="project-status-mobile ${statusMobileClass}">${project.status}</div>
      </div>
      <div class="project-idx-cell"><span class="project-idx">${idxPad}</span></div>
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-title">${project.title}</h3>
          ${clientsHtml}
        </div>
        <p class="project-description">${project.description}</p>
      </div>
      <div class="project-engine-cell">
        <span class="project-engine">${engineTag}${engineSub ? ' / ' + engineSub : ''}</span>
      </div>
      <div class="project-tags-cell">
        <div class="project-tech">${techBadges}</div>
      </div>
      <div class="project-links-cell">
        <div class="project-links">${links.join('')}</div>
      </div>
      <div class="project-status-cell">
        <span class="project-status ${statusClass}">${project.status}</span>
      </div>
    </div>
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