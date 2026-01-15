/* ============================================
   SCENE SETUP
   Analogy: Like building a movie set with lights, camera, and props
   Initializes the 3D world, camera, renderer, and lighting
   ============================================ */

const SceneManager = {
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    
    /**
     * Initialize the entire 3D scene
     * Analogy: Like setting up a theater stage before the show
     */
    init() {
        // Create the scene - the container for all 3D objects
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.visuals.skyColor);
        this.scene.fog = new THREE.Fog(CONFIG.visuals.skyColor, 0, CONFIG.visuals.fogDistance);
        
        // Create the camera - your eyes in the game world
        // Analogy: Like wearing a GoPro on your head
        this.camera = new THREE.PerspectiveCamera(
            75,  // Field of view - like peripheral vision
            window.innerWidth / window.innerHeight,
            0.1,  // Near clipping plane
            1000  // Far clipping plane
        );
        this.camera.position.set(0, CONFIG.player.eyeHeight, 5);
        
        // Create the renderer - paints everything to the screen
        // Analogy: Like a movie projector displaying frames
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: CONFIG.performance.antialias 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        
        // Clock for timing - tracks deltaTime
        // Analogy: Like a stopwatch for frame timing
        this.clock = new THREE.Clock();
        
        // Setup lighting
        this.initLighting();
        
        // Create the ground
        this.createGround();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    },
    
    /**
     * Setup scene lighting
     * Analogy: Like positioning stage lights in a theater
     */
    initLighting() {
        // Ambient light - general scene illumination
        // Analogy: Like the overall daylight in a room
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light - the main sun
        // Analogy: Like the sun casting shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        
        // Shadow camera settings
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.mapSize.width = CONFIG.performance.shadowMapSize;
        directionalLight.shadow.mapSize.height = CONFIG.performance.shadowMapSize;
        
        this.scene.add(directionalLight);
    },
    
    /**
     * Create the ground plane
     * Analogy: Like laying down grass on a football field
     */
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: CONFIG.visuals.groundColor,
            roughness: 0.8 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Make horizontal
        ground.receiveShadow = true;
        this.scene.add(ground);
    },
    
    /**
     * Handle window resize events
     * Analogy: Like adjusting a TV picture when changing screen size
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    /**
     * Render the scene
     * Analogy: Like taking a photograph of the current frame
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    },
    
    /**
     * Get delta time for frame-independent movement
     * Analogy: Like measuring the time between heartbeats
     */
    getDelta() {
        return this.clock.getDelta();
    }
};