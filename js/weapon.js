/* ============================================
   WEAPON SYSTEM
   Analogy: Like your gun attachment in a first-person shooter
   Handles the visual gun model and shooting mechanics
   ============================================ */

const WeaponSystem = {
    gunGroup: null,
    slimeGlow: null,
    lastFireTime: 0,
    
    /**
     * Initialize the weapon model
     * Analogy: Like attaching a gun to your camera view
     */
    init(camera) {
        this.camera = camera;
        this.createGunModel();
        this.setupShooting();
    },
    
    /**
     * Create the 3D gun model
     * Analogy: Like building a LEGO gun from basic blocks
     */
    createGunModel() {
        this.gunGroup = new THREE.Group();
        
        // Gun barrel - the main tube
        const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const barrelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a4a4a,  // Dark gray metal
            metalness: 0.8,
            roughness: 0.3
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.z = Math.PI / 2;
        barrel.position.set(0.3, -0.2, -0.5);
        this.gunGroup.add(barrel);
        
        // Gun body - the handle
        const bodyGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.3);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,  // Brown wood handle
            roughness: 0.9
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0.3, -0.3, -0.4);
        this.gunGroup.add(body);
        
        // Slug slime glow effect - the power source
        // Analogy: Like the glowing LED on a gaming keyboard
        const slimeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const slimeMaterial = new THREE.MeshStandardMaterial({ 
            color: CONFIG.visuals.slugGlowColor,
            emissive: CONFIG.visuals.slugGlowColor,
            emissiveIntensity: 0.5
        });
        this.slimeGlow = new THREE.Mesh(slimeGeometry, slimeMaterial);
        this.slimeGlow.position.set(0.7, -0.2, -0.5);
        this.gunGroup.add(this.slimeGlow);
        
        // Add gun to camera
        this.camera.add(this.gunGroup);
    },
    
    /**
     * Setup shooting input
     * Analogy: Like programming the trigger on a controller
     */
    setupShooting() {
        document.addEventListener('mousedown', (event) => {
            if (event.button === 0) { // Left mouse button
                this.tryFire();
            }
        });
    },
    
    /**
     * Attempt to fire the weapon
     * Analogy: Like pulling a trigger - checks if you can fire first
     */
    tryFire() {
        if (!GameState.input.isLocked || GameState.isGameOver) return;
        
        // Check fire rate cooldown
        const currentTime = performance.now() / 1000;
        if (currentTime - this.lastFireTime < CONFIG.weapon.fireRate) return;
        
        this.lastFireTime = currentTime;
        this.fire();
    },
    
    /**
     * Fire the weapon
     * Analogy: Like shooting an arrow from a bow
     */
    fire() {
        // Get shooting direction from camera
        const shootDirection = new THREE.Vector3();
        this.camera.getWorldDirection(shootDirection);
        
        // Start position slightly in front of camera
        const shootPosition = this.camera.position.clone();
        shootPosition.add(shootDirection.clone().multiplyScalar(0.5));
        
        // Create projectile
        ProjectileManager.create(shootPosition, shootDirection);
        
        // Visual and animation effects
        this.playFireEffects();
    },
    
    /**
     * Play visual effects when firing
     * Analogy: Like the muzzle flash and recoil when firing a real gun
     */
    playFireEffects() {
        // Muzzle flash - bright glow
        this.slimeGlow.material.emissiveIntensity = 2;
        setTimeout(() => {
            this.slimeGlow.material.emissiveIntensity = 0.5;
        }, 100);
        
        // Gun recoil animation
        this.gunGroup.position.z += CONFIG.weapon.recoilDistance;
        setTimeout(() => {
            this.gunGroup.position.z -= CONFIG.weapon.recoilDistance;
        }, CONFIG.weapon.recoilDuration);
    },
    
    /**
     * Update weapon animations
     * Analogy: Like the breathing motion of holding a gun
     */
    update(delta) {
        // Pulsing glow effect
        // Analogy: Like a breathing LED indicator
        this.slimeGlow.material.emissiveIntensity = 
            0.5 + Math.sin(Date.now() * 0.005) * 0.3;
    }
};