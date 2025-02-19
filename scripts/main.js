import '../styles/main.css'
import * as Three from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as ph from './planethelper.js'
//initialize images
import backgroundUrl from '../images/textures/2kCompressed/8k_stars_milky_way.webp'
import {setBoxVisibility, getCurrentTimeIncrement} from "./user-events.js";

/*Initialize scene*/
const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50000);
const renderer = new Three.WebGLRenderer({
    canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
camera.position.set(40, 0, -100)

//orbit control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;
controls.target.set(0, 0, 0);

//light
const light = new Three.PointLight(0xffffff, 1);
const lightUniversal = new Three.DirectionalLight(0xffffff, 0.1);
lightUniversal.target.position.set(-5, 0, 0);

//background
//incorrect rotation fo the milky way plane (need 60°) but rotation not directly supported
const backgroundTexture = new Three.TextureLoader().load(backgroundUrl);
backgroundTexture.mapping = Three.EquirectangularRefractionMapping;
scene.background = backgroundTexture;

scene.add(light);
scene.add(lightUniversal);
scene.add(lightUniversal.target)
ph.sun.addToScene(scene)
ph.mercury.addToScene(scene)
ph.venus.addToScene(scene)
ph.addVenusAtmosphere(scene)
ph.earth.addToScene(scene)
ph.addEarthAtmosphere(scene)
ph.moon.addToScene(scene)
ph.mars.addToScene(scene)
ph.jupiter.addToScene(scene)
ph.saturn.addToScene(scene)
scene.add(ph.saturnRing.mesh);
ph.uranus.addToScene(scene)
ph.neptune.addToScene(scene)
renderer.render(scene, camera);


function incrementValue(value, target) {
    let step = 1.5;
    if (target < value) {
        step = -step;
    }
    if (Math.abs(value - target) <= step) {
        return target;
    } else {
        return value + step;
    }
}


function animate() {
    requestAnimationFrame(animate);
    const currentPlanetID = ph.getFocusedPlanetID(camera, controls)
    const currentPlanetPosition = ph.planets[currentPlanetID].mesh.position;
    setBoxVisibility(currentPlanetID);

    if (!((currentPlanetPosition - controls.target) > 0.1)) {
        controls.target.lerp(currentPlanetPosition, 0.05);
    }
    /*set camera fov*/
    if (camera.position.z < ph.triggerPoints[4] && camera.position.z > ph.triggerPoints[3]) {
        camera.fov = incrementValue(camera.fov, 5);
    } else {
        camera.fov = incrementValue(camera.fov, 60)
    }
    camera.updateProjectionMatrix();


    controls.update();
    renderer.render(scene, camera);
}

setInterval(() => {
    ph.stepRotation(getCurrentTimeIncrement() / 100);
}, 1000 / 100);

function moveCamera() {
    const scrollY = window.scrollY;
    const scrollProgress = scrollY / 10;
    //set camera position
    if (scrollProgress < 240) {
        camera.position.z = scrollProgress;
    } else {
        camera.position.z = ((scrollProgress - 240) * 5) + 240;
    }
    //position of the camera left/right of a planet
    const targetPositions = [
        {trigger: ph.triggerPoints[0], x: 40},
        {trigger: ph.triggerPoints[1], x: 1.5},
        {trigger: ph.triggerPoints[2], x: -2.7},
        {trigger: ph.triggerPoints[3], x: 3.3},
        {trigger: ph.triggerPoints[5], x: 1.8},
        {trigger: ph.triggerPoints[6], x: -30},
        {trigger: ph.triggerPoints[7], x: 30},
        {trigger: ph.triggerPoints[8], x: 16},
        {trigger: ph.triggerPoints[9], x: 15}
    ];

    // Loop through each target position
    for (let i = 0; i < targetPositions.length; i++) {
        const {trigger, x} = targetPositions[i];

        // First triggerPoint where the camera is before the certain point
        if (camera.position.z < trigger) {
            // Only adjust the x position if it's not already close enough
            if (Math.abs(camera.position.x - x) > 0.1) {
                const targetPosition = new Three.Vector3(x, camera.position.y, camera.position.z);
                camera.position.lerp(targetPosition, 0.1);
            }
            break; // Exit the loop once the camera reaches the target
        }
    }
}

window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    //update renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener('scroll', () => {moveCamera()});
animate();
