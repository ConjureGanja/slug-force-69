/* ============================================
   GAME STATE MANAGER
   Analogy: Like a scoreboard keeper that tracks all important game data
   Central store for all game-related data
   ============================================ */

const GameState = {
    // Player stats
    health: 100,
    maxHealth: 100,
    ammo: Infinity,
    kills: 0,
    score: 0,
    
    // Game flow
    isGameOver: false,
    isPaused: false,
    
    // Input tracking
    input: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        canJump: true,
        isLocked: false
    },
    
    // Movement physics
    velocity: new THREE.Vector3(),
    
    // Methods for game state management
    
    /**
     * Reset game state to initial values
     * Analogy: Like hitting the reset button on an arcade machine
     */
    reset() {
        this.health = this.maxHealth;
        this.ammo = Infinity;
        this.kills = 0;
        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.velocity.set(0, 0, 0);
        
        // Reset input state
        this.input = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            canJump: true,
            isLocked: false
        };
    },
    
    /**
     * Take damage and update health
     * Analogy: Like losing hearts in Zelda
     */
    takeDamage(amount) {
        this.health -= amount;
        this.health = Math.max(0, this.health);
        
        if (this.health <= 0) {
            this.isGameOver = true;
        }
        
        return this.health;
    },
    
    /**
     * Add to kill count
     * Analogy: Like scoring a point in basketball
     */
    addKill() {
        this.kills++;
        this.score += 100; // Points per kill
    },
    
    /**
     * Get current health percentage
     * Analogy: Like checking your phone battery percentage
     */
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
};