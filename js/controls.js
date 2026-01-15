/* ============================================
   PLAYER CONTROLS
   Analogy: Like the steering wheel, pedals, and controls in a car
   Handles input, camera rotation, and player movement
   ============================================ */

const PlayerControls = {
    euler: null,
    
    /**
     * Initialize player controls
     * Analogy: Like calibrating a game controller before playing
     */
    init(camera) {
        this.camera = camera;
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        
        // Setup event listeners
        this.setupPointerLock();
        this.setupKeyboardInput();
        this.setupMouseInput();
    },
    
    /**
     * Setup pointer lock for mouse control
     * Analogy: Like going into full-screen mode in a video game
     */
    setupPointerLock() {
        document.addEventListener('click', () => {
            if (!GameState.isGameOver && !GameState.input.isLocked) {
                document.body.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            GameState.input.isLocked = document.pointerLockElement === document.body;
        });
    },
    
    /**
     * Setup keyboard input handlers
     * Analogy: Like programming which buttons do what on a TV remote
     */
    setupKeyboardInput() {
        // Key down events
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'KeyW':
                    GameState.input.forward = true;
                    break;
                case 'KeyS':
                    GameState.input.backward = true;
                    break;
                case 'KeyA':
                    GameState.input.left = true;
                    break;
                case 'KeyD':
                    GameState.input.right = true;
                    break;
                case 'Space':
                    if (GameState.input.canJump) {
                        GameState.velocity.y = CONFIG.player.jumpForce;
                        GameState.input.canJump = false;
                    }
                    break;
            }
        });
        
        // Key up events
        document.addEventListener('keyup', (event) => {
            switch(event.code) {
                case 'KeyW':
                    GameState.input.forward = false;
                    break;
                case 'KeyS':
                    GameState.input.backward = false;
                    break;
                case 'KeyA':
                    GameState.input.left = false;
                    break;
                case 'KeyD':
                    GameState.input.right = false;
                    break;
            }
        });
    },
    
    /**
     * Setup mouse movement for camera rotation
     * Analogy: Like turning your head to look around
     */
    setupMouseInput() {
        document.addEventListener('mousemove', (event) => {
            if (!GameState.input.isLocked) return;
            
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;
            
            // Update camera rotation
            this.euler.setFromQuaternion(this.camera.quaternion);
            this.euler.y -= movementX * CONFIG.player.mouseSensitivity;
            this.euler.x -= movementY * CONFIG.player.mouseSensitivity;
            
            // Clamp vertical rotation (prevent looking too far up/down)
            this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
            
            this.camera.quaternion.setFromEuler(this.euler);
        });
    },
    
    /**
     * Update player movement based on input
     * Analogy: Like moving a chess piece on the board
     */
    update(delta) {
        if (!GameState.input.isLocked || GameState.isGameOver) return;
        
        // Apply gravity
        GameState.velocity.y -= CONFIG.player.gravity * delta;
        
        // Calculate movement direction based on input
        const direction = new THREE.Vector3();
        direction.z = Number(GameState.input.forward) - Number(GameState.input.backward);
        direction.x = Number(GameState.input.right) - Number(GameState.input.left);
        direction.normalize();
        
        // Get camera orientation vectors
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();
        
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
        cameraRight.normalize();
        
        // Calculate movement vector
        const moveVector = new THREE.Vector3();
        
        if (GameState.input.forward || GameState.input.backward) {
            moveVector.add(
                cameraDirection.multiplyScalar(-direction.z * CONFIG.player.moveSpeed * delta)
            );
        }
        
        if (GameState.input.left || GameState.input.right) {
            moveVector.add(
                cameraRight.multiplyScalar(-direction.x * CONFIG.player.moveSpeed * delta)
            );
        }
        
        // Apply horizontal movement
        this.camera.position.add(moveVector);
        
        // Apply vertical movement (jumping/falling)
        this.camera.position.y += GameState.velocity.y * delta;
        
        // Ground collision
        if (this.camera.position.y < CONFIG.player.eyeHeight) {
            this.camera.position.y = CONFIG.player.eyeHeight;
            GameState.velocity.y = 0;
            GameState.input.canJump = true;
        }
    }
};