import '../styles/main.css'
import * as Three from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {boxTrigger} from './user-events.js'
import * as ph from './planethelper.js'
//initialize images
import backgroundUrl from '../images/8k_stars_milky_way.jpg'

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
controls.target.set(0, 0, 0);

//light
const light = new Three.PointLight(0xffffff, 1);
const lightUniversal = new Three.DirectionalLight(0xffffff, 0.1);
lightUniversal.target.position.set(-5, 0, 0);

//background
const backgroundTexture = new Three.TextureLoader().load(backgroundUrl);
scene.background = backgroundTexture;


scene.add(light);
scene.add(lightUniversal);
scene.add(lightUniversal.target)
scene.add(ph.sun.mesh);
scene.add(ph.mercury.mesh);
scene.add(ph.venus.mesh);
scene.add(ph.earth.mesh);
scene.add(ph.moon.mesh);
scene.add(ph.mars.mesh);
scene.add(ph.jupiter.mesh);
scene.add(ph.saturn.mesh);
scene.add(ph.saturnRing);
scene.add(ph.uranus.mesh);
scene.add(ph.neptune.mesh);
renderer.render(scene, camera);


function setBoxVisibility(planetID) {
    const Box = [
        'Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'
    ].map(id => document.getElementById(id));
    if (boxTrigger === true) {
        Box.forEach(planet => planet.style.visibility = 'hidden');
        Box[planetID].style.visibility = 'visible';
    }
}

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
    ph.stepRotation();
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


function moveCamera() {
    //set camera position
    const t = ((document.body.getBoundingClientRect().top) / 10 * -1);
    if (camera.position.z < 240) {
        camera.position.z = t;
    } else {
        camera.position.z = (((t - 240) * 5) + 240)
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

document.body.onscroll = moveCamera;
animate();
