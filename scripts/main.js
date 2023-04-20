import '../style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

/*setup os scene*/
const [planetposition] = Array([0, 57.9, 108.2, 149.6, 160, 227.6, 778.6, 1433.5, 2872.5, 4495.1]);
const [triggerpoints] = Array([planetposition[1] - 15, planetposition[2] - 15, planetposition[3] - 15, planetposition[4] - 2, planetposition[5] - 20, planetposition[6] - 300, planetposition[7] - 300, planetposition[8] - 700, planetposition[9] - 1000]);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
camera.position.set(40, 0, -100)
//orbitcontrol
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

//light
const light = new THREE.PointLight(0xffffff, 1);
const lightUniversal = new THREE.DirectionalLight(0xffffff, 0.1);
lightUniversal.target.position.set(-5, 0, 0);

//background
const backgroundTexture = new THREE.TextureLoader().load('images/8k_stars_milky_way.jpg');
scene.background = backgroundTexture;

//sun
const sunTexture = new THREE.TextureLoader().load('images/8k_sun.jpg');
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(30, 100, 100),
    //139.14 radius to scale
    new THREE.MeshBasicMaterial({
        map: sunTexture
    }));
sun.position.set(0, 0, planetposition[0]);


//mercury
const mercuryTexture = new THREE.TextureLoader().load('images/8k_mercury.jpg');
const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(0.4879, 32, 32),
    new THREE.MeshBasicMaterial({
        map: mercuryTexture
    }));
mercury.position.set(0, 0, planetposition[1]);

//venus
const venusTexture = new THREE.TextureLoader().load('images/8k_venus_surface.jpg');
const venus = new THREE.Mesh(
    new THREE.SphereGeometry(1.2104, 50, 50),
    new THREE.MeshBasicMaterial({
        map: venusTexture
    }));
venus.position.set(0, 0, planetposition[2]);

//earth
const earthTexture = new THREE.TextureLoader().load('images/8k_earth_nightmap.jpg');
const eath = new THREE.Mesh(
    new THREE.SphereGeometry(1.2756, 100, 100),
    new THREE.MeshBasicMaterial({
        map: earthTexture
    }));
eath.position.set(0, 0, planetposition[3]);

//moon
const moonTexture = new THREE.TextureLoader().load('images/8k_moon.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1737, 32, 32),
    new THREE.MeshBasicMaterial({
        map: moonTexture
    }));
moon.position.set(0, 0, planetposition[4]);

//mars
const marsTexture = new THREE.TextureLoader().load('images/8k_mars.jpg');
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.6792, 50, 50),
    new THREE.MeshBasicMaterial({
        map: marsTexture
    }));
mars.position.set(0, 0, planetposition[5]);

//jupiter
const jupiterTexture = new THREE.TextureLoader().load('images/8k_jupiter.jpg');
const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(14.2984, 50, 50),
    new THREE.MeshBasicMaterial({
        map: jupiterTexture
    }));
jupiter.position.set(0, 0, planetposition[6]);

//saturn
const saturnTexture = new THREE.TextureLoader().load('images/8k_saturn.jpg');
const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(12.0536, 50, 50),
    new THREE.MeshBasicMaterial({
        map: saturnTexture
    }));
saturn.position.set(0, 0, planetposition[7]);

//saturnring
const saturnRingTexture = new THREE.TextureLoader().load('images/SaturnRings.png')
const saturnRing = new THREE.Mesh(
    new THREE.RingGeometry(17, 28, 2000),
    new THREE.MeshBasicMaterial({
        map: saturnRingTexture,
        side: THREE.DoubleSide
    }));
saturnRing.position.set(0, 0, planetposition[7]);
saturnRing.rotation.x = 27;
saturnRing.rotation.set(27, 0, 0);

//uranus
const uranusTexture = new THREE.TextureLoader().load('images/2k_uranus.jpg');
const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(5.1118, 50, 50),
    new THREE.MeshBasicMaterial({
        map: uranusTexture
    }));
uranus.position.set(0, 0, planetposition[8]);

//Neptun
const neptuneTexture = new THREE.TextureLoader().load('images/2k_neptune.jpg');
const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(4.9528, 50, 50),
    new THREE.MeshBasicMaterial({
        map: neptuneTexture
    }));
neptune.position.set(0, 0, planetposition[9]);

scene.add(light);
scene.add(lightUniversal);
scene.add(lightUniversal.target)
//add planets
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(eath);
scene.add(moon);
scene.add(mars);
scene.add(jupiter);
scene.add(saturn);
scene.add(saturnRing);
scene.add(uranus);
scene.add(neptune);
renderer.render(scene, camera);

//Array(400).fill().forEach(addStar);

function addStar() {
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(250));
    const [color] = Array([0xE2FF05, 0xFADD00, 0xFFBD08, 0xFF9705, 0xFF6105, 0x90FFF9])
    const randomColor = color[Math.floor(Math.random() * color.length)];

    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshBasicMaterial({color: randomColor})
    const star = new THREE.Mesh(geometry, material);
    star.position.set(x, y, z);
    scene.add(star);
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

function orbitObject(orbitingObject, centerObject, distance, angleSpeed) {
    const angle = angleSpeed * Date.now() * 0.01; // calculate angle based on time and angle speed
    const x = centerObject.position.x + distance * Math.cos(angle); // calculate new x position based on distance and angle
    const z = centerObject.position.z + distance * Math.sin(angle); // calculate new z position based on distance and angle
    orbitingObject.position.set(x, orbitingObject.position.y, z); // set the new position of the orbiting object
}

function getfocusedPlanet(t) {
    //sun
    if (t < triggerpoints[0] && controls.target !== sun.position) {
        return sun.position;
    } else if ((camera.position.z <= triggerpoints[1] && camera.position.z > triggerpoints[0]) && controls.target !== mercury.position) {
        return mercury.position;
    } else if ((camera.position.z <= triggerpoints[2] && camera.position.z > triggerpoints[1]) && controls.target !== venus.position) {
        return venus.position;
    } else if ((camera.position.z <= triggerpoints[3] && camera.position.z > triggerpoints[2]) && controls.target !== eath.position) {
        return eath.position;
    } else if ((camera.position.z <= triggerpoints[4] && camera.position.z > triggerpoints[3]) && controls.target !== moon.position) {
        return moon.position;
    } else if ((camera.position.z <= triggerpoints[5] && camera.position.z > triggerpoints[4]) && controls.target !== mars.position) {
        return mars.position;
    } else if ((camera.position.z <= triggerpoints[6] && camera.position.z > triggerpoints[5]) && controls.target !== jupiter.position) {
        return jupiter.position;
    } else if ((camera.position.z <= triggerpoints[7] && camera.position.z > triggerpoints[6]) && controls.target !== saturn.position) {
        return saturn.position;
    } else if ((camera.position.z <= triggerpoints[8] && camera.position.z > triggerpoints[7]) && controls.target !== uranus.position) {
        return uranus.position;
    } else if ((camera.position.z > triggerpoints[8]) && controls.target !== neptune.position) {
        return neptune.position;
    }

}

function animate() {
    requestAnimationFrame(animate);
    const t = (document.body.getBoundingClientRect().top) / 10 * -1;
    const currentPlanetPosition = getfocusedPlanet(t);

    if (!((currentPlanetPosition - controls.target) > 0.1)) {
        controls.target.lerp(currentPlanetPosition, 0.05);
    }

    //rotations: (1/(days*10))/2
    sun.rotation.y += (1 / 270 / 2)
    mercury.rotation.y += (1 / 588) / 2;
    venus.rotation.y += (1 / 2430) / 2;
    eath.rotation.y += (1 / 10) / 2;
    mars.rotation.y += (1 / 10) / 2;
    jupiter.rotation.y += (1 / 3.7) / 2;
    saturn.rotation.y += (1 / 4) / 2;
    saturnRing.rotation.z -= 0.4;
    uranus.rotation.y -= (1 / 8) / 2;
    neptune.rotation.y += (1 / 7.5) / 2;

    orbitObject(moon, eath, 3.5, 0.016);
    moon.rotation.y -=0.0016

    /*set camera fov*/
    if (camera.position.z < triggerpoints[4]&&camera.position.z > triggerpoints[3]) {
        camera.fov = incrementValue(camera.fov, 5);
    }
    else {
        camera.fov=incrementValue(camera.fov, 60)
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


    if (camera.position.z < triggerpoints[0]) {
        if (!((camera.position.x - 40 < 0.1) && (camera.position.x - 40 > -0.1))) {
            const targetPosition = new THREE.Vector3(40, camera.position.y, camera.position.z);
            camera.position.lerp(targetPosition, 0.1);
        }
    } else if (camera.position.z < triggerpoints[1]) {
        if (!((camera.position.x - 1.5 < 0.1) && (camera.position.x - 1.5 > -0.1))) {
            const targetPosition = new THREE.Vector3(1.5, camera.position.y, camera.position.z);
            camera.position.lerp(targetPosition, 0.1);
        }
    } else if (camera.position.z < triggerpoints[2]) {
        //  if(!((camera.position.x-10<0.1)&&(camera.position.x+10>-0.1))){
        const targetPosition = new THREE.Vector3(-2.7, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
        //  }
    } else if (camera.position.z < triggerpoints[3]) {
        // if(!((camera.position.x-1.5<0.1)&&(camera.position.x-1.5>-0.1))){
        const targetPosition = new THREE.Vector3(3.3, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
    }  else if (camera.position.z < triggerpoints[5]) {
        // if(!((camera.position.x-1.5<0.1)&&(camera.position.x-1.5>-0.1))){
        const targetPosition = new THREE.Vector3(1.5, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
        //   }
    } else if (camera.position.z < triggerpoints[6]) {
        // if(!((camera.position.x-1.5<0.1)&&(camera.position.x-1.5>-0.1))){
        const targetPosition = new THREE.Vector3(-30, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
        //   }
    } else if (camera.position.z < triggerpoints[7]) {
        // if(!((camera.position.x-1.5<0.1)&&(camera.position.x-1.5>-0.1))){
        const targetPosition = new THREE.Vector3(30, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
        //   }
    } else if (camera.position.z < triggerpoints[8]) {
        // if(!((camera.position.x-1.5<0.1)&&(camera.position.x-1.5>-0.1))){
        const targetPosition = new THREE.Vector3(16, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
        //   }
    } else if (camera.position.z < triggerpoints[9]) {
        // if(!((camera.position.x-1.5<0.1)&&(camera.position.x-1.5>-0.1))){
        const targetPosition = new THREE.Vector3(15, camera.position.y, camera.position.z);
        camera.position.lerp(targetPosition, 0.1);
        //   }
    }
}

document.body.onscroll = moveCamera;
animate();

