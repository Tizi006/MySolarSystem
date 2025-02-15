import * as Three from 'three';
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


const planetPosition = [0, 57.9, 108.2, 149.6, 160, 227.6, 778.6, 1433.5, 2872.5, 4495.1];
export const triggerPoints = [planetPosition[1] - 15, planetPosition[2] - 15, planetPosition[3] - 15, planetPosition[4] - 2, planetPosition[5] - 20, planetPosition[6] - 300, planetPosition[7] - 300, planetPosition[8] - 700, planetPosition[9] - 1000];

class Planet {
    constructor(sphereGeometry, textureUrl, position) {
        const texture = new Three.TextureLoader().load(textureUrl);
        this.mesh = new Three.Mesh(
            sphereGeometry,
            new Three.MeshBasicMaterial({
                map: texture
            }));
        this.mesh.position.set(position.x, position.y, position.z)
    }

    rotate(radians) {
        this.mesh.rotation.y += radians
    }

    orbitObject({mesh: {position: centerPosition}}, distance, angleSpeed) {
        const angle = angleSpeed * Date.now() * 0.01; // calculate angle based on time and angle speed
        const x = centerPosition.x + distance * Math.cos(angle); // calculate new x position based on distance and angle
        const z = centerPosition.z + distance * Math.sin(angle); // calculate new z position based on distance and angle
        this.mesh.position.set(x, this.mesh.position.y, z); // set the new position of the orbiting object
    }
}

//sun
export const sun = new Planet(
    new Three.SphereGeometry(27.8, 100, 100),
    sunTextureUrl,
    new Three.Vector3(0, 0, planetPosition[0])
)

// Mercury
export const mercury = new Planet(
    new Three.SphereGeometry(0.4879, 32, 32),
    mercuryTextureUrl,
    new Three.Vector3(0, 0, planetPosition[1])
);

// Venus
export const venus = new Planet(
    new Three.SphereGeometry(1.2104, 50, 50),
    venusTextureUrl,
    new Three.Vector3(0, 0, planetPosition[2])
);

// Earth
export const earth = new Planet(
    new Three.SphereGeometry(1.2756, 100, 100),
    earthTextureUrl,
    new Three.Vector3(0, 0, planetPosition[3])
);

// Moon
export const moon = new Planet(
    new Three.SphereGeometry(0.1737, 32, 32),
    moonTextureUrl,
    new Three.Vector3(0, 0, planetPosition[4])
);

// Mars
export const mars = new Planet(
    new Three.SphereGeometry(0.6792, 50, 50),
    marsTextureUrl,
    new Three.Vector3(0, 0, planetPosition[5])
);

// Jupiter
export const jupiter = new Planet(
    new Three.SphereGeometry(14.2984, 50, 50),
    jupiterTextureUrl,
    new Three.Vector3(0, 0, planetPosition[6])
);

// Saturn
export const saturn = new Planet(
    new Three.SphereGeometry(12.0536, 50, 50),
    saturnTextureUrl,
    new Three.Vector3(0, 0, planetPosition[7])
);

//saturnRing
const saturnRingTexture = new Three.TextureLoader().load(saturnRingsTextureUrl)
export const saturnRing = new Three.Mesh(
    new Three.RingGeometry(17, 28, 2000),
    new Three.MeshBasicMaterial({
        map: saturnRingTexture,
        side: Three.DoubleSide
    }));
saturnRing.position.set(0, 0, planetPosition[7]);
saturnRing.rotation.set(27, 0, 0);

// Uranus
export const uranus = new Planet(
    new Three.SphereGeometry(5.1118, 50, 50),
    uranusTextureUrl,
    new Three.Vector3(0, 0, planetPosition[8])
);

// Neptune
export const neptune = new Planet(
    new Three.SphereGeometry(4.9528, 50, 50),
    neptuneTextureUrl,
    new Three.Vector3(0, 0, planetPosition[9])
);

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


export function stepRotation() {
    //rotations: (1/(days*20))
    sun.rotate((1 / 270 / 2))
    mercury.rotate((1 / 588) / 2)
    venus.rotate((1 / 2430) / 2)
    earth.rotate((1 / 10) / 2)
    mars.rotate((1 / 10) / 2)
    jupiter.rotate((1 / 3.7) / 2)
    saturn.rotate((1 / 4) / 2)
    saturnRing.rotation.z -= 0.4;
    uranus.rotate(-(1 / 8) / 2)
    neptune.rotate((1 / 7.5) / 2)

    moon.orbitObject(earth, 3.5, 0.016);
    moon.rotate(-0.0016)
}

export function getFocusedPlanetID(camera, controls) {
    for (let i = 0; i < planets.length; i++) {
        // Check if the camera is within the correct trigger point range
        if (
            (i === 0 && camera.position.z < triggerPoints[i]) || // Special case for the Sun
            (i > 0 && camera.position.z <= triggerPoints[i] && camera.position.z > triggerPoints[i - 1])
        ) {
            if (controls.target !== planets[i].mesh.position) {
                return i;
            }
        }
    }
    return planets.length - 1;
}