const buttonElement = document.getElementsByClassName("butom-options")[0];
const selectElement = document.getElementsByClassName("button-update-choice")[0];
const cancelBntElement = document.getElementsByClassName("button-cancel")[0];

function closeSelectForm(){

    buttonElement.removeEventListener("click", openSelectform, false);
    document.getElementById("selectObject").style.display = "none";
    buttonElement.addEventListener("click", openOptions, false);
}

function openOptions(){
    if(document.getElementById("myButton").style.display != "flex"){
        document.getElementById("myButton").style.display = "flex";
    }

    else{

        document.getElementById("myButton").style.display = "none";
        
    }
}

function openSelectform(){ 
    document.getElementById("selectObject").style.display = "flex";
    buttonElement.removeEventListener("click", openOptions, false);
    document.getElementById("myButton").style.display = "none";

}


document.addEventListener('DOMContentLoaded', function () {
    buttonElement.addEventListener("click", openOptions, false);
    selectElement.addEventListener('click', openSelectform, false);
    cancelBntElement.addEventListener('click', closeSelectForm, false);
});

