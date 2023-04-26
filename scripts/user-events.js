export {Boxtrigger};
let Boxtrigger = true;
const Togglebox = document.querySelector('#Toggle-Box-Button')
Togglebox.addEventListener('click', toggleInfobox);

function toggleInfobox() {
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



