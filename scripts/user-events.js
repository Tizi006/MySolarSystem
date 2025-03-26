import * as ph from './planethelper.js'

let boxTrigger = true;
const ToggleBoxButton = document.querySelector('#Toggle-Box-Button')
ToggleBoxButton.addEventListener('click', togglePlanetBox);

function togglePlanetBox() {
    const elements = document.getElementsByClassName('contentBox-left');
    const elements2 = document.getElementsByClassName('contentBox-right');
    const allElements = [...elements, ...elements2];
    if (boxTrigger === false) {
        for (const element of allElements) {
            element.style.visibility = 'visible';
        }
        boxTrigger = true;
    } else {
        for (const element of allElements) {
            element.style.visibility = 'hidden';
        }
        boxTrigger = false;
    }
}

export function setBoxVisibility(boxID) {
    const Box = [
        'Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune','Solar-system'
    ].map(id => document.getElementById(id));
    if (boxTrigger === true) {
        Box.forEach(planet => planet.style.visibility = 'hidden');
        Box[boxID].style.visibility = 'visible';
    }
}

let infoTrigger = false;
const InfoButton = document.querySelector('#Toggle-info-Button')
InfoButton.addEventListener('click', toggleInfoDisplay);

function toggleInfoDisplay() {
    infoTrigger = infoTrigger === false;
    if (settingsTrigger) {
        settingsTrigger = false
    }
    updatePopInVisibility()
}

let settingsTrigger = false;
const SettingsButton = document.querySelector('#Toggle-settings-Button')
SettingsButton.addEventListener('click', toggleSettings);

function toggleSettings() {
    settingsTrigger = settingsTrigger === false;
    if (infoTrigger) {
        infoTrigger = false
    }
    updatePopInVisibility()
}

function updatePopInVisibility() {
    const display = document.getElementById('pop-in');
    const info = document.getElementById('info-display');
    const settings = document.getElementById('settings-display');
    const contentBoxes = document.querySelectorAll('.contentBox-right,.contentBox-left');
    if (infoTrigger || settingsTrigger) {
        display.style.visibility = 'visible';
        display.style.opacity = '100';
        contentBoxes.forEach((box) =>{box.classList.add('shift-left')})
        if (infoTrigger) {
            info.style.visibility = 'visible';
            info.style.opacity = '100';
            info.style.display = 'block';
            settings.style.opacity = '0';
            settings.style.visibility = 'hidden';
            settings.style.display = 'none';
        } else {
            settings.style.visibility = 'visible';
            settings.style.opacity = '100';
            settings.style.display = 'flex';
            info.style.opacity = '0';
            info.style.visibility = 'hidden';
            info.style.display = 'none';
        }
    } else {
        display.style.opacity = '0';
        display.style.visibility = 'hidden';
        contentBoxes.forEach((box) =>{box.classList.remove('shift-left')})
    }


}


const TimeSlider = document.getElementById("time-slider");
const SliderValueLabel = document.getElementById("slider-value");

//time increment values in minutes
const timeIncrements = [
    { label: "-5y/s", value: -5 * 365 * 24 * 60 },
    { label: "-2y/s", value: -2 * 365 * 24 * 60 },
    { label: "-1y/s", value: -365 * 24 * 60 },
    { label: "-100d/s", value: -100 * 24 * 60 },
    { label: "-50d/s", value: -50 * 24 * 60 },
    { label: "-20d/s", value: -20 * 24 * 60 },
    { label: "-10d/s", value: -10 * 24 * 60 },
    { label: "-5d/s", value: -5 * 24 * 60 },
    { label: "-2d/s", value: -2 * 24 * 60 },
    { label: "-1d/s", value: -24 * 60 },
    { label: "-10h/s", value: -10 * 60 },
    { label: "-5h/s", value: -5 * 60 },
    { label: "-2h/s", value: -2 * 60 },
    { label: "-1h/s", value: -60 },
    { label: "-40min/s", value: -40 },
    { label: "-20min/s", value: -20 },
    { label: "-10min/s", value: -10 },
    { label: "-5min/s", value: -5 },
    { label: "0s", value: 0 }, // Pause
    {label: "5min/s", value: 5},
    {label: "10min/s", value: 10},
    {label: "20min/s", value: 20},
    {label: "40min/s", value: 40},
    {label: "1h/s", value: 60},
    {label: "2h/s", value: 2 * 60},
    {label: "5h/s", value: 5 * 60},
    {label: "10h/s", value: 10 * 60},
    {label: "1d/s", value: 24 * 60},
    {label: "2d/s", value: 2 * 24 * 60},
    {label: "5d/s", value: 5 * 24 * 60},
    {label: "10d/s", value: 10 * 24 * 60},
    {label: "20d/s", value: 20 * 24 * 60},
    {label: "50d/s", value: 50 * 24 * 60},
    {label: "100d/s", value: 100 * 24 * 60},
    {label: "1y/s", value: 365 * 24 * 60},
    {label: "2y/s", value: 2 * 365 * 24 * 60},
    {label: "5y/s", value: 5 * 365 * 24 * 60}
];
// Update the label when the slider is moved
TimeSlider.addEventListener("input", function () {
    const index = parseInt(TimeSlider.value, 10);
    const selectedIncrement = timeIncrements[index];
    SliderValueLabel.textContent = selectedIncrement.label;
});
export function updateDate(simulationTime) {
    const optionsTime = { hour: 'numeric', minute: 'numeric' };
    document.getElementById('date-display').textContent = simulationTime.toLocaleDateString('de');
    document.getElementById('time-display').textContent = simulationTime.toLocaleTimeString('de', optionsTime);
}
// Initialize the label to show the default value
TimeSlider.dispatchEvent(new Event("input"));

export function getCurrentTimeIncrement() {
    return timeIncrements[parseInt(TimeSlider.value, 10)].value
}

const AxelCheckBox = document.getElementById('toggle-rotation-axel');
ph.planets.forEach(p=>p.rotationAxel.visible= AxelCheckBox.checked)
AxelCheckBox.addEventListener('change', () => {
    ph.planets.forEach(p=>p.rotationAxel.visible= AxelCheckBox.checked)
});

const OrbitCheckBox = document.getElementById('toggle-orbit-ellipse');
ph.orbits.forEach(o=>o.ellipse.visible= OrbitCheckBox.checked)
OrbitCheckBox.addEventListener('change', () => {
    ph.orbits.forEach(o=>o.ellipse.visible= OrbitCheckBox.checked)
});