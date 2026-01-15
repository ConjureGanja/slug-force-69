/* ============================================
   MAIN GAME LOOP
   Analogy: Like the conductor orchestrating all musicians in a symphony
   Initializes all systems and runs the game loop
   ============================================ */

const Game = {
    /**
     * Initialize the entire game
     * Analogy: Like booting up a computer - initializes all components
     */
    init() {
        console.log('🐌 Initializing Slug Force 69...');
        
        // Initialize all game systems in order
        // Analogy: Like starting up different parts of a car engine
        SceneManager.init();
        UI.init();
        PlayerControls.init(SceneManager.camera);
        WeaponSystem.init(SceneManager.camera);
        
        // Add camera to scene (with weapon attached)
        SceneManager.scene.add(SceneManager.camera);
        
        // Spawn initial enemy wave
        EnemyManager.spawnWave();
        
        // Start the game loop
        this.animate();
        
        console.log('✅ Game initialized successfully!');
        console.log('📋 Click to lock cursor and start playing');
    },
    
    /**
     * Main game loop - runs every frame
     * Analogy: Like a heartbeat that keeps the game alive
     * This function calls itself recursively to create continuous animation
     */
    animate() {
        // Request next frame
        // Analogy: Like scheduling the next tick of a clock
        requestAnimationFrame(() => this.animate());
        
        // Skip updates if game is over
        if (GameState.isGameOver) {
            SceneManager.render();
            return;
        }
        
        // Get time since last frame (delta time)
        // Analogy: Like measuring time between heartbeats
        const delta = SceneManager.getDelta();
        
        // Update all game systems
        // Analogy: Like updating each department in a company
        this.update(delta);
        
        // Render the frame
        // Analogy: Like taking a photograph of the current moment
        SceneManager.render();
    },
    
    /**
     * Update all game systems
     * Analogy: Like updating each piece on a chess board during a turn
     */
    update(delta) {
        // Update player movement and controls
        PlayerControls.update(delta);
        
        // Update weapon animations
        WeaponSystem.update(delta);
        
        // Update projectiles (bullets flying)
        ProjectileManager.update(delta);
        
        // Check for bullet hits
        ProjectileManager.checkCollisions(EnemyManager.enemies);
        
        // Update enemy AI and movement
        EnemyManager.update(delta, SceneManager.camera.position);
    }
};

// ============================================
// START THE GAME
// Analogy: Like pressing the power button on a console
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

// ============================================
// HANDLE TAB VISIBILITY
// Analogy: Like pausing a video when you switch tabs
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause clock when tab is hidden
        SceneManager.clock.stop();
    } else {
        // Resume clock when tab is visible
        SceneManager.clock.start();
    }
});