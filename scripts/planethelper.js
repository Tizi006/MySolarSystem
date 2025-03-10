import * as Three from 'three';
//initialize images
import sunTextureUrl from '../images/textures/2kCompressed/2k_sun.webp';
import mercuryTextureUrl from '../images/textures/2kCompressed/2k_mercury.webp';
import venusTextureUrl from '../images/textures/2kCompressed/2k_venus_surface.webp';
import venusAtmosphereTextureUrl from "../images/textures/2kCompressed/2k_venus_atmosphere_alpha.webp";
import earthTextureUrl from '../images/textures/2kCompressed/2k_earth_daymap.webp';
import earthCloudsTextureUrl from "../images/textures/2kCompressed/2k_earth_clouds_alpha.webp";
import moonTextureUrl from '../images/textures/2kCompressed/2k_moon.webp';
import marsTextureUrl from '../images/textures/2kCompressed/2k_mars.webp';
import jupiterTextureUrl from '../images/textures/2kCompressed/2k_jupiter.webp';
import saturnTextureUrl from '../images/textures/2kCompressed/2k_saturn.webp';
import saturnRingsTextureUrl from '../images/textures/2kCompressed/SaturnRings.webp';
import uranusTextureUrl from '../images/textures/2kCompressed/2k_uranus.webp';
import neptuneTextureUrl from '../images/textures/2kCompressed/2k_neptune.webp';


const planetPosition = [0, 57.9, 108.2, 149.6, 160, 227.6, 778.6, 1433.5, 2872.5, 4495.1];
export const triggerPoints = [planetPosition[1] - 15, planetPosition[2] - 15, planetPosition[3] - 15, planetPosition[4] - 2, planetPosition[5] - 20, planetPosition[6] - 300, planetPosition[7] - 300, planetPosition[8] - 700, planetPosition[9] - 1000];

class Planet {
    constructor(sphereGeometry, textureUrl, position, axialTiltDegrees=0) {
        //planet
        const texture = new Three.TextureLoader().load(textureUrl);
        this.mesh = new Three.Mesh(
            sphereGeometry,
            new Three.MeshBasicMaterial({
                map: texture,
            }));
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.rotation.x = axialTiltDegrees* (Math.PI / 180)
        this.accumulatedAngle = 0;
        //axel
        const axelWidth =sphereGeometry.parameters.radius *0.02
        this.rotationAxel = new Three.Mesh(
            new Three.CylinderGeometry(axelWidth, axelWidth, sphereGeometry.parameters.radius * 4, 5),
            new Three.MeshBasicMaterial({color: 0x00ff44})
        )
        this.rotationAxel.position.set(position.x, position.y, position.z)
        this.rotationAxel.rotation.x = axialTiltDegrees* (Math.PI / 180)
        this.rotationAxel.visible =false;
    }

    addToScene(scene){
        scene.add(this.mesh);
        scene.add(this.rotationAxel);
    }
    addAtmosphere(distance,textureUrl,speedPercent,scene){
        this.atmosphereSpeedPercent =speedPercent
        const texture = new Three.TextureLoader().load(textureUrl);
        this.atmosphere = new Three.Mesh(
            new Three.SphereGeometry(this.mesh.geometry.parameters.radius+distance, this.mesh.geometry.parameters.widthSegments, this.mesh.geometry.parameters.heightSegments),
            new Three.MeshBasicMaterial({
                map: texture,
                transparent: true
            }));
        this.atmosphere.position.set(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z)
        this.atmosphere.rotation.x = this.mesh.rotation.x
        scene.add(this.atmosphere)
    }
    rotate(rotationPeriod, minuteTimeStep) {
        //euler angle in degrees: 360/minutes
        const degreesPerMinute = 360 / rotationPeriod
        const radiansPerStep = (degreesPerMinute) * (Math.PI / 180) * minuteTimeStep;
        this.mesh.rotation.y += radiansPerStep
        this.mesh.rotation.y = this.mesh.rotation.y % (2 * Math.PI)
        if(this.atmosphere){
            this.atmosphere.rotation.y += radiansPerStep+radiansPerStep*(this.atmosphereSpeedPercent/100)
            this.atmosphere.rotation.y = this.atmosphere.rotation.y % (2 * Math.PI)
        }
    }

    //simplified round orbit with 0 y
    orbitObject({mesh: {position: centerPosition}}, distance, rotationPeriod, minuteTimeStep) {
        const degreesPerMinute = 360 / rotationPeriod
        const radiansPerStep = degreesPerMinute * (Math.PI / 180) * minuteTimeStep;
        this.accumulatedAngle += radiansPerStep
        this.accumulatedAngle = this.accumulatedAngle % (2 * Math.PI)

        const x = centerPosition.x + distance * Math.cos(this.accumulatedAngle);
        const z = centerPosition.z + distance * Math.sin(this.accumulatedAngle);
        const newPos = new Three.Vector3(x, this.mesh.position.y, z)
        this.mesh.position.lerp(newPos, 0.5); // set the new position of the orbiting object
        this.rotationAxel.position.lerp(newPos, 0.5)
        if(this.atmosphere){this.atmosphere.position.lerp(newPos, 0.5)}
    }
}

class Donut {
    constructor(ringGeometry, textureUrl, centerPosition,axialTiltDegrees=0) {
        const texture = new Three.TextureLoader().load(textureUrl);
        this.mesh = new Three.Mesh(
            ringGeometry,
            new Three.MeshBasicMaterial({
                map: texture,
                side: Three.DoubleSide,
                transparent: true
            }));
        this.mesh.position.set(centerPosition.x, centerPosition.y, centerPosition.z)
        this.mesh.rotation.x =(axialTiltDegrees-90)* (Math.PI / 180)
    }

    rotate(rotationPeriod, minuteTimeStep) {
        //euler angle in degrees: 360/minutes
        const degreesPerMinute = 360 / rotationPeriod
        const radiansPerStep = degreesPerMinute * (Math.PI / 180) * minuteTimeStep;
        this.mesh.rotation.z += radiansPerStep
        this.mesh.rotation.z = this.mesh.rotation.z % (2 * Math.PI)
    }
}


//sun
export const sun = new Planet(
    new Three.SphereGeometry(27.8, 100, 100),
    sunTextureUrl,
    new Three.Vector3(0, 0, planetPosition[0]),
    7.25
)

// Mercury
export const mercury = new Planet(
    new Three.SphereGeometry(0.4879, 32, 32),
    mercuryTextureUrl,
    new Three.Vector3(0, 0, planetPosition[1]),
    0.03
);

// Venus
export const venus = new Planet(
    new Three.SphereGeometry(1.2104, 50, 50),
    venusTextureUrl,
    new Three.Vector3(0, 0, planetPosition[2]),
    -2.64
);
export function addVenusAtmosphere(scene){venus.addAtmosphere(0.005,venusAtmosphereTextureUrl,25,scene)}

// Earth
export const earth = new Planet(
    new Three.SphereGeometry(1.2756, 100, 100),
    earthTextureUrl,
    new Three.Vector3(0, 0, planetPosition[3]),
    23.44
);
export function addEarthAtmosphere(scene){earth.addAtmosphere(0.005,earthCloudsTextureUrl,25,scene)}

// Moon
export const moon = new Planet(
    new Three.SphereGeometry(0.1737, 32, 32),
    moonTextureUrl,
    new Three.Vector3(0, 0, planetPosition[4]),
    6.68
);
//initially rotate moon to approximately face the correct side to the earth
moon.mesh.rotation.y =Math.PI
// Mars
export const mars = new Planet(
    new Three.SphereGeometry(0.6792, 50, 50),
    marsTextureUrl,
    new Three.Vector3(0, 0, planetPosition[5]),
    25.19
);

// Jupiter
export const jupiter = new Planet(
    new Three.SphereGeometry(14.2984, 50, 50),
    jupiterTextureUrl,
    new Three.Vector3(0, 0, planetPosition[6]),
    3.13
);

// Saturn
export const saturn = new Planet(
    new Three.SphereGeometry(12.0536, 50, 50),
    saturnTextureUrl,
    new Three.Vector3(0, 0, planetPosition[7]),
    26.73
);

//saturnRing
export const saturnRing = new Donut(
    new Three.RingGeometry(17, 28, 2000),
    saturnRingsTextureUrl,
    new Three.Vector3(0, 0, planetPosition[7]),
    26.73
)

// Uranus
export const uranus = new Planet(
    new Three.SphereGeometry(5.1118, 50, 50),
    uranusTextureUrl,
    new Three.Vector3(0, 0, planetPosition[8]),
    -82.23
);

// Neptune
export const neptune = new Planet(
    new Three.SphereGeometry(4.9528, 50, 50),
    neptuneTextureUrl,
    new Three.Vector3(0, 0, planetPosition[9]),
    28.32
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


export function stepRotation(minuteTimeStep) {
    /*rotation values are calculated by:
    Sun: 25d 9h 7m
    Mercury: 58d 16h
    Venus: 243d 26m
    Earth: 23h 56m
    Moon: locked:  27d 7h 41m
    Mars: 24h 36m
    Jupiter: 9h 55m
    Saturn: 10h 33m
    Saturn main rings: 5h-14h =>using 12h
    Uranus: 17h 14m
    Neptune: 16h
    Calculated value in minutes:
    */
    sun.rotate(36567, minuteTimeStep)
    mercury.rotate(84960, minuteTimeStep)
    venus.rotate(-350906, minuteTimeStep)
    earth.rotate(1436, minuteTimeStep)
    mars.rotate(1476, minuteTimeStep)
    jupiter.rotate(595, minuteTimeStep)
    saturn.rotate(633, minuteTimeStep)
    saturnRing.rotate(720, minuteTimeStep)
    uranus.rotate(1034, minuteTimeStep)
    neptune.rotate(960, minuteTimeStep)

    moon.orbitObject(earth, 3.5, 39341, minuteTimeStep);
    moon.rotate(-39341, minuteTimeStep)
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