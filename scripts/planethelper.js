import * as THREE from 'three';
//initialize images
import sunTextureUrl from '../images/8k_sun.jpg';
import mercuryTextureUrl from '../images/8k_mercury.jpg';
import venusTextureUrl from '../images/8k_venus_surface.jpg';
import earthTextureUrl from '../images/8k_earth_nightmap.jpg';
import moonTextureUrl from '../images/8k_moon.jpg';
import marsTextureUrl from '../images/8k_mars.jpg';
import jupiterTextureUrl from '../images/8k_jupiter.jpg';
import saturnTextureUrl from '../images/8k_saturn.jpg';
import saturnRingsTextureUrl from '../images/SaturnRings.png';
import uranusTextureUrl from '../images/2k_uranus.jpg';
import neptuneTextureUrl from '../images/2k_neptune.jpg';


const [planetPosition] = Array([0, 57.9, 108.2, 149.6, 160, 227.6, 778.6, 1433.5, 2872.5, 4495.1]);
export const [triggerPoints] = Array([planetPosition[1] - 15, planetPosition[2] - 15, planetPosition[3] - 15, planetPosition[4] - 2, planetPosition[5] - 20, planetPosition[6] - 300, planetPosition[7] - 300, planetPosition[8] - 700, planetPosition[9] - 1000]);

//sun
const sunTexture = new THREE.TextureLoader().load(sunTextureUrl);
export const sun = new THREE.Mesh(
    new THREE.SphereGeometry(27.8, 100, 100),
    //139.14 radius to scale
    new THREE.MeshBasicMaterial({
        map: sunTexture
    }));
sun.position.set(0, 0, planetPosition[0]);


//mercury
const mercuryTexture = new THREE.TextureLoader().load(mercuryTextureUrl);
export const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(0.4879, 32, 32),
    new THREE.MeshBasicMaterial({
        map: mercuryTexture
    }));
mercury.position.set(0, 0, planetPosition[1]);

//venus
const venusTexture = new THREE.TextureLoader().load(venusTextureUrl);
export const venus = new THREE.Mesh(
    new THREE.SphereGeometry(1.2104, 50, 50),
    new THREE.MeshBasicMaterial({
        map: venusTexture
    }));
venus.position.set(0, 0, planetPosition[2]);

//earth
const earthTexture = new THREE.TextureLoader().load(earthTextureUrl);
export const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.2756, 100, 100),
    new THREE.MeshBasicMaterial({
        map: earthTexture
    }));
earth.position.set(0, 0, planetPosition[3]);

//moon
const moonTexture = new THREE.TextureLoader().load(moonTextureUrl);
export const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1737, 32, 32),
    new THREE.MeshBasicMaterial({
        map: moonTexture
    }));
moon.position.set(0, 0, planetPosition[4]);

//mars
const marsTexture = new THREE.TextureLoader().load(marsTextureUrl);
export const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.6792, 50, 50),
    new THREE.MeshBasicMaterial({
        map: marsTexture
    }));
mars.position.set(0, 0, planetPosition[5]);

//jupiter
const jupiterTexture = new THREE.TextureLoader().load(jupiterTextureUrl);
export const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(14.2984, 50, 50),
    new THREE.MeshBasicMaterial({
        map: jupiterTexture
    }));
jupiter.position.set(0, 0, planetPosition[6]);

//saturn
const saturnTexture = new THREE.TextureLoader().load(saturnTextureUrl);
export const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(12.0536, 50, 50),
    new THREE.MeshBasicMaterial({
        map: saturnTexture
    }));
saturn.position.set(0, 0, planetPosition[7]);

//saturnRing
const saturnRingTexture = new THREE.TextureLoader().load(saturnRingsTextureUrl)
export const saturnRing = new THREE.Mesh(
    new THREE.RingGeometry(17, 28, 2000),
    new THREE.MeshBasicMaterial({
        map: saturnRingTexture,
        side: THREE.DoubleSide
    }));
saturnRing.position.set(0, 0, planetPosition[7]);
saturnRing.rotation.set(27, 0, 0);

//uranus
const uranusTexture = new THREE.TextureLoader().load(uranusTextureUrl);
export const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(5.1118, 50, 50),
    new THREE.MeshBasicMaterial({
        map: uranusTexture
    }));
uranus.position.set(0, 0, planetPosition[8]);

//Neptune
const neptuneTexture = new THREE.TextureLoader().load(neptuneTextureUrl);
export const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(4.9528, 50, 50),
    new THREE.MeshBasicMaterial({
        map: neptuneTexture
    }));
neptune.position.set(0, 0, planetPosition[9]);

export const planets = [
    sun,
    mercury,
    venus,
    earth,
    moon,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune
];


export function orbitObject(orbitingObject, centerObject, distance, angleSpeed) {
    const angle = angleSpeed * Date.now() * 0.01; // calculate angle based on time and angle speed
    const x = centerObject.position.x + distance * Math.cos(angle); // calculate new x position based on distance and angle
    const z = centerObject.position.z + distance * Math.sin(angle); // calculate new z position based on distance and angle
    orbitingObject.position.set(x, orbitingObject.position.y, z); // set the new position of the orbiting object
}

export function stepRotation() {
    //rotations: (1/(days*20))
    sun.rotation.y += (1 / 270 / 2)
    mercury.rotation.y += (1 / 588) / 2;
    venus.rotation.y += (1 / 2430) / 2;
    earth.rotation.y += (1 / 10) / 2;
    mars.rotation.y += (1 / 10) / 2;
    jupiter.rotation.y += (1 / 3.7) / 2;
    saturn.rotation.y += (1 / 4) / 2;
    saturnRing.rotation.z -= 0.4;
    uranus.rotation.y -= (1 / 8) / 2;
    neptune.rotation.y += (1 / 7.5) / 2;

    orbitObject(moon, earth, 3.5, 0.016);
    moon.rotation.y -= 0.0016
}

export function getFocusedPlanetID(camera, controls) {
    for (let i = 0; i < planets.length; i++) {
        // Check if the camera is within the correct trigger point range
        if (
            (i === 0 && camera.position.z < triggerPoints[i]) || // Special case for the Sun
            (i > 0 && camera.position.z <= triggerPoints[i] && camera.position.z > triggerPoints[i - 1])
        ) {
            if (controls.target !== planets[i].position) {
                return i;
            }
        }
    }
    return planets.length - 1;
}