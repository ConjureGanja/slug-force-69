/* ============================================
   ENEMY MANAGER
   Analogy: Like a dungeon master spawning and controlling monsters
   Manages enemy spawning, AI, combat, and health
   ============================================ */

const EnemyManager = {
    enemies: [],
    
    /**
     * Create a single enemy
     * Analogy: Like spawning a zombie in a horror game
     */
    create(position) {
        const enemyGroup = new THREE.Group();
        
        // Enemy body
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: CONFIG.visuals.enemyColor,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.position.y = 0.75;
        enemyGroup.add(body);
        
        // Enemy head
        const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000,  // Dark red
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.position.y = 1.8;
        enemyGroup.add(head);
        
        // Enemy eyes - glowing yellow
        // Analogy: Like the glowing eyes of a predator in the dark
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.9, 0.35);
        enemyGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.9, 0.35);
        enemyGroup.add(rightEye);
        
        // Health bar above head
        // Analogy: Like HP bars in RPG games
        const healthBarGeometry = new THREE.PlaneGeometry(1, 0.1);
        const healthBarMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            side: THREE.DoubleSide
        });
        const healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
        healthBar.position.y = 2.5;
        enemyGroup.add(healthBar);
        
        // Position and add to scene
        enemyGroup.position.copy(position);
        SceneManager.scene.add(enemyGroup);
        
        // Store enemy data
        // Analogy: Like an enemy stat card in a tabletop game
        const enemy = {
            mesh: enemyGroup,
            health: CONFIG.enemy.health,
            maxHealth: CONFIG.enemy.health,
            healthBar: healthBar,
            speed: CONFIG.enemy.baseSpeed,
            attackCooldown: 0,
            attackRange: CONFIG.enemy.attackRange
        };
        
        this.enemies.push(enemy);
        return enemy;
    },
    
    /**
     * Spawn a wave of enemies
     * Analogy: Like monsters spawning from dungeon portals in a circle
     */
    spawnWave() {
        // Calculate enemy count based on progression
        // Analogy: Like difficulty scaling in video games
        const spawnCount = Math.floor(
            CONFIG.waves.baseEnemyCount + 
            (GameState.kills * CONFIG.waves.enemiesPerKill)
        );
        
        for (let i = 0; i < spawnCount; i++) {
            // Random spawn position around player
            // Analogy: Like spawn points arranged in a circle
            const angle = (Math.PI * 2 * i) / spawnCount;
            const distance = CONFIG.enemy.spawnDistance + 
                Math.random() * (CONFIG.enemy.spawnDistanceMax - CONFIG.enemy.spawnDistance);
            
            const spawnPos = new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );
            
            this.create(spawnPos);
        }
    },
    
    /**
     * Update enemy AI and behavior
     * Analogy: Like programming heat-seeking missiles to chase targets
     */
    update(delta, playerPosition) {
        for (const enemy of this.enemies) {
            // Calculate direction to player
            const directionToPlayer = new THREE.Vector3();
            directionToPlayer.subVectors(playerPosition, enemy.mesh.position);
            directionToPlayer.y = 0; // Stay on ground
            const distanceToPlayer = directionToPlayer.length();
            directionToPlayer.normalize();
            
            // Move towards player
            // Analogy: Like a zombie walking toward the player
            enemy.mesh.position.add(
                directionToPlayer.multiplyScalar(enemy.speed * delta)
            );
            
            // Rotate to face player
            // Analogy: Like turning your head to look at someone
            enemy.mesh.lookAt(
                playerPosition.x, 
                enemy.mesh.position.y, 
                playerPosition.z
            );
            
            // Attack if in range
            if (distanceToPlayer < enemy.attackRange) {
                enemy.attackCooldown -= delta;
                
                if (enemy.attackCooldown <= 0) {
                    this.attackPlayer(enemy);
                    enemy.attackCooldown = CONFIG.enemy.attackCooldown;
                }
            }
        }
    },
    
    /**
     * Enemy attacks the player
     * Analogy: Like a monster biting the player in range
     */
    attackPlayer(enemy) {
        const newHealth = GameState.takeDamage(CONFIG.enemy.attackDamage);
        UI.updateHealth(newHealth, GameState.maxHealth);
        
        // Visual feedback - screen flash
        // Analogy: Like the red vignette when hurt in shooters
        SceneManager.scene.background.set(0xff0000);
        setTimeout(() => {
            SceneManager.scene.background.set(CONFIG.visuals.skyColor);
        }, 100);
        
        if (GameState.isGameOver) {
            UI.showGameOver(GameState.kills);
        }
    },
    
    /**
     * Damage an enemy
     * Analogy: Like reducing HP in Pokemon
     */
    damage(enemy, amount) {
        enemy.health -= amount;
        
        // Update health bar visual
        const healthPercent = enemy.health / enemy.maxHealth;
        enemy.healthBar.scale.x = healthPercent;
        
        // Change color based on health
        // Analogy: Like a traffic light - green = good, yellow = caution, red = danger
        if (healthPercent > 0.5) {
            enemy.healthBar.material.color.setHex(0x00ff00); // Green
        } else if (healthPercent > 0.25) {
            enemy.healthBar.material.color.setHex(0xffff00); // Yellow
        } else {
            enemy.healthBar.material.color.setHex(0xff0000); // Red
        }
        
        // Check if enemy is dead
        if (enemy.health <= 0) {
            this.remove(enemy);
            GameState.addKill();
            UI.updateKills(GameState.kills);
            
            // Spawn new wave if running low on enemies
            // Analogy: Like reinforcements arriving in a battle
            if (this.enemies.length < CONFIG.waves.minEnemiesAlive) {
                this.spawnWave();
            }
        }
    },
    
    /**
     * Remove an enemy from the game
     * Analogy: Like removing a chess piece from the board
     */
    remove(enemy) {
        SceneManager.scene.remove(enemy.mesh);
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    },
    
    /**
     * Clear all enemies
     * Analogy: Like clearing the board when starting a new game
     */
    clear() {
        for (const enemy of this.enemies) {
            SceneManager.scene.remove(enemy.mesh);
        }
        this.enemies = [];
    }
};