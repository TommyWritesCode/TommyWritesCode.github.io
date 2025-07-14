// Sound Effects Manager
// Handles hover and click sounds with user preference respect

class SfxManager {
  constructor() {
    this.sounds = {};
    this.enabled = !localStorage.getItem('disableSfx');
    this.respectsMotion = true;
    
    this.init();
  }

  async init() {
    // Check user preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enabled = false;
      return;
    }

    // Preload sound files
    try {
      this.sounds.hover = new Audio('assets/sfx/hover.mp3');
      this.sounds.click = new Audio('assets/sfx/click.mp3');
      
      // Set volumes
      this.sounds.hover.volume = 0.4;
      this.sounds.click.volume = 0.6;
      
      // Preload
      this.sounds.hover.preload = 'auto';
      this.sounds.click.preload = 'auto';
      
    } catch (error) {
      console.log('Sound files not found, running in silent mode');
      this.enabled = false;
    }
  }

  playSound(type) {
    if (!this.enabled || !this.sounds[type]) return;
    
    try {
      this.sounds[type].currentTime = 0;
      this.sounds[type].play().catch(() => {
        // Autoplay prevented, that's fine
      });
    } catch (error) {
      // Sound failed, continue silently
    }
  }

  attachToElement(element) {
    if (!this.enabled) return;

    element.addEventListener('mouseenter', () => {
      this.playSound('hover');
    });

    element.addEventListener('click', () => {
      this.playSound('click');
    });
  }

  attachToSelector(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => this.attachToElement(el));
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('disableSfx', this.enabled ? '' : 'true');
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Global instance
const sfxManager = new SfxManager();

// Auto-attach to common interactive elements
document.addEventListener('DOMContentLoaded', () => {
  sfxManager.attachToSelector('a, button, .btn, .nav__link, .preview__link, .project-card, .blog-card');
  
  // Re-attach when new content is added dynamically
  const observer = new MutationObserver(() => {
    sfxManager.attachToSelector('a, button, .btn, .nav__link, .preview__link, .project-card, .blog-card');
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Export for use in other scripts
window.sfxManager = sfxManager;