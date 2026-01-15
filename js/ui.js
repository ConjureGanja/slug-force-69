/* ============================================
   UI MANAGER
   Analogy: Like the dashboard and displays in a car
   Manages all HUD elements and screen updates
   ============================================ */

const UI = {
    elements: {
        healthBar: null,
        healthFill: null,
        healthText: null,
        ammoCounter: null,
        killCounter: null,
        gameOver: null,
        finalScore: null,
        restartBtn: null
    },
    
    /**
     * Initialize UI elements
     * Analogy: Like connecting all the gauges on a dashboard
     */
    init() {
        // Cache DOM elements for performance
        // Analogy: Like bookmarking frequently visited websites
        this.elements.healthBar = document.getElementById('healthBar');
        this.elements.healthFill = document.getElementById('healthFill');
        this.elements.healthText = document.getElementById('healthText');
        this.elements.ammoCounter = document.getElementById('ammoCounter');
        this.elements.killCounter = document.getElementById('killCounter');
        this.elements.gameOver = document.getElementById('gameOver');
        this.elements.finalScore = document.getElementById('finalScore');
        this.elements.restartBtn = document.getElementById('restartBtn');
        
        // Setup restart button
        this.elements.restartBtn.addEventListener('click', () => {
            this.restart();
        });
        
        // Initialize displays
        this.updateHealth(GameState.health, GameState.maxHealth);
        this.updateKills(GameState.kills);
    },
    
    /**
     * Update health bar display
     * Analogy: Like the fuel gauge dropping as you drive
     */
    updateHealth(health, maxHealth) {
        const healthPercent = health / maxHealth;
        this.elements.healthFill.style.width = (healthPercent * 100) + '%';
        this.elements.healthText.textContent = `HEALTH: ${Math.ceil(health)}`;
        
        // Change color based on health level
        // Analogy: Like a battery indicator changing from green to red
        if (healthPercent > 0.5) {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #0f0, #0a0)';
        } else if (healthPercent > 0.25) {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #ff0, #fa0)';
        } else {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #f00, #a00)';
        }
    },
    
    /**
     * Update kill counter
     * Analogy: Like updating a scoreboard in sports
     */
    updateKills(kills) {
        this.elements.killCounter.textContent = `KILLS: ${kills}`;
    },
    
    /**
     * Show game over screen
     * Analogy: Like the "Game Over" screen in arcade games
     */
    showGameOver(finalKills) {
        // Exit pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        
        // Display game over screen
        this.elements.gameOver.style.display = 'block';
        this.elements.finalScore.textContent = `Kills: ${finalKills}`;
    },
    
    /**
     * Hide game over screen
     * Analogy: Like closing a popup window
     */
    hideGameOver() {
        this.elements.gameOver.style.display = 'none';
    },
    
    /**
     * Restart the game
     * Analogy: Like inserting another coin in an arcade machine
     */
    restart() {
        // Reset game state
        GameState.reset();
        
        // Clear game objects
        EnemyManager.clear();
        ProjectileManager.clear();
        
        // Reset camera position
        SceneManager.camera.position.set(0, CONFIG.player.eyeHeight, 5);
        SceneManager.camera.rotation.set(0, 0, 0);
        
        // Reset UI
        this.hideGameOver();
        this.updateHealth(GameState.health, GameState.maxHealth);
        this.updateKills(GameState.kills);
        
        // Spawn initial enemies
        EnemyManager.spawnWave();
        
        // Request pointer lock to resume
        document.body.requestPointerLock();
    }
};