export let boxTrigger = true;
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
    if (infoTrigger || settingsTrigger) {
        display.style.visibility = 'visible';
        display.style.opacity = '100';
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
            settings.style.display = 'block';
            info.style.opacity = '0';
            info.style.visibility = 'hidden';
            info.style.display = 'none';
        }
    } else {
        display.style.opacity = '0';
        display.style.visibility = 'hidden';
    }


}


const TimeSlider = document.getElementById("time-slider");
const SliderValueLabel = document.getElementById("slider-value");

//time increment values in minutes
const timeIncrements = [
    {label: "5min/sec", value: 5},
    {label: "10min/sec", value: 10},
    {label: "20min/sec", value: 20},
    {label: "40min/sec", value: 40},
    {label: "1h/sec", value: 60},
    {label: "2h/sec", value: 2 * 60},
    {label: "5h/sec", value: 5 * 60},
    {label: "10h/sec", value: 10 * 60},
    {label: "1d/sec", value: 24 * 60},
    {label: "2d/sec", value: 2 * 24 * 60},
    {label: "5d/sec", value: 5 * 24 * 60},
    {label: "10d/sec", value: 10 * 24 * 60},
    {label: "20d/sec", value: 20 * 24 * 60},
    {label: "50d/sec", value: 50 * 24 * 60},
    {label: "100d/sec", value: 100 * 24 * 60},
    {label: "1y/sec", value: 365 * 24 * 60},
    {label: "2y/sec", value: 2 * 365 * 24 * 60},
    {label: "5y/sec", value: 5 * 365 * 24 * 60}
];
// Update the label when the slider is moved
TimeSlider.addEventListener("input", function () {
    const index = parseInt(TimeSlider.value, 10);
    const selectedIncrement = timeIncrements[index];
    SliderValueLabel.textContent = selectedIncrement.label;
});

// Initialize the label to show the default value
TimeSlider.dispatchEvent(new Event("input"));

export function getCurrentTimeIncrement() {
    return timeIncrements[parseInt(TimeSlider.value, 10)].value
}

