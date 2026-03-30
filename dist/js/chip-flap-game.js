/**
 * HEX FLAP - CPU Data Path Navigation Game
 * Navigate data packets through CPU execution units and pipeline stages!
 * Built for tommynicol.com
 */

class ChipFlapGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, gameOver
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('chipFlap_highScore') || 0);
        this.frame = 0;
        
        // Bird (Hexadecimal Container)
        this.bird = {
            x: 80,
            y: this.canvas.height / 2,
            width: 38,
            height: 26,
            velocity: 0,
            rotation: 0,
            trail: [],
            baseWidth: 38,
            baseHeight: 26
        };
        
        // Physics
        this.gravity = 0.4;
        this.jumpForce = -8;
        this.maxVelocity = 12;
        
        // Pipes (Circuit Boards)
        this.pipes = [];
        this.pipeWidth = 60;
        this.pipeGap = 140;
        this.pipeSpeed = 2;
        
        // Particles
        this.particles = [];
        this.sparkles = [];
        
        // Background
        this.bgOffset = 0;
        this.bgSpeed = 0.5;
        
        // Colors (retro computer theme)
        this.colors = {
            bg: '#001122',
            bgSecondary: '#002244',
            chip: '#00ff00',
            chipSecondary: '#00cc00',
            circuit: '#0088ff',
            circuitDark: '#0066cc',
            particles: '#ffff00',
            text: '#00ffff',
            danger: '#ff0066'
        };
        
        this.init();
    }
    
    init() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.setupControls();
        this.gameLoop();
        
        console.log('🔌 CHIP FLAP game initialized!');
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.handleInput();
            }
        });
        
        // Mouse/touch controls
        this.canvas.addEventListener('click', () => this.handleInput());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });
    }
    
    handleInput() {
        if (this.gameState === 'menu') {
            this.startGame();
        } else if (this.gameState === 'playing') {
            this.jump();
        } else if (this.gameState === 'gameOver') {
            this.resetGame();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.pipes = [];
        this.particles = [];
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
        this.bird.trail = [];
        this.frame = 0;
        
        // Play start sound
        this.playSound('start');
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.pipes = [];
        this.particles = [];
        this.sparkles = [];
        this.bird.trail = [];
    }
    
    jump() {
        this.bird.velocity = this.jumpForce;
        this.bird.rotation = -0.3;
        
        // Add jump particles
        this.createParticles(this.bird.x + this.bird.width/2, this.bird.y + this.bird.height/2, 5);
        
        // Play jump sound
        this.playSound('jump');
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.frame++;
        
        // Update bird physics
        this.updateBird();
        
        // Update pipes
        this.updatePipes();
        
        // Update particles
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
        
        // Update background
        this.bgOffset += this.bgSpeed;
    }
    
    updateBird() {
        // Apply gravity
        this.bird.velocity += this.gravity;
        this.bird.velocity = Math.min(this.bird.velocity, this.maxVelocity);
        
        // Update position
        this.bird.y += this.bird.velocity;
        
        // Update rotation based on velocity
        this.bird.rotation = Math.max(-0.5, Math.min(0.5, this.bird.velocity * 0.05));
        
        // Add trail effect
        this.bird.trail.push({
            x: this.bird.x + this.bird.width/2,
            y: this.bird.y + this.bird.height/2,
            life: 20
        });
        
        // Limit trail length
        if (this.bird.trail.length > 10) {
            this.bird.trail.shift();
        }
        
        // Update trail life
        this.bird.trail.forEach(point => point.life--);
        this.bird.trail = this.bird.trail.filter(point => point.life > 0);
        
        // Check boundaries
        if (this.bird.y < 0 || this.bird.y + this.bird.height > this.canvas.height) {
            this.gameOver();
        }
    }
    
    updatePipes() {
        // Spawn new pipes
        if (this.frame % 120 === 0) {
            this.createPipe();
        }
        
        // Update existing pipes
        this.pipes.forEach((pipe, index) => {
            pipe.x -= this.pipeSpeed;
            
            // Check if pipe passed bird (score)
            if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.scored = true;
                this.score++;
                this.createSparkles(this.bird.x, this.bird.y);
                this.playSound('score');
            }
            
            // Remove off-screen pipes
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(index, 1);
            }
        });
    }
    
    createPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            bottomHeight: this.canvas.height - (topHeight + this.pipeGap),
            scored: false
        });
    }
    
    updateParticles() {
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // Update sparkles
        this.sparkles.forEach((sparkle, index) => {
            sparkle.life--;
            sparkle.rotation += sparkle.rotSpeed;
            sparkle.scale = Math.sin(sparkle.life * 0.2) * 0.5 + 0.5;
            
            if (sparkle.life <= 0) {
                this.sparkles.splice(index, 1);
            }
        });
    }
    
    createParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                life: 30,
                maxLife: 30,
                alpha: 1,
                size: Math.random() * 3 + 1
            });
        }
    }
    
    createSparkles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.sparkles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                life: 60,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                scale: 1,
                size: Math.random() * 8 + 4
            });
        }
    }
    
    checkCollisions() {
        // Check pipe collisions
        this.pipes.forEach(pipe => {
            // Top pipe collision
            if (this.bird.x < pipe.x + this.pipeWidth &&
                this.bird.x + this.bird.width > pipe.x &&
                this.bird.y < pipe.topHeight) {
                this.gameOver();
            }
            
            // Bottom pipe collision
            if (this.bird.x < pipe.x + this.pipeWidth &&
                this.bird.x + this.bird.width > pipe.x &&
                this.bird.y + this.bird.height > pipe.bottomY) {
                this.gameOver();
            }
        });
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('chipFlap_highScore', this.highScore.toString());
        }
        
        // Create explosion particles
        this.createParticles(this.bird.x + this.bird.width/2, this.bird.y + this.bird.height/2, 20);
        
        // Play game over sound
        this.playSound('gameOver');
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw animated background
        this.drawBackground();
        
        if (this.gameState === 'playing') {
            this.drawGame();
        } else if (this.gameState === 'menu') {
            this.drawMenu();
        } else if (this.gameState === 'gameOver') {
            this.drawGame();
            this.drawGameOver();
        }
    }
    
    drawBackground() {
        // CPU pipeline stage background
        this.ctx.strokeStyle = this.colors.bgSecondary;
        this.ctx.lineWidth = 1;
        
        const stageWidth = 40;
        const offset = this.bgOffset % stageWidth;
        
        // Pipeline stage dividers (vertical lines)
        for (let x = -offset; x < this.canvas.width + stageWidth; x += stageWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Data bus lines (horizontal lines)
        const busSpacing = 25;
        for (let y = busSpacing; y < this.canvas.height; y += busSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Pipeline stage labels and control points
        this.ctx.fillStyle = this.colors.circuit;
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'center';
        
        const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
        let stageIndex = 0;
        
        for (let x = stageWidth/2 - offset; x < this.canvas.width + stageWidth; x += stageWidth) {
            // Stage label
            this.ctx.fillText(stages[stageIndex % stages.length], x, 15);
            
            // Control logic nodes
            for (let y = 30; y < this.canvas.height - 20; y += 50) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            stageIndex++;
        }
    }
    
    drawGame() {
        // Draw execution units
        this.drawPipes();
        
        // Draw particles
        this.drawParticles();
        
        // Draw bird trail
        this.drawBirdTrail();
        
        // Draw bird (computer chip)
        this.drawBird();
        
        // Draw sparkles
        this.drawSparkles();
        
        // Draw UI
        this.drawUI();
    }
    
    drawBird() {
        this.ctx.save();
        
        // Update bird size based on score (grows with score)
        const sizeMultiplier = 1 + (this.score * 0.02); // Grows by 2% per point
        this.bird.width = Math.min(this.bird.baseWidth * sizeMultiplier, 65); // Max size cap
        this.bird.height = Math.min(this.bird.baseHeight * sizeMultiplier, 42);
        
        // Move to bird center for rotation
        this.ctx.translate(this.bird.x + this.bird.width/2, this.bird.y + this.bird.height/2);
        this.ctx.rotate(this.bird.rotation);
        
        // Draw hexadecimal container border
        this.ctx.strokeStyle = this.colors.chip;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-this.bird.width/2, -this.bird.height/2, this.bird.width, this.bird.height);
        
        // Draw container background
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(-this.bird.width/2 + 2, -this.bird.height/2 + 2, this.bird.width - 4, this.bird.height - 4);
        
        // Draw hexadecimal score inside container
        const hexScore = '0x' + this.score.toString(16).toUpperCase();
        this.ctx.fillStyle = this.colors.chip;
        
        // Adjust font size based on container size and text length
        let fontSize = Math.min(this.bird.width / (hexScore.length * 0.55), this.bird.height * 0.45);
        fontSize = Math.max(fontSize, 9); // Minimum font size
        
        this.ctx.font = `${fontSize}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(hexScore, 0, 0);
        
        // Add corner brackets for hex container aesthetic
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 1;
        const cornerSize = Math.min(this.bird.width, this.bird.height) * 0.15;
        
        // Top-left corner
        this.ctx.beginPath();
        this.ctx.moveTo(-this.bird.width/2, -this.bird.height/2 + cornerSize);
        this.ctx.lineTo(-this.bird.width/2, -this.bird.height/2);
        this.ctx.lineTo(-this.bird.width/2 + cornerSize, -this.bird.height/2);
        this.ctx.stroke();
        
        // Top-right corner
        this.ctx.beginPath();
        this.ctx.moveTo(this.bird.width/2 - cornerSize, -this.bird.height/2);
        this.ctx.lineTo(this.bird.width/2, -this.bird.height/2);
        this.ctx.lineTo(this.bird.width/2, -this.bird.height/2 + cornerSize);
        this.ctx.stroke();
        
        // Bottom-left corner
        this.ctx.beginPath();
        this.ctx.moveTo(-this.bird.width/2, this.bird.height/2 - cornerSize);
        this.ctx.lineTo(-this.bird.width/2, this.bird.height/2);
        this.ctx.lineTo(-this.bird.width/2 + cornerSize, this.bird.height/2);
        this.ctx.stroke();
        
        // Bottom-right corner
        this.ctx.beginPath();
        this.ctx.moveTo(this.bird.width/2 - cornerSize, this.bird.height/2);
        this.ctx.lineTo(this.bird.width/2, this.bird.height/2);
        this.ctx.lineTo(this.bird.width/2, this.bird.height/2 - cornerSize);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawBirdTrail() {
        this.bird.trail.forEach((point, index) => {
            const alpha = point.life / 20;
            // Draw hex-style square trail with border
            this.ctx.strokeStyle = `rgba(0, 255, 0, ${alpha * 0.6})`;
            this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.2})`;
            this.ctx.lineWidth = 1;
            const size = alpha * 6;
            
            this.ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
            this.ctx.strokeRect(point.x - size/2, point.y - size/2, size, size);
        });
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            // Top execution unit
            this.drawExecutionUnit(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            
            // Bottom execution unit
            this.drawExecutionUnit(pipe.x, pipe.bottomY, this.pipeWidth, pipe.bottomHeight);
        });
    }
    
    drawExecutionUnit(x, y, width, height) {
        // Execution unit background
        this.ctx.fillStyle = this.colors.circuit;
        this.ctx.fillRect(x, y, width, height);
        
        // Unit outline
        this.ctx.strokeStyle = this.colors.circuitDark;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Data paths (horizontal lines representing data buses)
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        
        const pathCount = Math.floor(height / 20);
        for (let i = 0; i < pathCount; i++) {
            const pathY = y + 10 + i * 20;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 3, pathY);
            this.ctx.lineTo(x + width - 3, pathY);
            this.ctx.stroke();
        }
        
        // Logic gates and ALU components
        this.ctx.fillStyle = this.colors.particles;
        this.ctx.strokeStyle = this.colors.particles;
        this.ctx.lineWidth = 1;
        
        const gateCount = Math.floor(height / 30);
        for (let i = 0; i < gateCount; i++) {
            const gateY = y + 15 + i * 30;
            // Draw simple logic gate symbols
            this.ctx.fillRect(x + 8, gateY, 6, 6);
            this.ctx.fillRect(x + width - 14, gateY, 6, 6);
            
            // Connection lines
            this.ctx.beginPath();
            this.ctx.moveTo(x + 14, gateY + 3);
            this.ctx.lineTo(x + width - 8, gateY + 3);
            this.ctx.stroke();
        }
        
        // Pipeline stage indicators
        this.ctx.fillStyle = this.colors.chipSecondary;
        this.ctx.font = '8px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('EX', x + width/2, y + height - 5);
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(255, 255, 0, ${particle.alpha})`;
            this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
        });
    }
    
    drawSparkles() {
        this.sparkles.forEach(sparkle => {
            this.ctx.save();
            this.ctx.translate(sparkle.x, sparkle.y);
            this.ctx.rotate(sparkle.rotation);
            this.ctx.scale(sparkle.scale, sparkle.scale);
            
            this.ctx.fillStyle = this.colors.particles;
            this.ctx.fillRect(-sparkle.size/2, -1, sparkle.size, 2);
            this.ctx.fillRect(-1, -sparkle.size/2, 2, sparkle.size);
            
            this.ctx.restore();
        });
    }
    
    drawUI() {
        // Score
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '32px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.score, this.canvas.width / 2, 50);
        
        // High score (smaller)
        this.ctx.font = '16px monospace';
        this.ctx.fillText(`HI: ${this.highScore}`, this.canvas.width / 2, 75);
    }
    
    drawMenu() {
        // Title
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HEX FLAP', this.canvas.width / 2, this.canvas.height / 2 - 80);
        
        // Subtitle
        this.ctx.font = '20px monospace';
        this.ctx.fillStyle = this.colors.chip;
        this.ctx.fillText('Navigate data through CPU pipeline stages!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        // Instructions
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = this.colors.text;
        this.ctx.fillText('Click, tap, or press SPACE to control data flow', this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText('Watch your data packet grow through execution!', this.canvas.width / 2, this.canvas.height / 2 + 40);
        
        // Start prompt
        this.ctx.font = 'bold 24px monospace';
        this.ctx.fillStyle = this.colors.particles;
        const alpha = Math.sin(this.frame * 0.1) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        this.ctx.fillText('CLICK TO START', this.canvas.width / 2, this.canvas.height / 2 + 100);
        
        // High score
        if (this.highScore > 0) {
            this.ctx.font = '18px monospace';
            this.ctx.fillStyle = this.colors.circuit;
            this.ctx.fillText(`Best Score: ${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 140);
        }
    }
    
    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game Over text
        this.ctx.fillStyle = this.colors.danger;
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PIPELINE HAZARD', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        // Score
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '24px monospace';
        const hexScore = '0x' + this.score.toString(16).toUpperCase();
        this.ctx.fillText(`Instructions: ${hexScore}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        // High score
        if (this.score === this.highScore && this.score > 0) {
            this.ctx.fillStyle = this.colors.particles;
            this.ctx.font = '20px monospace';
            this.ctx.fillText('NEW THROUGHPUT RECORD!', this.canvas.width / 2, this.canvas.height / 2 + 10);
        } else {
            this.ctx.fillStyle = this.colors.circuit;
            this.ctx.font = '18px monospace';
            const hexBest = '0x' + this.highScore.toString(16).toUpperCase();
            this.ctx.fillText(`Best: ${hexBest}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        }
        
        // Restart prompt
        this.ctx.font = '20px monospace';
        this.ctx.fillStyle = this.colors.chip;
        this.ctx.fillText('Click to reset pipeline', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
    
    playSound(type) {
        // Integrate with website sound system
        if (window.sfxManager) {
            switch (type) {
                case 'jump':
                    window.sfxManager.playSound('hover', 0.3);
                    break;
                case 'score':
                    window.sfxManager.playSound('special', 0.5);
                    break;
                case 'gameOver':
                    window.sfxManager.playSound('achievement', 0.7);
                    break;
                case 'start':
                    window.sfxManager.playSound('button', 0.5);
                    break;
            }
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // Utility method to resize canvas
    resize() {
        const container = this.canvas.parentElement;
        const maxWidth = container.offsetWidth - 40;
        const maxHeight = 600;
        
        if (maxWidth < 800) {
            const scale = maxWidth / 800;
            this.canvas.style.width = maxWidth + 'px';
            this.canvas.style.height = (600 * scale) + 'px';
        } else {
            this.canvas.style.width = '800px';
            this.canvas.style.height = '600px';
        }
    }
}

// Export for use
window.ChipFlapGame = ChipFlapGame;