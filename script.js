//Imports
import * as THREE from './three.js-master/build/three.module.js';
import Stats from './three.js-master/examples/jsm/libs/stats.module.js';

let scene, camera, renderer, ambient, stats;

// Window resize manager
const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - 1, window.innerHeight - 1);
};

// Init three.js
function init() {
    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load('ressources/NormalMap2.png');

    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    // Scene
    scene = new THREE.Scene();

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 5000);
    camera.position.setZ(5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        //Background of THREE.js transparent, we can see the website background 
        alpha:true, 
    });

    // Objects
    const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCnt = 5000;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let j = 0; j < particlesCnt * 3; j++){ 
        //Particles centered
        posArray[j] = (Math.random() - 0.5) * 9;
    };

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Materials
    const material = new THREE.PointsMaterial({ 
        size : 0.009,
    });
    const particlesMaterial = new THREE.PointsMaterial({ 
        size : 0.009,
        map : normalTexture,
    });

    // Mesh
    const box = new THREE.Points(geometry, material);
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(box, particlesMesh);

    // Lights
    ambient = new THREE.AmbientLight(0x8332AC, 0.5);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xffffff,2)
    pointLight.position.set(2,3,4);
    scene.add(pointLight);

    // Stats
    stats = new Stats();
    document.body.appendChild(stats.dom);

    

    // MouseMove
    document.addEventListener('mousemove', animateParticles);
    let mouseX = 0;
    let mouseY = 0;

    function animateParticles(event){
        mouseY = event.clientY;
        mouseX = event.clientX;
    };
    
    //Animate
    const clock = new THREE.Clock()

    const tick = () =>{
        const elapsedTime = clock.getElapsedTime();
        // Update objects
        box.rotation.y = 0.5 * elapsedTime;
        particlesMesh.rotation.y = -0.1 * elapsedTime;

        //Animate particles (They move without the mouseMove)
        if(mouseX > 0){ 
            particlesMesh.rotation.x = - mouseY * (elapsedTime * 0.00008);
            particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008); 
        };
        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };
    tick();

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize);
    onResize();
}
init();

// MY APP
function render() {
    // Rendu final
    renderer.render(scene, camera);
    stats.update();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);