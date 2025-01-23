const buttonElement = document.getElementsByClassName("butom-options")[0];
const selectElement = document.getElementsByClassName("button-update-choice")[0];


function openOptions(){
    document.getElementById("myButton").style.display = "flex";
}

function openSelectform(){
    document.getElementById("selectObject").style.display = "flex";
    buttonElement.removeEventListener("click", openOptions, false);
    document.getElementById("myButton").style.display = "none";

}

document.addEventListener('DOMContentLoaded', function () {
    buttonElement.addEventListener("click", openOptions, false);

    selectElement.addEventListener('click', openSelectform, false);
});



// function insertOptionsContent(){
//     console.log("inside function")
//     let object = readDataStored();
//     const selectAtt = document.getElementById('selectID');
//     object.forEach(obj => {
//         console.log("object name: ", obj.name)
//         let newElement = document.createElement('option');
//         newElement.setAttribute("value", `${obj.name}`);
//         selectAtt.appendChild(newElement);
//     });

// }


// function readDataStored() {
//     let fs = require('fs');
//     let fileContent = fs.readFile('./stored.json', (error) => error && console.error(error));
//     return fileContent;
// }

// insertOptionsContent();

