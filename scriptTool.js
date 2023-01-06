//Imports
import * as THREE from './three.js-master/build/three.module.js';

let scene, camera, renderer, ambient, dirLight, stats;

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
  
  // SCENE
  const scene = new THREE.Scene();

  // CAMERA
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(-35, 70, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // RENDERER
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha:true,
  });
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onResize);
  onResize();

  // Lights
    // Ambient light
    ambient = new THREE.AmbientLight(0xffffff, 0.20);
    scene.add(ambient);

    // Directional light
    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-30, 50, -30);
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.bottom = -70;
    dirLight.castShadow = true;
    scene.add(dirLight);


  // Objects 
    // Floor
    const blockPlane = new THREE.Mesh(
      new THREE.BoxBufferGeometry(),
      new THREE.MeshPhongMaterial({ color: 0xD9DBF1 }));
    blockPlane.position.set(0, -1, 3);
    blockPlane.scale.set(50, 3, 50);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.userData.ground = true;
    scene.add(blockPlane);
    
    // Box
    let box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(), 
      new THREE.MeshStandardMaterial({ 
        color: 0x05A8AA }));
    box.position.set( 15, 6/ 2, 15 );
    box.scale.set(6, 6, 6);
    box.castShadow = true;
    box.receiveShadow = true;
    box.userData.draggable = true;
    scene.add(box);

    // TorusKnot
    let torusKnot = new THREE.Mesh(
      new THREE.TorusKnotBufferGeometry(2, 0.7, 50, 10),
      new THREE.MeshStandardMaterial({ 
        roughness:0.2,
        map : normalTexture,
        color: 0x05A8AA }));
    torusKnot.position.set(-15, 9 / 2, 15 );
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    torusKnot.userData.draggable = true;
    scene.add(torusKnot);

    //Sphere
    let sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(4, 32, 32), 
      new THREE.MeshStandardMaterial({
        roughness:0.2,
        map : normalTexture, }));
    sphere.position.set(15, 4, -15);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.draggable = true;
    scene.add(sphere);


  //Buttons colors
  const orange = document.getElementById("orange");
    orange.addEventListener("click", () => {
    box.material.color.setHex(0xFCA311);
  });
  const red = document.getElementById("red");
    red.addEventListener("click", () => {
    box.material.color.setHex(0xff0000);
	});
	const pink = document.getElementById("pink");
    pink.addEventListener("click", () => {
    box.material.color.setHex(0xff0077);
	});
	const blue = document.getElementById("blue");
    blue.addEventListener("click", () => {
    box.material.color.setHex(0xc266a);
	});
	const green = document.getElementById("green");
    green.addEventListener("click", () => {
    box.material.color.setHex(0x0CCE6B);
	});
  //Background changements 
  const setBg = () => {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = "#" + randomColor;
  }
  genNew.addEventListener("click", setBg);
  setBg();

  // Mouse interactions
  const raycaster = new THREE.Raycaster(); 
  const clickMouse = new THREE.Vector2();  
  const moveMouse = new THREE.Vector2();  
  let draggable = new THREE.Object3D;

  function intersect(pos= new THREE.Vector2) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
  }
    // Click
    window.addEventListener('click', event => {
      if (draggable != null) {
        draggable = null;
        return;
      }

      clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const found = intersect(clickMouse);
      if (found.length > 0) {
        if (found[0].object.userData.draggable) {
          draggable = found[0].object;
        }
      }
    })

    window.addEventListener('mousemove', event => {
      moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Drag'n'Drop
    function dragObject(){
      if (draggable != null){
        const found = intersect(moveMouse);
        if (found.length > 0){
          for (let i = 0; i < found.length; i++){
            if (!found[i].object.userData.ground)
              continue
            let target = found[i].point;
            draggable.position.x = target.x;
            draggable.position.z = target.z;
          }
        }
      }
    }
  
  // Animation
  function animate(){
    dragObject();
		sphere.rotation.x += 0.03;
		sphere.rotation.y += 0.01;
    torusKnot.rotation.x -= 0.03;
		torusKnot.rotation.y += 0.01;
		window.requestAnimationFrame(render)
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
init();

// MY APP
function render() {
  // CONTROLS
  /*const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.update();*/
	
	// Rendu final
	renderer.render(scene, camera);
	stats.update();
	requestAnimationFrame(render);
}
requestAnimationFrame(render);