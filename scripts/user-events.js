export {Boxtrigger};
let Boxtrigger = true;
const ToggleBoxButton = document.querySelector('#Toggle-Box-Button')
ToggleBoxButton.addEventListener('click', togglePlanetBox);
let infotrigger = false;
const InfoButton = document.querySelector('#Toggle-info-Button')
InfoButton.addEventListener('click', toggleInfoDisplay);

function togglePlanetBox() {
    const elements = document.getElementsByClassName('contentBox-left');
    const elements2 = document.getElementsByClassName('contentBox-right');
    const allElements = [...elements, ...elements2];
    console.log("aaaaaaaaaaa")

    if (Boxtrigger === false) {
        for (const element of allElements) {
            element.style.visibility = 'visible';
        }
        Boxtrigger = true;
    } else {
        for (const element of allElements) {
            element.style.visibility = 'hidden';
        }
        Boxtrigger = false;
    }
}

function toggleInfoDisplay() {
    const display = document.getElementById('info-pop-in');
    if (infotrigger===false ) {
        infotrigger = true;
        display.style.visibility = 'visible';
        display.style.opacity=100;
    } else {
        infotrigger = false;
        display.style.opacity=0;
        display.style.visibility = 'hidden';
    }
}


