/******************************************
 * AOS (Animate On Scroll) Init
******************************************/
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
      duration: 800,
      once: true
    });
  });
  
  /******************************************
   * REMOVE LOADING SCREEN & REVEAL BODY
  ******************************************/
  window.addEventListener('load', () => {
    // Once content is loaded, remove 'loading' state
    setTimeout(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }, 800);
  });
  
  /******************************************
   * SCROLL PROGRESS BAR
  ******************************************/
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
  
  /******************************************
   * PARTICLE EFFECT IN HERO
  ******************************************/
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.getElementById('particles').appendChild(particle);
  
    particle.addEventListener('animationend', () => particle.remove());
  }
  setInterval(createParticle, 200);
  
  /******************************************
   * READING TIME ESTIMATOR
  ******************************************/
  const mainContent = document.querySelector('main');
  const readingTimeEl = document.getElementById('timeToRead');
  if (mainContent) {
    const text = mainContent.textContent.trim().split(/\s+/).length;
    const wordsPerMinute = 200; // typical reading speed
    const time = Math.ceil(text / wordsPerMinute);
    readingTimeEl.textContent = time;
  }
  
  /******************************************
   * INTERSECTION OBSERVER (Fade-in Sections)
  ******************************************/
  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    io.observe(section);
  });
  
  /******************************************
   * BACK TO TOP BUTTON
  ******************************************/
  const backToTopBtn = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTopBtn.style.opacity = '1';
    } else {
      backToTopBtn.style.opacity = '0';
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  /******************************************
   * SMOOTH SCROLL NAVIGATION (with offset)
  ******************************************/
  document.querySelectorAll('.sticky-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      const navHeight = document.querySelector('.sticky-nav').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
  
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
  
  /******************************************
   * DARK MODE TOGGLE
  ******************************************/
  const themeToggleBtn = document.getElementById('themeToggle');
  
  // Load saved theme from localStorage
  if (localStorage.getItem('hcTheme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.querySelector('.action-icon')?.textContent = '🌞';
  } else {
    themeToggleBtn.querySelector('.action-icon')?.textContent = '🌓';
  }
  
  // Toggle theme
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('hcTheme', isDark ? 'dark' : 'light');
    themeToggleBtn.querySelector('.action-icon').textContent = isDark ? '🌞' : '🌓';
  });
  
  /******************************************
   * SHARE MODAL & SOCIAL LINKS
  ******************************************/
  const shareBtn = document.getElementById('share');
  const shareModal = document.getElementById('shareModal');
  const modalClose = document.querySelector('.modal-close');
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareBtn.addEventListener('click', () => {
    shareModal.style.display = 'flex';
    shareModal.animate([
      { opacity: 0, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
  });
  
  modalClose.addEventListener('click', () => {
    shareModal.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.9)' }
    ], {
      duration: 300,
      easing: 'ease-in'
    }).onfinish = () => shareModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      modalClose.click();
    }
  });
  
  // Share Buttons Logic
  shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = window.location.href;
      const title = document.title;
  
      switch(btn.className.split(' ')[1]) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(url).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 2000);
          });
          break;
      }
    });
  });
  
  /******************************************
   * TABLE HOVER FIX FOR DARK MODE
  ******************************************/
  const tableRows = document.querySelectorAll('.testing-table tr');
  tableRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('dark-mode')) {
        row.style.background = '#2a2a2a';
      } else {
        row.style.background = '#f8f8f8';
      }
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = 'transparent';
    });
  });
  
  /******************************************
   * TOUCH SUPPORT FOR BACK TO TOP
  ******************************************/
  let touchStartY = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  });
  
  document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  });
  
  function handleSwipe() {
    const sensitivity = 100;
    if (touchStartY - touchEndY > sensitivity) {
      // Swipe up - hide button
      backToTopBtn.style.transform = 'translateY(80px)';
    } else if (touchEndY - touchStartY > sensitivity) {
      // Swipe down - show button if scrolled
      if (window.pageYOffset > 600) {
        backToTopBtn.style.transform = 'translateY(0)';
      }
    }
  }
  
  /******************************************
   * KEYBOARD ESC TO CLOSE MODAL
  ******************************************/
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareModal.style.display === 'flex') {
      modalClose.click();
    }
  });  