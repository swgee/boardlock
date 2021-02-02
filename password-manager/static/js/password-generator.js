const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const special = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"; // from owasp.org/www-community/password-special-characters
let uppercaseBool = false;
let lowercaseBool = false;
let numbersBool = false;
let specialBool = false;
let numChar;
let errormsg = document.getElementById("error");

let numCharInputField = document.getElementById("numCharID");
numCharInputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btn").click();
    }
})

function update(button) {
    if (button==='lowercaseVal') {
        let lowercaseButton = document.getElementById("lowercaseID");
        if (lowercaseBool===false) {lowercaseButton.classList.add('active');}
        else {lowercaseButton.classList.remove('active');}
        lowercaseBool=!lowercaseBool;
    }
    if (button==='uppercaseVal') {
        let uppercaseButton = document.getElementById("uppercaseID");
        if (uppercaseBool===false) {uppercaseButton.classList.add('active');}
        else {uppercaseButton.classList.remove('active');}
        uppercaseBool=!uppercaseBool;
    }
    if (button==='numbersVal') {
        let numbersButton = document.getElementById("numbersID");
        if (numbersBool===false) {numbersButton.classList.add('active');}
        else {numbersButton.classList.remove('active');}
        numbersBool=!numbersBool;
    }
    if (button==='specialVal') {
        let specialButton = document.getElementById("specialID");
        if (specialBool===false) {specialButton.classList.add('active');}
        else {specialButton.classList.remove('active');}
        specialBool=!specialBool;
    }
}
function generate() {
    let numCharInput = document.getElementById("numCharID").value;
    let validInput = true;
    for (let i = 0; i < numCharInput.length; i++) {
        if (numbers.indexOf(numCharInput[i]) === -1) {
            validInput = false;
        }
    }
    if (validInput) {
        numChar = parseInt(numCharInput, 10);
        if (numChar <= 128 && numChar >= 1 && (lowercaseBool || uppercaseBool || numbersBool || specialBool)) {
            errormsg.innerHTML = " ";
            document.getElementById('output').value = random_string();
        } else {
            print_error();
        }
    } else {
        print_error();
    }

    function print_error() {
        errormsg.innerHTML = "Must enter an integer between 1 and 128 with at least one option selected.";
    }
}

function random_string() {
    let optionsArray = ["lowercase","uppercase","numbers","special"];
    let characterSet = "";
    for (let i = 0; i < optionsArray.length; i++) {
        if (eval(optionsArray[i].concat("Bool")) === true) {
            characterSet = characterSet.concat(eval(optionsArray[i]));
        }
    }
    let password = ""
    for (let i = 0; i < numChar; i++) {
        password = password.concat(characterSet[Math.floor(Math.random() * characterSet.length)])
    }
    return password;
}

function show_password(field, button) {
    if (field.type === "password") {
        field.type = "text";
        button.innerHTML = "Hide";
    }
    else {
        field.type = "password";
        button.innerHTML = "Show";
    }
}

