export {boxTrigger};
let boxTrigger = true;
const ToggleBoxButton = document.querySelector('#Toggle-Box-Button')
ToggleBoxButton.addEventListener('click', togglePlanetBox);
let infoTrigger = false;
const InfoButton = document.querySelector('#Toggle-info-Button')
InfoButton.addEventListener('click', toggleInfoDisplay);
let settingsTrigger = false;
const SettingsButton = document.querySelector('#Toggle-settings-Button')
SettingsButton.addEventListener('click', toggleSettings);

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

function toggleInfoDisplay() {
    const display = document.getElementById('info-pop-in');
    if (infoTrigger===false ) {
        infoTrigger = true;
        display.style.visibility = 'visible';
        display.style.opacity=100;
    } else {
        infoTrigger = false;
        display.style.opacity=0;
        display.style.visibility = 'hidden';
    }
}
//for future speed settings
function toggleSettings() {
    const display = document.getElementById('info-pop-in');
    if (settingsTrigger===false ) {
        settingsTrigger = true;
        display.style.visibility = 'visible';
        display.style.opacity=100;
    } else {
        settingsTrigger = false;
        display.style.opacity=0;
        display.style.visibility = 'hidden';
    }
}


