\# 🐌 Slug Force 69 - FPS Game



A 3D first-person shooter built with Three.js featuring slug-powered weaponry and wave-based combat.



\## 🎮 Features



\- \*\*Full 3D First-Person Movement\*\* - WASD movement with mouse look

\- \*\*Slug-Powered Weapon\*\* - Fire glowing green projectiles

\- \*\*Enemy AI\*\* - Melee enemies that chase and attack the player

\- \*\*Wave System\*\* - Increasing difficulty with progressive enemy spawns

\- \*\*Health \& Combat\*\* - Both player and enemies have health systems

\- \*\*Professional HUD\*\* - Health bar, ammo counter, kill counter, crosshair



\## 📁 Project Structure



```

slug-force-69/

├── index.html              # Main HTML entry point

├── css/

│   └── styles.css          # All game styles and HUD

├── js/

│   ├── config.js           # Game configuration and constants

│   ├── gameState.js        # Game state management

│   ├── scene.js            # Three.js scene setup

│   ├── controls.js         # Player input and movement

│   ├── weapon.js           # Weapon system and shooting

│   ├── projectiles.js      # Bullet management and collision

│   ├── enemies.js          # Enemy spawning and AI

│   ├── ui.js               # UI/HUD management

│   └── game.js             # Main game loop

└── assets/                 # Future assets (models, textures, sounds)

```



\## 🎯 Code Architecture



\### \*\*Modular Design\*\*

Each system is isolated in its own file:

\- \*\*config.js\*\* - Central configuration (like a settings file)

\- \*\*gameState.js\*\* - State management (like a save game file)

\- \*\*scene.js\*\* - 3D world setup (like building a stage)

\- \*\*controls.js\*\* - Input handling (like controller mapping)

\- \*\*weapon.js\*\* - Weapon mechanics (like a gun in an armory)

\- \*\*projectiles.js\*\* - Bullet physics (like arrow flight tracking)

\- \*\*enemies.js\*\* - AI and spawning (like a dungeon master)

\- \*\*ui.js\*\* - HUD updates (like a car dashboard)

\- \*\*game.js\*\* - Main loop (like a conductor orchestrating everything)



\### \*\*Key Concepts\*\*



\#### \*\*Game Loop\*\* (game.js)

```

Initialize → Animate → Update → Render → Repeat

```

Like a heartbeat that keeps the game running 60 times per second



\#### \*\*Entity Component System\*\*

\- Enemies are groups of 3D objects (body, head, eyes, health bar)

\- Each enemy has data (health, speed, position)

\- Analogy: Like building LEGO figures with different pieces and stats



\#### \*\*Collision Detection\*\*

```javascript

distance = projectile.position - enemy.position

if (distance < hitRange) → Hit!

```

Analogy: Like checking if a dart is close enough to hit the dartboard



\## 🎮 Controls



| Input | Action |

|-------|--------|

| \*\*WASD\*\* | Move Forward/Back/Left/Right |

| \*\*Mouse\*\* | Look Around |

| \*\*Left Click\*\* | Fire Weapon |

| \*\*Space\*\* | Jump |

| \*\*Click Screen\*\* | Lock Mouse (Start Game) |



\## 🚀 How to Run



\### Option 1: Local File

Simply open `index.html` in any modern web browser



\### Option 2: Local Server (Recommended)

```bash

\# Using Python 3

python -m http.server 8000



\# Using Node.js

npx http-server



\# Then visit: http://localhost:8000

```



\### Option 3: Live Server (VS Code)

Install "Live Server" extension and click "Go Live"



\## 🎨 Customization Guide



\### Change Difficulty

Edit `js/config.js`:

```javascript

enemy: {

&nbsp;   baseSpeed: 3,        // Make enemies faster/slower

&nbsp;   health: 100,         // Make enemies tougher/weaker

&nbsp;   attackDamage: 10,    // Make attacks stronger/weaker

}

```



\### Change Player Stats

Edit `js/config.js`:

```javascript

player: {

&nbsp;   moveSpeed: 10,       // Movement speed

&nbsp;   jumpForce: 8,        // Jump height

&nbsp;   mouseSensitivity: 0.002  // Look sensitivity

}

```



\### Change Visuals

Edit `js/config.js`:

```javascript

visuals: {

&nbsp;   skyColor: 0x87CEEB,      // Sky color (hex)

&nbsp;   groundColor: 0x228B22,   // Ground color (hex)

&nbsp;   slugGlowColor: 0x00ff00  // Weapon glow color

}

```



\## 📊 Performance Optimization



The codebase includes several optimizations:



1\. \*\*Object Pooling\*\* - Limits max projectiles to prevent memory leaks

2\. \*\*Efficient Updates\*\* - Delta time ensures smooth gameplay on any framerate

3\. \*\*LOD Considerations\*\* - Low-poly enemies for better performance

4\. \*\*Shadow Optimization\*\* - Configurable shadow map size

5\. \*\*Fog System\*\* - Hides distant rendering for better FPS



\## 🧩 Adding New Features



\### Add a New Enemy Type

1\. Create variant in `enemies.js` → `create()` function

2\. Pass different parameters (color, size, speed)

3\. Example: Fast red enemies vs slow blue tanks



\### Add Power-Ups

1\. Create new manager in `js/powerups.js`

2\. Similar to projectiles but with pickup logic

3\. Modify player stats on collection



\### Add Sound Effects

1\. Use Web Audio API or Howler.js

2\. Add to `weapon.js` fire() function

3\. Add to `enemies.js` for attack sounds



\## 🐛 Debugging Tips



\### No Visual / Black Screen

\- Check browser console (F12) for errors

\- Ensure Three.js CDN is loading

\- Verify scene background color is set



\### Enemies Not Spawning

\- Check `EnemyManager.spawnWave()` is called

\- Verify spawn distance allows visibility

\- Console log enemy positions



\### Controls Not Working

\- Ensure pointer lock is active (click screen)

\- Check GameState.input.isLocked is true

\- Verify event listeners are attached



\## 📖 Code Comments



Every file includes:

\- \*\*Section headers\*\* - What each part does

\- \*\*Analogies\*\* - Real-world comparisons for concepts

\- \*\*Inline comments\*\* - Explain complex logic



Example analogy system:

```javascript

// Analogy: Like a car's fuel gauge showing remaining gas

updateHealthBar() { ... }

```



\## 🎓 Learning Resources



This codebase demonstrates:

\- Three.js 3D graphics

\- Game loop architecture

\- Entity-component systems

\- Collision detection

\- AI pathfinding (basic)

\- State management

\- Event-driven programming



\## 📝 License



Free to use for learning and personal projects.



\## 🤝 Contributing



Feel free to:

\- Add new enemy types

\- Improve AI behavior

\- Add sound effects

\- Create new weapons

\- Optimize performance



---



\*\*Made with 🐌 by Slug Force Command\*\*

