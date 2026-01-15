/* ============================================
   GAME CONFIGURATION
   Analogy: Like the settings menu in a game - all tunable values in one place
   ============================================ */

const CONFIG = {
    // Player settings
    player: {
        moveSpeed: 10,          // How fast the player moves (like a car's speed)
        jumpForce: 8,           // How high the player jumps (like spring strength)
        eyeHeight: 1.6,         // Camera height in meters (human eye level)
        gravity: 25,            // Downward force (like Earth's gravity)
        mouseSensitivity: 0.002 // Mouse look speed (like mouse DPI setting)
    },
    
    // Weapon settings
    weapon: {
        projectileSpeed: 50,    // How fast bullets fly (like arrow velocity)
        projectileLifetime: 3.0,// How long bullets last before disappearing (seconds)
        damage: 50,             // Damage per hit (half enemy health)
        fireRate: 0.1,          // Minimum time between shots (seconds)
        recoilDistance: 0.05,   // Gun kickback amount
        recoilDuration: 50      // Gun recovery time (milliseconds)
    },
    
    // Enemy settings
    enemy: {
        baseSpeed: 3,           // Base movement speed (slower than player)
        health: 100,            // Starting health per enemy
        attackDamage: 10,       // Damage per melee attack
        attackRange: 1.5,       // How close they need to be to attack (meters)
        attackCooldown: 1.0,    // Time between attacks (seconds)
        spawnDistance: 15,      // Minimum spawn distance from player
        spawnDistanceMax: 25    // Maximum spawn distance from player
    },
    
    // Wave system
    waves: {
        baseEnemyCount: 3,      // Starting enemies per wave
        enemiesPerKill: 0.2,    // Additional enemies per kill milestone
        minEnemiesAlive: 2      // Minimum enemies before spawning new wave
    },
    
    // Visual settings
    visuals: {
        fogDistance: 100,       // How far you can see (meters)
        skyColor: 0x87CEEB,     // Sky blue color
        groundColor: 0x228B22,  // Forest green color
        slugGlowColor: 0x00ff00,// Bright green for slug effects
        enemyColor: 0xff0000    // Red for enemies
    },
    
    // Performance settings
    performance: {
        shadowMapSize: 1024,    // Shadow quality (higher = better but slower)
        antialias: true,        // Smooth edges (true = better quality)
        maxProjectiles: 50      // Maximum bullets on screen at once
    }
};

// Make CONFIG globally accessible but prevent modification
// Analogy: Like read-only game settings that can't be changed during gameplay
Object.freeze(CONFIG);