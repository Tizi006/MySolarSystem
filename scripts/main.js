import '../styles/main.css'
import * as Three from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as ph from './planethelper.js'
//initialize images
import backgroundUrl from '../images/textures/2kCompressed/8k_stars_milky_way.webp'
import {setBoxVisibility, getCurrentTimeIncrement, updateDate} from "./user-events.js";

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
ph.planets.forEach(p => p.addToScene(scene))
ph.orbits.forEach(o => o.addToScene(scene))
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
    updateCamera()
    /*set camera fov*/
    if (distance < ph.triggerPoints[4] && distance > ph.triggerPoints[3]) {
        camera.fov = incrementValue(camera.fov, 5);
    } else {
        camera.fov = incrementValue(camera.fov, 60)
    }
    camera.updateProjectionMatrix();
    controls.update();
    renderer.render(scene, camera);
}

export const simulationTime = new Date(Date.now()); // In UTC
setInterval(() => {
    ph.stepRotation(getCurrentTimeIncrement() / 100);

    simulationTime.setTime(simulationTime.getTime() + getCurrentTimeIncrement() * 60 * 10);
    ph.stepTime(simulationTime.getTime())
    updateDate(simulationTime)
}, 1000 / 100);


let distance = 30
function updateCameraDistance() {
    const scrollY = window.scrollY;
    const scrollProgress = scrollY / 10;
    const translatedDistance =scrollProgress < 240 ? scrollProgress : ((scrollProgress - 240) * 5) + 240
    distance = translatedDistance+30
}

function updateCamera() {
    const currentPlanetID = ph.getFocusedPlanetID(distance, controls)
    const currentPlanetPosition = ph.planets[currentPlanetID].mesh.position;
    setBoxVisibility(currentPlanetID);

    //focus
    if (!((currentPlanetPosition - controls.target) > 0.1)) {
        controls.target.lerp(currentPlanetPosition, 0.05);
    }
    //position
    const angle = ph.planets[currentPlanetID].getCameraAngle()
    const xDistance = distance * Math.cos(angle);
    const zDistance = distance * Math.sin(angle);

    // Only adjust the position if it's not already close enough
    if (Math.abs(camera.position.x - xDistance) > 0.1 || Math.abs(camera.position.z - zDistance) > 0.1) {
        const targetPosition = new Three.Vector3(xDistance, camera.position.y, zDistance);
        camera.position.lerp(targetPosition, 0.1);
    }
}

window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    //update renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener('scroll', () => {
    updateCameraDistance()
});
animate();
