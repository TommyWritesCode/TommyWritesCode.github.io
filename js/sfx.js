// Sound Effects Manager
// Handles hover and click sounds with user preference respect

class SfxManager {
  constructor() {
    this.sounds = {};
    this.enabled = !localStorage.getItem('disableSfx');
    this.respectsMotion = true;
    this.audioContext = null;
    this.userInteracted = false;
    
    this.init();
    this.setupUserInteractionListener();
  }

  async init() {
    // Check user preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enabled = false;
      return;
    }

    // Initialize Web Audio API for immediate sound playback
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.createSyntheticSounds();
    } catch (error) {
      console.log('Web Audio API not supported, fallback to HTML5 audio');
      this.initHTMLAudio();
    }
  }

  setupUserInteractionListener() {
    // Listen for any user interaction to enable audio context
    const enableAudio = () => {
      this.userInteracted = true;
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);
    document.addEventListener('touchstart', enableAudio);
  }

  createSyntheticSounds() {
    // Create synthetic sounds using Web Audio API - these work immediately
    this.sounds.hover = () => this.playBeep(600, 50, 0.03);
    this.sounds.click = () => this.playBeep(1000, 100, 0.05);
  }

  initHTMLAudio() {
    // Fallback to HTML5 audio
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
      console.log('Sound files not found, using synthetic sounds');
      this.createSyntheticSounds();
    }
  }

  playBeep(frequency = 800, duration = 100, volume = 0.05) {
    if (!this.audioContext || !this.enabled) return;
    
    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      // Sound failed, continue silently
    }
  }

  playSound(type) {
    if (!this.enabled || !this.sounds[type]) return;
    
    try {
      if (typeof this.sounds[type] === 'function') {
        // Synthetic sound function
        this.sounds[type]();
      } else {
        // HTML5 Audio object
        this.sounds[type].currentTime = 0;
        this.sounds[type].play().catch(() => {
          // Autoplay prevented, that's fine
        });
      }
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