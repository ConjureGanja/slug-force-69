/* ============================================
   PROJECTILE MANAGER
   Analogy: Like an arrow tracker that monitors all flying projectiles
   Manages slug bullets: creation, movement, collision, and cleanup
   ============================================ */

const ProjectileManager = {
    projectiles: [],
    
    /**
     * Create a new projectile
     * Analogy: Like shooting an arrow - creates and tracks it in flight
     */
    create(position, direction) {
        // Limit max projectiles for performance
        // Analogy: Like only having so many arrows in your quiver
        if (this.projectiles.length >= CONFIG.performance.maxProjectiles) {
            this.removeOldest();
        }
        
        // Create slug bullet mesh
        const slugGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const slugMaterial = new THREE.MeshStandardMaterial({ 
            color: CONFIG.visuals.slugGlowColor,
            emissive: CONFIG.visuals.slugGlowColor,
            emissiveIntensity: 1
        });
        const slug = new THREE.Mesh(slugGeometry, slugMaterial);
        slug.position.copy(position);
        
        // Add glowing trail effect
        // Analogy: Like a tracer round that leaves a glowing path
        const trailGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({ 
            color: CONFIG.visuals.slugGlowColor,
            transparent: true,
            opacity: 0.3
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        slug.add(trail);
        
        SceneManager.scene.add(slug);
        
        // Store projectile data
        // Analogy: Like writing down details in an archer's logbook
        this.projectiles.push({
            mesh: slug,
            velocity: direction.clone().multiplyScalar(CONFIG.weapon.projectileSpeed),
            lifetime: CONFIG.weapon.projectileLifetime,
            startTime: performance.now() / 1000
        });
    },
    
    /**
     * Remove the oldest projectile
     * Analogy: Like removing the oldest item from a queue
     */
    removeOldest() {
        if (this.projectiles.length === 0) return;
        
        const oldest = this.projectiles.shift();
        SceneManager.scene.remove(oldest.mesh);
    },
    
    /**
     * Update all projectiles
     * Analogy: Like tracking each thrown baseball in flight
     */
    update(delta) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // Move projectile
            projectile.mesh.position.add(
                projectile.velocity.clone().multiplyScalar(delta)
            );
            
            // Update lifetime
            projectile.lifetime -= delta;
            
            // Remove old projectiles
            // Analogy: Like arrows that flew too far and disappeared
            if (projectile.lifetime <= 0) {
                SceneManager.scene.remove(projectile.mesh);
                this.projectiles.splice(i, 1);
            }
        }
    },
    
    /**
     * Check collisions with enemies
     * Analogy: Like a referee checking if the ball hit the target
     */
    checkCollisions(enemies) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                
                // Calculate distance between projectile and enemy
                const distance = projectile.mesh.position.distanceTo(
                    enemy.mesh.position
                );
                
                // Hit detection
                // Analogy: Like checking if a dart hit the dartboard
                if (distance < 1) {
                    // Hit!
                    EnemyManager.damage(enemy, CONFIG.weapon.damage);
                    
                    // Remove projectile
                    SceneManager.scene.remove(projectile.mesh);
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    },
    
    /**
     * Remove all projectiles
     * Analogy: Like clearing all bullets when resetting the game
     */
    clear() {
        for (const projectile of this.projectiles) {
            SceneManager.scene.remove(projectile.mesh);
        }
        this.projectiles = [];
    }
};