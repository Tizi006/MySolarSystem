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
const planetPosition = [0, 0.466697, 0.728213, 1, 1, 1.666206, 5.4570, 10.1238, 20.0965, 30.33];

let initialisationTime
export const triggerPoints = [
    planetPosition[1] - 0.2,
    planetPosition[2] - 0.2,
    planetPosition[3] - 0.1,
    planetPosition[4] + 0.1,
    planetPosition[5] - 0.2,
    planetPosition[6] - 2,
    planetPosition[7] - 2,
    planetPosition[8] - 2.5,
    planetPosition[9] - 6.6].map(value => value * scaleDistance * AU);

class Planet {
    constructor(radius, textureUrl, position, rotationPeriodMinutes, axialTiltDegrees = 0, initialRotationOffset = 0) {
        //planet
        radius *= scalePlanet;
        const segments = Math.max(50, radius * 3)
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
        //axel
        const axelWidth = sphereGeometry.parameters.radius * 0.02
        this.rotationAxel = new Three.Mesh(
            new Three.CylinderGeometry(axelWidth, axelWidth, sphereGeometry.parameters.radius * 4, 5),
            new Three.MeshBasicMaterial({color: 0x00ff44})
        )
        this.rotationAxel.position.set(position.x, position.y, position.z)
        this.rotationAxel.rotation.x = axialTiltDegrees * (Math.PI / 180)
        this.rotationAxel.visible = false;
        this.rotationPeriod = rotationPeriodMinutes
        this.initializeRotationFromTime(initialisationTime, initialRotationOffset)
    }

    addAtmosphere(distance, textureUrl, speedPercent) {
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
    }

    addDonut(innerRadius, outerRadius, textureUrl, centerPosition, rotationPeriodMinutes, axialTiltDegrees = 0) {
        this.donut = new Donut(innerRadius, outerRadius, textureUrl, centerPosition, rotationPeriodMinutes, axialTiltDegrees)
    }

    addToScene(scene) {
        scene.add(this.mesh);
        scene.add(this.rotationAxel);
        if (this.atmosphere) {
            scene.add(this.atmosphere);
        }
        if (this.donut) {
            scene.add(this.donut.mesh);
        }
    }

    initializeRotationFromTime(currentTime, extraRotation = 0) {
        //just need one date to calculate the current rotationState from
        const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
        const siderealDayMs = this.rotationPeriod * 60 * 1000;

        const elapsed = currentTime - j2000;
        const turns = (elapsed / siderealDayMs) % 1;
        this.mesh.rotation.y = (turns * 2 * Math.PI + extraRotation) % (2 * Math.PI)
    }

    rotate(minuteTimeStep) {
        //euler angle in degrees: 360/minutes
        const degreesPerMinute = 360 / this.rotationPeriod
        const radiansPerStep = (degreesPerMinute) * (Math.PI / 180) * minuteTimeStep;
        this.mesh.rotation.y += radiansPerStep
        this.mesh.rotation.y = this.mesh.rotation.y % (2 * Math.PI)
        if (this.atmosphere) {
            this.atmosphere.rotation.y += radiansPerStep + radiansPerStep * (this.atmosphereSpeedPercent / 100)
            this.atmosphere.rotation.y = this.atmosphere.rotation.y % (2 * Math.PI)
        }
        if (this.donut) {
            this.donut.rotate(minuteTimeStep)
        }
    }

    updatePositionInstant(newPos) {
        this.mesh.position.set(newPos.x, newPos.y, newPos.z);
        this.rotationAxel.position.set(newPos.x, newPos.y, newPos.z);
        if (this.atmosphere) {
            this.atmosphere.position.set(newPos.x, newPos.y, newPos.z);
        }
        if (this.donut) {
            this.donut.mesh.position.set(newPos.x, newPos.y, newPos.z);
        }
    }

    updatePositionGradual(newPos) {
        this.mesh.position.lerp(newPos, 0.5);
        this.rotationAxel.position.lerp(newPos, 0.5)
        if (this.atmosphere) {
            this.atmosphere.position.lerp(newPos, 0.5)
        }
        if (this.donut) {
            this.donut.mesh.position.lerp(newPos, 0.5)
        }
    }

    getCameraAngle() {
        //full 360 degree angle
        const cameraShift = Math.atan2(3 * this.mesh.geometry.parameters.radius, this.mesh.position.length());
        const x = this.mesh.position.x;
        const z = this.mesh.position.z;
        return Math.atan2(z, x) + cameraShift;
    }
}

class Orbit {
    constructor(centerObject, orbitingObject, aphelion, perihelion, rotationArgumentPerihelion, rotationLongitudeAscendingNode, inclination, eccentricity, perihelionTime, orbitalPeriod) {
        this.perihelionTime = perihelionTime //perihelionTime: Time in UT1~UTC, calculated from Orbital Elements:TP https://ssd.jpl.nasa.gov/horizons/app.html#/
        this.orbitalPeriod = orbitalPeriod  // float in days
        this.centerObject = centerObject
        this.orbitingObject = orbitingObject

        aphelion *= scaleDistance * AU
        perihelion *= scaleDistance * AU
        const semi_major = (aphelion + perihelion) / 2;  // Semi-major axis
        const semi_minor = semi_major * Math.sqrt(1 - eccentricity ** 2); // Semi-minor axis
        this.rotationRad = rotationArgumentPerihelion * (Math.PI / 180); //rotation in its own plane
        this.inclinationRad = inclination * (Math.PI / 180); //to invariable plane
        this.ascendingNodeRad = rotationLongitudeAscendingNode * (Math.PI / 180); // Ω (Longitude of Ascending Node)

        const focal_distance = semi_major * eccentricity; // Distance from center of the ellipse to the mass object
        this.focalOffSet = new Three.Vector3(focal_distance, 0, 0)

        this.curve = new Three.EllipseCurve(
            0, 0,
            semi_major, semi_minor,
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0
        );
        const material = new Three.LineBasicMaterial({color: 0xff0000});
        this.ellipse = new Three.Line(this.calculateEllipseGeometry(), material);
        this.updateTimePosition(initialisationTime)
    }

    calculateEllipseGeometry() {
        const points2D = this.curve.getPoints(100);
        const points3D = points2D.map(p => {
            let pos = new Three.Vector3(p.x, p.y, p.z); // Ensure Z is initialized correctly
            // Move to mass center
            this.applyOrbitalTransform(pos)
            return pos;
        });
        return new Three.BufferGeometry().setFromPoints(points3D);
    }

    updateTimePosition(newTime) {
        const timeDifferenceDays = (newTime - this.perihelionTime.getTime()) / 86_400_000 //Period in days
        const timeDifferenceOrbits = timeDifferenceDays / this.orbitalPeriod + 0.5 // Perihelion is at 0.5
        const timedPosition = (1 - (timeDifferenceOrbits % 1 + 1) % 1) //always positive, needs to be flipped for the correct direction
        const newTimedPos = this.curve.getPointAt(timedPosition, new Three.Vector3())
        this.applyOrbitalTransform(newTimedPos);
        this.orbitingObject.updatePositionGradual(newTimedPos)
        //little hacky, but only updated ellipse for non sun orbiting objects
        if (this.centerObject.mesh.position.x !== 0) {
            this.ellipse.geometry = this.calculateEllipseGeometry()
        }
    }

    applyOrbitalTransform(newPos) {
        newPos.add(this.focalOffSet);
        newPos.applyAxisAngle(new Three.Vector3(1, 0, 0), Math.PI / 2); // Rotate from XY plane to XZ plane
        newPos.applyAxisAngle(new Three.Vector3(0, 1, 0), this.rotationRad);  // Rotate by argument of perihelion
        newPos.applyAxisAngle(new Three.Vector3(1, 0, 0), this.inclinationRad); // Rotate by inclination
        newPos.applyAxisAngle(new Three.Vector3(0, 1, 0), this.ascendingNodeRad); // Rotate by longitude of ascending node
        newPos.add(this.centerObject.mesh.position)
    }

    addToScene(scene) {
        scene.add(this.ellipse)
    }
}

class Donut {
    constructor(innerRadius, outerRadius, textureUrl, centerPosition, rotationPeriodMinutes, axialTiltDegrees) {
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
        this.rotationPeriod = rotationPeriodMinutes
    }

    rotate(minuteTimeStep) {
        //euler angle in degrees: 360/minutes
        const degreesPerMinute = 360 / this.rotationPeriod
        const radiansPerStep = degreesPerMinute * (Math.PI / 180) * minuteTimeStep;
        this.mesh.rotation.z += radiansPerStep
        this.mesh.rotation.z = this.mesh.rotation.z % (2 * Math.PI)
    }
}

export let planets = [];

export let orbits = [];

export function createPlanetsAndOrbits(currentTime, scene) {

    initialisationTime = currentTime
    planets.length = 0;
    orbits.length = 0;

    //sun
    const sun = new Planet(
        69570,
        sunTextureUrl,
        new Three.Vector3(0, 0, planetPosition[0]),
        36567,
        7.25 //(ecliptic), not plain :(
    )

    // Mercury
    const mercury = new Planet(
        2439.7,
        mercuryTextureUrl,
        new Three.Vector3(0, 0, planetPosition[1]),
        84960,
        0.03
    );
    const mercuryOrbit = new Orbit(sun, mercury,
        0.466697,
        0.307499,
        29.124,
        48.331,
        6.35,
        0.205630,
        new Date(Date.UTC(2025, 3, 4, 13, 40)),
        87.9691
    );

    // Venus
    const venus = new Planet(
        6051.8,
        venusTextureUrl,
        new Three.Vector3(0, 0, planetPosition[2]),
        -350906,
        -2.64
    );
    venus.addAtmosphere(70, venusAtmosphereTextureUrl, 25)
    const venusOrbit = new Orbit(sun, venus,
        0.728213,
        0.718440,
        54.884,
        76.680,
        2.15,
        0.006772,
        new Date(Date.UTC(2025, 2, 19, 19, 44)),
        224.701
    );


    // Earth
    const earth = new Planet(
        6371.0,
        earthTextureUrl,
        new Three.Vector3(0, 0, planetPosition[3]),
        1436,
        23.44,
        4.2
    );
    earth.addAtmosphere(25, earthCloudsTextureUrl, 25)
    const earthOrbit = new Orbit(sun, earth,
        1.01670963823,
        0.983292404576,
        114.20783,
        -11.26064,
        1.57869,
        0.0167086,
        new Date(Date.UTC(2025, 1, 5, 1, 22)),
        365.256363004
    );


    // Moon
    const moon = new Planet(
        1737.4,
        moonTextureUrl,
        new Three.Vector3(0, 0, planetPosition[4]),
        39341,
        6.68
    );
    //initially rotate moon to approximately face the correct side to the earth
    moon.mesh.rotation.y = 1.5 * Math.PI
    //all only approximated values
    const moonOrbit = new Orbit(earth, moon,
        0.00242383129 + 0.02,//unrealistic scales, moon would be in earth
        0.00270993162 + 0.02,
        318.15,
        25.08,
        6.68,
        0.0549,
        new Date(Date.UTC(2024, 12, 4, 5, 23)),
        27.321661
    );

    // Mars
    const mars = new Planet(
        3389.5,
        marsTextureUrl,
        new Three.Vector3(0, 0, planetPosition[5]),
        1476,
        25.19
    );
    const marsOrbit = new Orbit(sun, mars,
        1.66621,
        1.3814,
        286.5,
        49.578,
        1.63,
        0.0934,
        new Date(Date.UTC(2024, 5, 8, 11, 31)),
        686.980
    );

    // Jupiter
    const jupiter = new Planet(
        69911,
        jupiterTextureUrl,
        new Three.Vector3(0, 0, planetPosition[6]),
        595,
        3.13
    );
    const jupiterOrbit = new Orbit(sun, jupiter,
        5.4570,
        4.9506,
        273.867,
        100.464,
        0.32,
        0.0489,
        new Date(Date.UTC(2023, 1, 21)),
        4332.59
    );

    // Saturn
    const saturn = new Planet(
        58232,
        saturnTextureUrl,
        new Three.Vector3(0, 0, planetPosition[7]),
        633,
        26.73
    );
    //saturnRing
    saturn.addDonut(
        70000, 140180,
        saturnRingsTextureUrl,
        new Three.Vector3(0, 0, planetPosition[7]),
        720,
        26.73)
    const saturnOrbit = new Orbit(sun, saturn,
        10.1238,
        9.0412,
        339.392,
        113.665,
        0.93,
        0.0565,
        new Date(Date.UTC(2032, 10, 25)),
        10755.70
    );


    // Uranus
    const uranus = new Planet(
        25362,
        uranusTextureUrl,
        new Three.Vector3(0, 0, planetPosition[8]),
        1034,
        -82.23
    );
    const uranusOrbit = new Orbit(sun, uranus,
        20.0965,
        18.2861,
        96.998,
        74.006,
        0.99,
        0.04717,
        new Date(Date.UTC(2049, 7, 22)),
        30688.5
    );

    // Neptune
    const neptune = new Planet(
        24622,
        neptuneTextureUrl,
        new Three.Vector3(0, 0, planetPosition[9]),
        960,
        28.32
    );
    const neptuneOrbit = new Orbit(sun, neptune,
        30.33,
        29.81,
        273.187,
        131.783,
        0.74,
        0.008678,
        new Date(Date.UTC(2043, 8, 20)),
        60195
    );


    planets.push(
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
    );
    orbits.push(
        mercuryOrbit,
        venusOrbit,
        earthOrbit,
        moonOrbit,
        marsOrbit,
        jupiterOrbit,
        saturnOrbit,
        uranusOrbit,
        neptuneOrbit
    );

    planets.forEach(p => p.addToScene(scene));
    orbits.forEach(o => o.addToScene(scene));
}

export function stepTime(simulationTime) {
    orbits.forEach(o => o.updateTimePosition(simulationTime))
}

export function stepRotation(minuteTimeStep) {
    //Sun: 25d 9h 7m
    //Mercury: 58d 16h
    //Venus: 243d 26m
    //Earth: 23h 56m
    //Moon: locked:  27d 7h 41m
    //Mars: 24h 36m
    //Jupiter: 9h 55m
    //Saturn: 10h 33m
    //Saturn main rings: 5h-14h =>using 12h
    //Uranus: 17h 14m
    //Neptune: 16h

    if (!planets.length) return;
    planets.forEach(p => {
        p.rotate(minuteTimeStep);
    });
}

export function getFocusedPlanetID(cameraDistance, controls) {
    for (let i = 0; i < planets.length; i++) {
        // Check if the camera is within the correct trigger point range
        if (
            (i === 0 && cameraDistance < triggerPoints[i]) || // Special case for the Sun
            (i > 0 && cameraDistance <= triggerPoints[i] && cameraDistance > triggerPoints[i - 1])
        ) {
            if (controls.target !== planets[i].mesh.position) {
                return i;
            }
        }
    }
    return planets.length - 1;
}