// Advanced Sound Effects Manager
// Optimized Web Audio API implementation with page-specific themes

class SfxManager {
  constructor() {
    this.sounds = {};
    this.soundBuffers = {};
    this.enabled = !localStorage.getItem('disableSfx');
    this.respectsMotion = true;
    this.audioContext = null;
    this.userInteracted = false;
    this.currentPageTheme = this.detectPageTheme();
    this.activeNodes = new Set(); // Track active audio nodes for cleanup
    this.maxConcurrentSounds = 8; // Limit concurrent sounds for performance
    this.soundQueue = [];
    
    this.init();
    this.setupAutoEnable();
    this.setupKeyboardInstrument();
    this.setupPerformanceOptimizations();
  }

  detectPageTheme() {
    const path = window.location.pathname;
    if (path.includes('index') || path === '/') return 'home';
    if (path.includes('about')) return 'about';
    if (path.includes('projects')) return 'projects';
    if (path.includes('blog')) return 'blog';
    if (path.includes('contact')) return 'contact';
    if (path.includes('philosophy')) return 'philosophy';
    return 'default';
  }

  async init() {
    // Check user preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enabled = false;
      return;
    }

    // Don't initialize AudioContext until user interaction
    // This prevents the "AudioContext was not allowed to start" error
    this.createPageSpecificSounds();
  }

  setupAutoEnable() {
    // Initialize AudioContext for all possible interaction scenarios
    const enableAudio = async () => {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          this.userInteracted = true;
        } catch (error) {
          console.log('Web Audio API not supported');
          this.enabled = false;
          return;
        }
      }
      
      this.userInteracted = true;
      this.removeEnableListeners();
    };

    // Enhanced listener setup for all interaction types
    this.enableAudio = enableAudio;
    
    // Immediate activation events
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('mousemove', enableAudio, { once: true });
    
    // Window focus events for immediate readiness
    window.addEventListener('focus', enableAudio, { once: true });
    window.addEventListener('blur', () => {
      // Re-enable on next focus if needed
      if (this.userInteracted) {
        window.addEventListener('focus', enableAudio, { once: true });
      }
    });
    
    // Navigation events
    window.addEventListener('popstate', enableAudio, { once: true });
    document.addEventListener('DOMContentLoaded', enableAudio, { once: true });
    
    // Enhanced mouse events for immediate hover readiness
    document.addEventListener('mouseenter', enableAudio, { once: true });
    document.addEventListener('mouseover', enableAudio, { once: true });
    
    // Aggressive activation for preview cards
    document.addEventListener('mousedown', enableAudio, { once: true });
    document.addEventListener('scroll', enableAudio, { once: true, passive: true });
    document.addEventListener('wheel', enableAudio, { once: true, passive: true });
    
    // Force activation on any preview card interaction
    setTimeout(() => {
      const previewCards = document.querySelectorAll('.preview__card, .project-card, .blog-card');
      previewCards.forEach(card => {
        card.addEventListener('mouseenter', enableAudio, { once: true });
        card.addEventListener('focusin', enableAudio, { once: true });
      });
    }, 100);
  }

  removeEnableListeners() {
    document.removeEventListener('click', this.enableAudio);
    document.removeEventListener('keydown', this.enableAudio);
    document.removeEventListener('touchstart', this.enableAudio);
    document.removeEventListener('mousemove', this.enableAudio);
    document.removeEventListener('mouseenter', this.enableAudio);
    document.removeEventListener('mouseover', this.enableAudio);
    window.removeEventListener('focus', this.enableAudio);
    window.removeEventListener('popstate', this.enableAudio);
    document.removeEventListener('DOMContentLoaded', this.enableAudio);
  }

  setupPerformanceOptimizations() {
    // Cleanup inactive audio nodes periodically
    setInterval(() => {
      this.cleanupActiveNodes();
    }, 5000); // Clean up every 5 seconds
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.cleanupActiveNodes();
      }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanupAll();
    });
  }

  cleanupActiveNodes() {
    // Remove finished nodes from tracking
    this.activeNodes.forEach(node => {
      if (node.playbackState === 'finished' || node._finished) {
        this.activeNodes.delete(node);
      }
    });
  }

  cleanupAll() {
    // Stop all active sounds and clean up
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Node already stopped
      }
    });
    this.activeNodes.clear();
    this.soundQueue = [];
  }

  createPageSpecificSounds() {
    // Create consistent button/click sounds across all pages for continuity
    const universalSounds = {
      // Consistent button sounds for important actions
      hover: (vol = 1.0) => this.playBufferedAlienBeep(440, 90, 0.018 * vol, 'triangle', 0.3),
      click: (vol = 1.0) => this.playBufferedAlienBeep(660, 120, 0.022 * vol, 'sine', 0.5),
      nav: (vol = 1.0) => this.playBufferedAlienBeep(330, 85, 0.016 * vol, 'triangle', 0.4),
      button: (vol = 1.0) => this.playBufferedAlienBeep(880, 110, 0.02 * vol, 'sine', 0.6),
      link: (vol = 1.0) => this.playBufferedAlienBeep(495, 80, 0.016 * vol, 'sine', 0.3),
      special: (vol = 1.0) => this.playAlienArpeggio([440, 554, 659, 880], 'universal'),
      achievement: (vol = 1.0) => this.playAchievementBeep(vol)
    };

    // Page-specific preview/card sounds for unique experience
    const pageSpecificCards = {
      home: {
        // Warm, welcoming alien sunset vibes for preview cards
        card: (vol = 1.0) => this.playBufferedAlienBeep(550, 100, 0.018 * vol, 'triangle', 0.4),
        preview: (vol = 1.0) => this.playBufferedAlienBeep(495, 95, 0.017 * vol, 'sine', 0.35)
      },
      about: {
        // Introspective, deeper tones for preview cards
        card: (vol = 1.0) => this.playBufferedAlienBeep(466, 105, 0.018 * vol, 'sawtooth', 0.4),
        preview: (vol = 1.0) => this.playBufferedAlienBeep(415, 100, 0.017 * vol, 'triangle', 0.35)
      },
      projects: {
        // Technical, precise beeps for preview cards
        card: (vol = 1.0) => this.playBufferedAlienBeep(659, 95, 0.018 * vol, 'square', 0.2),
        preview: (vol = 1.0) => this.playBufferedAlienBeep(587, 90, 0.017 * vol, 'square', 0.25)
      },
      blog: {
        // Thoughtful, flowing tones for preview cards
        card: (vol = 1.0) => this.playBufferedAlienBeep(440, 110, 0.018 * vol, 'sine', 0.5),
        preview: (vol = 1.0) => this.playBufferedAlienBeep(392, 105, 0.017 * vol, 'triangle', 0.45)
      },
      contact: {
        // Communicative, clear tones for preview cards
        card: (vol = 1.0) => this.playBufferedAlienBeep(831, 90, 0.018 * vol, 'triangle', 0.3),
        preview: (vol = 1.0) => this.playBufferedAlienBeep(740, 85, 0.017 * vol, 'sine', 0.32)
      },
      philosophy: {
        // Contemplative, resonant tones for preview cards
        card: (vol = 1.0) => this.playBufferedAlienBeep(369, 120, 0.018 * vol, 'sawtooth', 0.6),
        preview: (vol = 1.0) => this.playBufferedAlienBeep(330, 115, 0.017 * vol, 'triangle', 0.55)
      }
    };

    // Combine universal sounds with page-specific card sounds
    const pageCards = pageSpecificCards[this.currentPageTheme] || pageSpecificCards.home;
    this.sounds = { ...universalSounds, ...pageCards };
  }

  initHTMLAudio() {
    // Fallback to HTML5 audio
    try {
      this.sounds.hover = new Audio('assets/sfx/hover.mp3');
      this.sounds.click = new Audio('assets/sfx/click.mp3');
      
      // Set consistent, ear-safe volumes
      this.sounds.hover.volume = 0.15;
      this.sounds.click.volume = 0.18;
      
      // Preload
      this.sounds.hover.preload = 'auto';
      this.sounds.click.preload = 'auto';
      
    } catch (error) {
      console.log('Sound files not found, using synthetic sounds');
      this.createPageSpecificSounds();
    }
  }

  playBufferedAlienBeep(frequency = 800, duration = 100, volume = 0.02, waveType = 'square', resonance = 0.3) {
    if (!this.audioContext || !this.enabled) return;
    
    // Performance optimization: limit concurrent sounds
    if (this.activeNodes.size >= this.maxConcurrentSounds) {
      return; // Skip if too many sounds are playing
    }
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();
      
      // Track nodes for cleanup
      this.activeNodes.add(oscillator);
      this.activeNodes.add(gainNode);
      this.activeNodes.add(filterNode);
      
      // Create alien sunset atmosphere
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set wave type for variety
      oscillator.type = waveType;
      oscillator.frequency.value = frequency;
      
      // Add ethereal frequency modulation
      const currentTime = this.audioContext.currentTime;
      const bufferTime = 0.003; // 3ms buffer for smooth transition
      const totalDuration = bufferTime + duration / 1000;
      
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * (1 + resonance * 0.05), 
        currentTime + bufferTime + duration / 3000
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * (1 - resonance * 0.02), 
        currentTime + totalDuration
      );
      
      // Create warm, alien filter sweep
      filterNode.type = 'lowpass';
      filterNode.frequency.value = frequency * (2 + resonance);
      filterNode.Q.value = 3 + resonance * 5;
      
      // Smooth, buffered envelope with tiny silence buffer
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.setValueAtTime(0, currentTime + bufferTime); // Maintain silence during buffer
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, currentTime + bufferTime + 0.005);
      gainNode.gain.linearRampToValueAtTime(volume, currentTime + bufferTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.1, currentTime + bufferTime + duration / 1500);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + totalDuration);
      
      // Auto-cleanup when sound finishes
      oscillator.addEventListener('ended', () => {
        this.activeNodes.delete(oscillator);
        this.activeNodes.delete(gainNode);
        this.activeNodes.delete(filterNode);
        oscillator._finished = true;
        gainNode._finished = true;
        filterNode._finished = true;
      });
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + totalDuration);
    } catch (error) {
      // Sound failed, continue silently
    }
  }

  playAlienBeep(frequency = 800, duration = 100, volume = 0.02, waveType = 'square', resonance = 0.3) {
    // Legacy method - redirect to buffered version
    this.playBufferedAlienBeep(frequency, duration, volume, waveType, resonance);
  }

  playAlienArpeggio(notes = [440, 554, 659, 880], theme = 'home') {
    if (!this.audioContext || !this.enabled) return;
    
    // Play atmospheric alien arpeggio based on page theme with buffering
    const themeSettings = {
      home: { waveType: 'triangle', resonance: 0.5, spacing: 60 },
      about: { waveType: 'sawtooth', resonance: 0.6, spacing: 80 },
      projects: { waveType: 'square', resonance: 0.2, spacing: 45 },
      blog: { waveType: 'sine', resonance: 0.7, spacing: 70 },
      contact: { waveType: 'triangle', resonance: 0.4, spacing: 55 },
      philosophy: { waveType: 'sawtooth', resonance: 0.8, spacing: 90 },
      universal: { waveType: 'sine', resonance: 0.4, spacing: 50 }
    };
    
    const settings = themeSettings[theme] || themeSettings.home;
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playBufferedAlienBeep(freq, 80, 0.015, settings.waveType, settings.resonance);
      }, index * settings.spacing);
    });
  }

  playAchievementBeep(vol = 1.0) {
    if (!this.audioContext || !this.enabled) return;
    
    // Create a satisfying retro achievement sound progression
    const achievementNotes = [
      { freq: 523, delay: 0, duration: 120, wave: 'triangle', vol: 0.025 * vol },     // C5
      { freq: 659, delay: 80, duration: 120, wave: 'sine', vol: 0.028 * vol },       // E5
      { freq: 784, delay: 160, duration: 160, wave: 'triangle', vol: 0.032 * vol },  // G5
      { freq: 1047, delay: 280, duration: 200, wave: 'sine', vol: 0.035 * vol }     // C6
    ];
    
    achievementNotes.forEach(note => {
      setTimeout(() => {
        this.playBufferedAlienBeep(note.freq, note.duration, note.vol, note.wave, 0.6);
      }, note.delay);
    });
    
    // Add a final satisfying harmonic burst
    setTimeout(() => {
      this.playBufferedAlienBeep(1047, 250, 0.04 * vol, 'triangle', 0.8);
      this.playBufferedAlienBeep(1319, 200, 0.03 * vol, 'sine', 0.7);
    }, 480);
  }

  playSound(type, volumeMultiplier = 1.0) {
    if (!this.enabled || !this.sounds[type]) return;
    
    try {
      if (typeof this.sounds[type] === 'function') {
        // Synthetic sound function with volume adjustment
        this.sounds[type](volumeMultiplier);
      } else {
        // HTML5 Audio object
        this.sounds[type].currentTime = 0;
        this.sounds[type].volume = Math.min(this.sounds[type].volume * volumeMultiplier, 1.0);
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

    // Determine sound type and volume based on element class/type
    let hoverSound = 'hover';
    let clickSound = 'click';
    let volumeMultiplier = 1.0;
    
    if (element.classList.contains('nav__link')) {
      hoverSound = 'nav';
      clickSound = 'nav';
      volumeMultiplier = 1.0; // Same as primary button
    } else if (element.classList.contains('btn--primary') || element.classList.contains('btn--secondary')) {
      hoverSound = 'button';
      clickSound = 'button';
      volumeMultiplier = 1.0; // Primary button volume (perfect level)
    } else if (element.classList.contains('btn') || element.tagName === 'BUTTON') {
      hoverSound = 'button';
      clickSound = 'button';
      volumeMultiplier = 1.0; // Same as primary button
    } else if (element.classList.contains('preview__card')) {
      // Preview cards get page-specific sounds
      hoverSound = 'preview';
      clickSound = 'preview';
      volumeMultiplier = 0.85; // Slightly quieter but very close to primary button
    } else if (element.classList.contains('project-card') || element.classList.contains('blog-card')) {
      // Other cards get page-specific sounds
      hoverSound = 'card';
      clickSound = 'card';
      volumeMultiplier = 0.85; // Slightly quieter but very close to primary button
    } else if (element.tagName === 'A') {
      hoverSound = 'link';
      clickSound = 'link';
      volumeMultiplier = 1.0; // Same as primary button
    }
    
    // Special easter egg for logo
    if (element.classList.contains('nav__logo')) {
      hoverSound = 'special';
      clickSound = 'special';
      volumeMultiplier = 1.0;
    }

    element.addEventListener('mouseenter', () => {
      this.playSound(hoverSound, volumeMultiplier);
    });

    element.addEventListener('click', () => {
      this.playSound(clickSound, volumeMultiplier);
    });
  }

  attachToSelector(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => this.attachToElement(el));
  }

  setupKeyboardInstrument() {
    // Allow users to play alien sounds using keyboard as an instrument
    document.addEventListener('keydown', (event) => {
      if (!this.enabled || event.repeat) return;
      
      // Only activate when not typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
      
      // Map keys to different alien sounds - themed to current page with buffer
      const keyMap = {
        'q': () => this.playBufferedAlienBeep(261, 120, 0.018, 'triangle', 0.4),    // C4
        'w': () => this.playBufferedAlienBeep(294, 120, 0.018, 'sine', 0.5),        // D4
        'e': () => this.playBufferedAlienBeep(329, 120, 0.018, 'sawtooth', 0.3),    // E4
        'r': () => this.playBufferedAlienBeep(349, 120, 0.018, 'triangle', 0.4),    // F4
        't': () => this.playBufferedAlienBeep(392, 120, 0.018, 'sine', 0.5),        // G4
        'y': () => this.playBufferedAlienBeep(440, 120, 0.018, 'sawtooth', 0.3),    // A4
        'u': () => this.playBufferedAlienBeep(494, 120, 0.018, 'triangle', 0.4),    // B4
        'i': () => this.playBufferedAlienBeep(523, 120, 0.018, 'sine', 0.5),        // C5
        'a': () => this.playBufferedAlienBeep(185, 150, 0.022, 'square', 0.6),      // Bass F#3
        's': () => this.playBufferedAlienBeep(208, 150, 0.022, 'square', 0.6),      // Bass G#3
        'd': () => this.playBufferedAlienBeep(233, 150, 0.022, 'square', 0.6),      // Bass A#3
        'f': () => this.playBufferedAlienBeep(262, 150, 0.022, 'square', 0.6),      // Bass C4
        'g': () => this.playBufferedAlienBeep(294, 150, 0.022, 'square', 0.6),      // Bass D4
        'h': () => this.playBufferedAlienBeep(330, 150, 0.022, 'square', 0.6),      // Bass E4
        'j': () => this.playBufferedAlienBeep(370, 150, 0.022, 'square', 0.6),      // Bass F#4
        'k': () => this.playBufferedAlienBeep(415, 150, 0.022, 'square', 0.6),      // Bass G#4
        'z': () => this.playAlienArpeggio([440, 554, 659, 880], this.currentPageTheme),  // Page-themed arpeggio
        'x': () => this.playBufferedAlienBeep(800, 80, 0.016, 'triangle', 0.2),     // High beep
        'c': () => this.playBufferedAlienBeep(1200, 60, 0.016, 'sine', 0.3),        // Higher beep
        'v': () => this.playBufferedAlienBeep(1600, 40, 0.016, 'sawtooth', 0.2),    // Highest beep
      };
      
      if (keyMap[event.key.toLowerCase()]) {
        keyMap[event.key.toLowerCase()]();
        event.preventDefault();
      }
    });
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
  sfxManager.attachToSelector('a, button, .btn, .nav__link, .preview__link, .preview__card, .project-card, .blog-card');
  
  // Re-attach when new content is added dynamically
  const observer = new MutationObserver(() => {
    sfxManager.attachToSelector('a, button, .btn, .nav__link, .preview__link, .preview__card, .project-card, .blog-card');
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Export for use in other scripts
window.sfxManager = sfxManager;