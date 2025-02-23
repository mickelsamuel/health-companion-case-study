document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    once: true,
    disable: 'mobile',
    startEvent: 'load',
    offset: 0,
    delay: 0
  });
  
  setTimeout(() => { AOS.refresh(); }, 500);
  
  window.addEventListener('load', function() {
    document.body.classList.add('content-loaded');
  });

  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.getElementById('particles').appendChild(particle);
    
    particle.addEventListener('animationend', () => particle.remove());
  }
  setInterval(createParticle, 200);

  const calculateReadingTime = () => {
    const mainContent = document.querySelector('main');
    const readingTimeEl = document.getElementById('timeToRead');
    
    if (!mainContent || !readingTimeEl) return;
    
    const text = mainContent.textContent
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    
    const wordCount = text.split(' ').filter(word => word.length > 0).length;
    const time = Math.max(Math.ceil(wordCount / 200), 3);
    
    readingTimeEl.textContent = time;
  };
  
  calculateReadingTime();
  window.addEventListener('load', calculateReadingTime);

  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => io.observe(section));

  const backToTopBtn = document.getElementById('toTop');
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('.sticky-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      const navHeight = document.querySelector('.sticky-nav').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
      
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  const themeToggleBtn = document.getElementById('themeToggle');
  if (localStorage.getItem('hcTheme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.querySelector('.action-icon').textContent = '🌞';
  } else {
    themeToggleBtn.querySelector('.action-icon').textContent = '🌓';
  }
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('hcTheme', isDark ? 'dark' : 'light');
    themeToggleBtn.querySelector('.action-icon').textContent = isDark ? '🌞' : '🌓';
  });

  const shareBtn = document.getElementById('share');
  const shareModal = document.getElementById('shareModal');
  const modalClose = document.querySelector('.modal-close');
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareBtn.addEventListener('click', () => {
    shareModal.style.display = 'flex';
    shareModal.animate([
      { opacity: 0, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
  });
  
  modalClose.addEventListener('click', () => {
    shareModal.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.9)' }
    ], { duration: 300, easing: 'ease-in' }).onfinish = () => {
      shareModal.style.display = 'none';
    };
  });
  
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      modalClose.click();
    }
  });
  
  shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = window.location.href;
      const title = document.title;
      const encodedUrl = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);
      const shareType = btn.className.split(' ')[1];
    
      switch(shareType) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, '_blank');
          break;
        case 'reddit':
          window.open(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
          break;
        case 'instagram':
          alert('Instagram sharing is not supported via web. Please use the Instagram app.');
          break;
        case 'snapchat':
          alert('Snapchat sharing is not supported via web. Please use the Snapchat app.');
          break;
        case 'copy':
          navigator.clipboard.writeText(url).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 2000);
          });
          break;
        default:
          console.warn('Unknown share option');
      }
    });
  });

  const zoomOverlay = document.getElementById('zoomOverlay');
  const zoomImage = document.getElementById('zoomImage');
  const zoomClose = document.getElementById('zoomClose');
  
  document.addEventListener('click', (e) => {
    if (e.target.matches('img:not(.action-icon, .persona-img)')) {
      zoomOverlay.style.display = 'flex';
      zoomImage.src = e.target.src;
      zoomImage.alt = e.target.alt || 'Zoomed content';
    }
  });
  
  zoomClose.addEventListener('click', () => {
    zoomOverlay.style.display = 'none';
  });
  
  zoomOverlay.addEventListener('click', (e) => {
    if (e.target === zoomOverlay) {
      zoomOverlay.style.display = 'none';
    }
  });

  const navLinks = document.querySelectorAll('.sticky-nav a');
  const sectionMap = {};
  sections.forEach(section => {
    sectionMap[section.id] = document.querySelector(`.sticky-nav a[href="#${section.id}"]`);
  });
  
  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const link = sectionMap[entry.target.id];
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => highlightObserver.observe(section));

  try {
  } catch (error) {
    console.error('Initialization error:', error);
  }
});