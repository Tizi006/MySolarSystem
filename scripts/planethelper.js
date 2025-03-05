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

const scalePlanet = 1 / 5000
const scaleDistance = 1 / 1000000
const AU = 149597870.700
const planetPosition = [0, 0.466697, 0.728213, 1, 1.3, 1.666206, 5.4570, 10.1238, 20.0965, 30.33];
export const triggerPoints = [
    planetPosition[1] - 0.1,
    planetPosition[2] - 0.1,
    planetPosition[3] - 0.1,
    planetPosition[4] - 0.01,
    planetPosition[5] - 0.13,
    planetPosition[6] - 2,
    planetPosition[7] - 2,
    planetPosition[8] - 2.5,
    planetPosition[9] - 6.6].map(value => value * scaleDistance * AU);

class Planet {
    constructor(radius, textureUrl, position, axialTiltDegrees = 0) {
        //planet
        radius *= scalePlanet;
        const segments = Math.max(32, radius * 3)
        const sphereGeometry = new Three.SphereGeometry(radius, segments, segments);
        position.multiplyScalar(scaleDistance * AU)
        const texture = new Three.TextureLoader().load(textureUrl);
        this.mesh = new Three.Mesh(
            sphereGeometry,
            new Three.MeshBasicMaterial({
                map: texture,
            }));
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.rotation.x = axialTiltDegrees * (Math.PI / 180)
        this.accumulatedAngle = 0;
        //axel
        const axelWidth = sphereGeometry.parameters.radius * 0.02
        this.rotationAxel = new Three.Mesh(
            new Three.CylinderGeometry(axelWidth, axelWidth, sphereGeometry.parameters.radius * 4, 5),
            new Three.MeshBasicMaterial({color: 0x00ff44})
        )
        this.rotationAxel.position.set(position.x, position.y, position.z)
        this.rotationAxel.rotation.x = axialTiltDegrees * (Math.PI / 180)
        this.rotationAxel.visible = false;
    }

    addToScene(scene) {
        scene.add(this.mesh);
        scene.add(this.rotationAxel);
    }

    addAtmosphere(distance, textureUrl, speedPercent, scene) {
        distance *= scalePlanet
        this.atmosphereSpeedPercent = speedPercent
        const texture = new Three.TextureLoader().load(textureUrl);
        this.atmosphere = new Three.Mesh(
            new Three.SphereGeometry(this.mesh.geometry.parameters.radius + distance, this.mesh.geometry.parameters.widthSegments, this.mesh.geometry.parameters.heightSegments),
            new Three.MeshBasicMaterial({
                map: texture,
                transparent: true
            }));
        this.atmosphere.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)
        this.atmosphere.rotation.x = this.mesh.rotation.x
        scene.add(this.atmosphere)
    }

    rotate(rotationPeriod, minuteTimeStep) {
        //euler angle in degrees: 360/minutes
        const degreesPerMinute = 360 / rotationPeriod
        const radiansPerStep = (degreesPerMinute) * (Math.PI / 180) * minuteTimeStep;
        this.mesh.rotation.y += radiansPerStep
        this.mesh.rotation.y = this.mesh.rotation.y % (2 * Math.PI)
        if (this.atmosphere) {
            this.atmosphere.rotation.y += radiansPerStep + radiansPerStep * (this.atmosphereSpeedPercent / 100)
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
        if (this.atmosphere) {
            this.atmosphere.position.lerp(newPos, 0.5)
        }
    }
}


class Orbit {
    constructor(centerObject, orbitingObject, aphelion, perihelion, rotationArgumentPerihelion, rotationLongitudeAscendingNode, inclination, eccentricity, perihelionTime, orbitalPeriod) {
        aphelion *= scaleDistance * AU
        perihelion *= scaleDistance * AU
        const semi_major = (aphelion + perihelion) / 2;  // Semi-major axis
        const semi_minor = semi_major * Math.sqrt(1 - eccentricity ** 2); // Semi-minor axis
        const rotationRad = rotationArgumentPerihelion * (Math.PI / 180);
        const inclinationRad = (inclination - 90) * (Math.PI / 180); //to invariable plane
        const ascendingNodeRad = rotationLongitudeAscendingNode * (Math.PI / 180); // Ω (Longitude of Ascending Node)

        const focal_distance = semi_major * eccentricity; // Distance from center of the ellipse to the mass object
        const massCenter = new Three.Vector3().copy(centerObject.mesh.position);
        massCenter.x += focal_distance
        massCenter.applyAxisAngle(new Three.Vector3(0, 0, 1), rotationRad);

        this.curve = new Three.EllipseCurve(
            massCenter.x, massCenter.y,
            semi_major, semi_minor,
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            rotationRad
        );

        const points = this.curve.getPoints(100);
        const geometry = new Three.BufferGeometry().setFromPoints(points);
        const material = new Three.LineBasicMaterial({color: 0xff0000});
        this.ellipse = new Three.Line(geometry, material);
        this.ellipse.rotation.x = inclinationRad
        //TODO: ascendingNodeRad

        const perihelionPos = this.curve.getPointAt(0.5, new Three.Vector3()) // Perihelion is at t = 0
        perihelionPos.applyAxisAngle(new Three.Vector3(1, 0, 0), inclinationRad); //rotate z-axes to respect inclination
        orbitingObject.mesh.position.set(perihelionPos.x, perihelionPos.y, perihelionPos.z);
    }

    updateTimePosition(newTime) {

    }

    addToScene(scene) {
        scene.add(this.ellipse)
    }
}

class Donut {
    constructor(innerRadius, outerRadius, textureUrl, centerPosition, axialTiltDegrees = 0) {
        centerPosition.multiplyScalar(scaleDistance * AU)
        innerRadius *= scalePlanet;
        outerRadius *= scalePlanet;
        const segments = Math.max(100, outerRadius * 3)
        const ringGeometry = new Three.RingGeometry(innerRadius, outerRadius, segments);
        const texture = new Three.TextureLoader().load(textureUrl);
        this.mesh = new Three.Mesh(
            ringGeometry,
            new Three.MeshBasicMaterial({
                map: texture,
                side: Three.DoubleSide,
                transparent: true
            }));
        this.mesh.position.set(centerPosition.x, centerPosition.y, centerPosition.z)
        this.mesh.rotation.x = (axialTiltDegrees - 90) * (Math.PI / 180)
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
    69570,
    sunTextureUrl,
    new Three.Vector3(0, 0, planetPosition[0]),
    7.25
)

// Mercury
export const mercury = new Planet(
    2439.7,
    mercuryTextureUrl,
    new Three.Vector3(0, 0, planetPosition[1]),
    0.03
);

// Venus
export const venus = new Planet(
    6051.8,
    venusTextureUrl,
    new Three.Vector3(0, 0, planetPosition[2]),
    -2.64
);

export function addVenusAtmosphere(scene) {
    venus.addAtmosphere(70, venusAtmosphereTextureUrl, 25, scene)
}

// Earth
export const earth = new Planet(
    6371.0,
    earthTextureUrl,
    new Three.Vector3(0, 0, planetPosition[3]),
    23.44
);
export const test = new Orbit(sun, earth, 1.01670963823, 0.983292404576, 114.20783, -11.26064, 1.57869, 0.0167086)

export function addEarthAtmosphere(scene) {
    earth.addAtmosphere(25, earthCloudsTextureUrl, 25, scene)
}

// Moon
export const moon = new Planet(
    1737.4,
    moonTextureUrl,
    new Three.Vector3(0, 0, planetPosition[4]),
    6.68
);
//initially rotate moon to approximately face the correct side to the earth
moon.mesh.rotation.y = Math.PI
// Mars
export const mars = new Planet(
    3389.5,
    marsTextureUrl,
    new Three.Vector3(0, 0, planetPosition[5]),
    25.19
);

// Jupiter
export const jupiter = new Planet(
    69911,
    jupiterTextureUrl,
    new Three.Vector3(0, 0, planetPosition[6]),
    3.13
);

// Saturn
export const saturn = new Planet(
    58232,
    saturnTextureUrl,
    new Three.Vector3(0, 0, planetPosition[7]),
    26.73
);

//saturnRing
export const saturnRing = new Donut(
    70000, 140180,
    saturnRingsTextureUrl,
    new Three.Vector3(0, 0, planetPosition[7]),
    26.73
)

// Uranus
export const uranus = new Planet(
    25362,
    uranusTextureUrl,
    new Three.Vector3(0, 0, planetPosition[8]),
    -82.23
);

// Neptune
export const neptune = new Planet(
    24622,
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