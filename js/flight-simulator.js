/**
 * Pittsburgh Flight Simulator 3D
 * A fully functional 3D flight simulator featuring downtown Pittsburgh and Oakland
 * Built with Three.js for tommynicol.com
 */

class PittsburghFlightSimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.airplane = null;
        this.city = null;
        this.fuelCells = [];
        this.explosions = [];
        
        // Game state
        this.fuel = 100;
        this.score = 0;
        this.isGameOver = false;
        this.speed = 0;
        this.altitude = 50;
        
        // Controls
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        
        // Game settings
        this.maxSpeed = 2;
        this.fuelConsumption = 0.05;
        this.citySize = 200;
        this.buildingCount = 150;
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.createCity();
        this.createAirplane();
        this.createFuelCells();
        this.setupControls();
        this.setupHUD();
        this.setupLighting();
        this.animate();
        
        console.log('🛩️ Pittsburgh Flight Simulator initialized!');
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 400);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.offsetWidth / this.container.offsetHeight, 
            0.1, 
            1000
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        this.container.appendChild(this.renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
    }
    
    createAirplane() {
        const airplaneGroup = new THREE.Group();
        
        // Fuselage (main body)
        const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
        const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.rotation.z = Math.PI / 2;
        fuselage.castShadow = true;
        airplaneGroup.add(fuselage);
        
        // Wings
        const wingGeometry = new THREE.BoxGeometry(8, 0.2, 1.5);
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.castShadow = true;
        airplaneGroup.add(wings);
        
        // Tail
        const tailGeometry = new THREE.BoxGeometry(0.2, 2, 1);
        const tailMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-1.8, 0, 0);
        tail.castShadow = true;
        airplaneGroup.add(tail);
        
        // Propeller
        const propGeometry = new THREE.BoxGeometry(0.1, 3, 0.1);
        const propMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const propeller = new THREE.Mesh(propGeometry, propMaterial);
        propeller.position.set(2.2, 0, 0);
        airplaneGroup.add(propeller);
        this.propeller = propeller;
        
        // Position airplane
        airplaneGroup.position.set(0, 50, 0);
        this.airplane = airplaneGroup;
        this.scene.add(airplaneGroup);
        
        // Setup camera to follow airplane
        this.camera.position.set(-10, 5, 0);
        this.camera.lookAt(airplaneGroup.position);
    }
    
    createCity() {
        this.city = new THREE.Group();
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(this.citySize * 2, this.citySize * 2);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.city.add(ground);
        
        // Create rivers (Allegheny, Monongahela, Ohio)
        this.createRivers();
        
        // Create buildings for downtown Pittsburgh
        this.createDowntownBuildings();
        
        // Create Oakland area
        this.createOaklandBuildings();
        
        // Create bridges
        this.createBridges();
        
        this.scene.add(this.city);
    }
    
    createRivers() {
        const riverMaterial = new THREE.MeshLambertMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.8 });
        
        // Allegheny River
        const alleghenyGeometry = new THREE.PlaneGeometry(60, 8);
        const allegheny = new THREE.Mesh(alleghenyGeometry, riverMaterial);
        allegheny.rotation.x = -Math.PI / 2;
        allegheny.position.set(20, 0.1, -30);
        allegheny.rotation.z = 0.3;
        this.city.add(allegheny);
        
        // Monongahela River
        const monongahelaGeometry = new THREE.PlaneGeometry(50, 8);
        const monongahela = new THREE.Mesh(monongahelaGeometry, riverMaterial);
        monongahela.rotation.x = -Math.PI / 2;
        monongahela.position.set(15, 0.1, 30);
        monongahela.rotation.z = -0.2;
        this.city.add(monongahela);
        
        // Ohio River
        const ohioGeometry = new THREE.PlaneGeometry(80, 12);
        const ohio = new THREE.Mesh(ohioGeometry, riverMaterial);
        ohio.rotation.x = -Math.PI / 2;
        ohio.position.set(-20, 0.1, 0);
        ohio.rotation.z = 0.1;
        this.city.add(ohio);
    }
    
    createDowntownBuildings() {
        const buildings = [
            // PPG Place (iconic glass building)
            { x: 10, z: 0, width: 4, height: 40, depth: 4, color: 0x4169E1 },
            // US Steel Tower
            { x: 12, z: -5, width: 3, height: 60, depth: 3, color: 0x696969 },
            // BNY Mellon Center
            { x: 8, z: 3, width: 3.5, height: 45, depth: 3.5, color: 0x2F4F4F },
            // Heinz Tower
            { x: 15, z: 2, width: 3, height: 35, depth: 3, color: 0x8B4513 },
            // Fifth Avenue Place
            { x: 6, z: -2, width: 3, height: 30, depth: 3, color: 0x4682B4 },
        ];
        
        buildings.forEach(building => {
            const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
            const material = new THREE.MeshLambertMaterial({ color: building.color });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(building.x, building.height / 2, building.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.city.add(mesh);
        });
        
        // Add random smaller buildings
        for (let i = 0; i < 30; i++) {
            const geometry = new THREE.BoxGeometry(
                Math.random() * 3 + 1,
                Math.random() * 20 + 5,
                Math.random() * 3 + 1
            );
            const material = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.1, 0.5, 0.5) 
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
                (Math.random() - 0.5) * 40 + 10,
                geometry.parameters.height / 2,
                (Math.random() - 0.5) * 30
            );
            building.castShadow = true;
            building.receiveShadow = true;
            this.city.add(building);
        }
    }
    
    createOaklandBuildings() {
        // University of Pittsburgh - Cathedral of Learning
        const cathedralGeometry = new THREE.BoxGeometry(4, 50, 4);
        const cathedralMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
        const cathedral = new THREE.Mesh(cathedralGeometry, cathedralMaterial);
        cathedral.position.set(-30, 25, 20);
        cathedral.castShadow = true;
        cathedral.receiveShadow = true;
        this.city.add(cathedral);
        
        // Oakland buildings
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.BoxGeometry(
                Math.random() * 2 + 1,
                Math.random() * 15 + 5,
                Math.random() * 2 + 1
            );
            const material = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.05, 0.4, 0.6) 
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
                (Math.random() - 0.5) * 30 - 30,
                geometry.parameters.height / 2,
                (Math.random() - 0.5) * 25 + 20
            );
            building.castShadow = true;
            building.receiveShadow = true;
            this.city.add(building);
        }
    }
    
    createBridges() {
        const bridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        
        // Roberto Clemente Bridge
        const bridge1Geometry = new THREE.BoxGeometry(25, 1, 3);
        const bridge1 = new THREE.Mesh(bridge1Geometry, bridgeMaterial);
        bridge1.position.set(5, 8, -25);
        this.city.add(bridge1);
        
        // Andy Warhol Bridge
        const bridge2Geometry = new THREE.BoxGeometry(22, 1, 3);
        const bridge2 = new THREE.Mesh(bridge2Geometry, bridgeMaterial);
        bridge2.position.set(8, 8, -35);
        this.city.add(bridge2);
    }
    
    createFuelCells() {
        this.fuelCells = [];
        
        for (let i = 0; i < 15; i++) {
            const geometry = new THREE.OctahedronGeometry(1.5);
            const material = new THREE.MeshLambertMaterial({ 
                color: 0x00ff00,
                emissive: 0x002200
            });
            const fuelCell = new THREE.Mesh(geometry, material);
            
            // Random position around the city
            fuelCell.position.set(
                (Math.random() - 0.5) * this.citySize,
                Math.random() * 30 + 20,
                (Math.random() - 0.5) * this.citySize
            );
            
            fuelCell.userData = { rotation: Math.random() * 0.1 + 0.02 };
            this.fuelCells.push(fuelCell);
            this.scene.add(fuelCell);
        }
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // Mouse controls for camera
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });
    }
    
    setupHUD() {
        const hudHTML = `
            <div id="flight-hud" style="
                position: absolute;
                top: 10px;
                left: 10px;
                color: #00ff00;
                font-family: 'VT323', monospace;
                font-size: 18px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border: 2px solid #00ff00;
                border-radius: 5px;
                z-index: 1000;
            ">
                <div>FUEL: <span id="fuel-display">100</span>%</div>
                <div>SPEED: <span id="speed-display">0</span> mph</div>
                <div>ALTITUDE: <span id="altitude-display">50</span> ft</div>
                <div>SCORE: <span id="score-display">0</span></div>
                <div style="margin-top: 10px; font-size: 14px;">
                    WASD: Fly | Space: Up | Shift: Down
                </div>
            </div>
            
            <div id="fuel-bar" style="
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                width: 200px;
                height: 20px;
                border: 2px solid #00ff00;
                background: rgba(0, 0, 0, 0.7);
                z-index: 1000;
            ">
                <div id="fuel-fill" style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00);
                    transition: width 0.3s ease;
                "></div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', hudHTML);
    }
    
    updateControls() {
        if (this.isGameOver) return;
        
        const moveSpeed = 0.5;
        const rotationSpeed = 0.02;
        
        // Airplane movement
        if (this.keys['KeyW']) { // Forward
            this.airplane.translateX(moveSpeed);
            this.speed = Math.min(this.speed + 0.1, this.maxSpeed);
        }
        if (this.keys['KeyS']) { // Backward
            this.airplane.translateX(-moveSpeed * 0.5);
            this.speed = Math.max(this.speed - 0.1, 0);
        }
        if (this.keys['KeyA']) { // Turn left
            this.airplane.rotation.y += rotationSpeed;
            this.airplane.rotation.z = Math.min(this.airplane.rotation.z + 0.01, 0.3);
        }
        if (this.keys['KeyD']) { // Turn right
            this.airplane.rotation.y -= rotationSpeed;
            this.airplane.rotation.z = Math.max(this.airplane.rotation.z - 0.01, -0.3);
        }
        if (this.keys['Space']) { // Up
            this.airplane.position.y += moveSpeed * 0.7;
            this.airplane.rotation.x = Math.min(this.airplane.rotation.x + 0.01, 0.2);
        }
        if (this.keys['ShiftLeft']) { // Down
            this.airplane.position.y -= moveSpeed * 0.7;
            this.airplane.rotation.x = Math.max(this.airplane.rotation.x - 0.01, -0.2);
        }
        
        // Gradually return to level flight
        if (!this.keys['KeyA'] && !this.keys['KeyD']) {
            this.airplane.rotation.z *= 0.95;
        }
        if (!this.keys['Space'] && !this.keys['ShiftLeft']) {
            this.airplane.rotation.x *= 0.95;
        }
        
        // Consume fuel
        this.fuel -= this.fuelConsumption * (this.speed + 0.5);
        this.fuel = Math.max(0, this.fuel);
        
        // Update altitude
        this.altitude = Math.max(0, this.airplane.position.y);
        
        // Check for ground collision
        if (this.airplane.position.y <= 2) {
            this.crash();
        }
        
        // Check for fuel depletion
        if (this.fuel <= 0) {
            this.crash();
        }
    }
    
    updateCamera() {
        // Follow airplane with smooth camera movement
        const idealOffset = new THREE.Vector3(-15, 8, 0);
        idealOffset.applyQuaternion(this.airplane.quaternion);
        const idealPosition = this.airplane.position.clone().add(idealOffset);
        
        this.camera.position.lerp(idealPosition, 0.1);
        this.camera.lookAt(this.airplane.position);
    }
    
    checkCollisions() {
        if (this.isGameOver) return;
        
        // Check fuel cell collection
        this.fuelCells.forEach((fuelCell, index) => {
            const distance = this.airplane.position.distanceTo(fuelCell.position);
            if (distance < 3) {
                // Collect fuel cell
                this.scene.remove(fuelCell);
                this.fuelCells.splice(index, 1);
                this.fuel = Math.min(100, this.fuel + 20);
                this.score += 100;
                
                // Create new fuel cell
                this.createNewFuelCell();
                
                // Play collection sound
                if (window.sfxManager) {
                    window.sfxManager.playSound('special', 1.0);
                }
            }
        });
        
        // Check building collisions (simplified)
        this.city.children.forEach(building => {
            if (building.geometry && building.geometry.type === 'BoxGeometry') {
                const distance = this.airplane.position.distanceTo(building.position);
                const collisionRadius = Math.max(
                    building.geometry.parameters.width,
                    building.geometry.parameters.depth
                ) / 2 + 2;
                
                if (distance < collisionRadius && 
                    this.airplane.position.y < building.position.y + building.geometry.parameters.height / 2 &&
                    this.airplane.position.y > building.position.y - building.geometry.parameters.height / 2) {
                    this.crash();
                }
            }
        });
    }
    
    createNewFuelCell() {
        const geometry = new THREE.OctahedronGeometry(1.5);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x002200
        });
        const fuelCell = new THREE.Mesh(geometry, material);
        
        fuelCell.position.set(
            (Math.random() - 0.5) * this.citySize,
            Math.random() * 30 + 20,
            (Math.random() - 0.5) * this.citySize
        );
        
        fuelCell.userData = { rotation: Math.random() * 0.1 + 0.02 };
        this.fuelCells.push(fuelCell);
        this.scene.add(fuelCell);
    }
    
    crash() {
        if (this.isGameOver) return;
        
        this.isGameOver = true;
        this.createExplosion(this.airplane.position.clone());
        
        // Play explosion sound
        if (window.sfxManager) {
            window.sfxManager.playSound('achievement', 1.0);
        }
        
        // Show game over screen
        setTimeout(() => {
            alert(`Game Over! Final Score: ${this.score}\n\nClick OK to restart.`);
            this.restart();
        }, 1000);
    }
    
    createExplosion(position) {
        const explosionGroup = new THREE.Group();
        
        // Create explosion particles
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.2);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.5) 
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.copy(position);
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    Math.random() * 8 + 2,
                    (Math.random() - 0.5) * 10
                ),
                life: 1.0
            };
            
            explosionGroup.add(particle);
        }
        
        this.explosions.push(explosionGroup);
        this.scene.add(explosionGroup);
    }
    
    updateExplosions() {
        this.explosions.forEach((explosion, index) => {
            explosion.children.forEach(particle => {
                // Update particle physics
                particle.position.add(particle.userData.velocity);
                particle.userData.velocity.y -= 0.2; // Gravity
                particle.userData.life -= 0.02;
                
                // Fade out
                particle.material.opacity = particle.userData.life;
                particle.material.transparent = true;
            });
            
            // Remove dead explosions
            if (explosion.children[0] && explosion.children[0].userData.life <= 0) {
                this.scene.remove(explosion);
                this.explosions.splice(index, 1);
            }
        });
    }
    
    updateHUD() {
        document.getElementById('fuel-display').textContent = Math.round(this.fuel);
        document.getElementById('speed-display').textContent = Math.round(this.speed * 50);
        document.getElementById('altitude-display').textContent = Math.round(this.altitude);
        document.getElementById('score-display').textContent = this.score;
        
        // Update fuel bar
        const fuelFill = document.getElementById('fuel-fill');
        fuelFill.style.width = this.fuel + '%';
        
        if (this.fuel < 20) {
            fuelFill.style.background = '#ff0000';
        } else if (this.fuel < 50) {
            fuelFill.style.background = 'linear-gradient(90deg, #ff0000, #ffff00)';
        } else {
            fuelFill.style.background = 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00)';
        }
    }
    
    restart() {
        // Reset game state
        this.fuel = 100;
        this.score = 0;
        this.isGameOver = false;
        this.speed = 0;
        
        // Reset airplane position
        this.airplane.position.set(0, 50, 0);
        this.airplane.rotation.set(0, 0, 0);
        
        // Clear explosions
        this.explosions.forEach(explosion => {
            this.scene.remove(explosion);
        });
        this.explosions = [];
        
        // Reset fuel cells
        this.fuelCells.forEach(fuelCell => {
            this.scene.remove(fuelCell);
        });
        this.createFuelCells();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update game systems
        this.updateControls();
        this.updateCamera();
        this.checkCollisions();
        this.updateExplosions();
        this.updateHUD();
        
        // Animate fuel cells
        this.fuelCells.forEach(fuelCell => {
            fuelCell.rotation.y += fuelCell.userData.rotation;
            fuelCell.position.y += Math.sin(Date.now() * 0.001 + fuelCell.position.x) * 0.02;
        });
        
        // Animate propeller
        if (this.propeller) {
            this.propeller.rotation.x += 0.5;
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Export for use in other modules
window.PittsburghFlightSimulator = PittsburghFlightSimulator;