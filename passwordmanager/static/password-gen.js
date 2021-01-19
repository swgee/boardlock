const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lowers = "abcdefghijklmnopqrstuvwxyz"
const numbers = "0123456789"
const specials = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" // from owasp.org/www-community/password-special-characters
let uppercaseBool = false
let lowercaseBool = true
let numbersBool = false
let specialBool = false
let numChar;

function update(button) {
    if (button==='lowercaseVal') {
        if (lowercaseBool===false) {document.getElementById("lowercaseID").classList.add('active');}
        else {document.getElementById("lowercaseID").classList.remove('active');}
        lowercaseBool=!lowercaseBool;
    }
    if (button==='uppercaseVal') {
        if (uppercaseBool===false) {document.getElementById("uppercaseID").classList.add('active');}
        else {document.getElementById("uppercaseID").classList.remove('active');}
        uppercaseBool=!uppercaseBool;
    }
    if (button==='numbersVal') {
        if (numbersBool===false) {document.getElementById("numbersID").classList.add('active');}
        else {document.getElementById("numbersID").classList.remove('active');}
        numbersBool=!numbersBool;
    }
    if (button==='specialVal') {
        if (specialBool===false) {document.getElementById("specialID").classList.add('active');}
        else {document.getElementById("specialID").classList.remove('active');}
        specialBool=!specialBool;
    }
}
function generate() {
    let numCharInput = document.getElementById("numCharID").value;
    let validInput = true
    for (let i = 0; i < numCharInput.length; i++) {
        if (numbers.indexOf(numCharInput[i]) === -1) {
            validInput = false
        }
    }
    if (validInput === false) {
        print_error()
    } else {
        numChar = parseInt(numCharInput, 10);
        if (numChar <= 0 || numChar > 1000) {
            print_error();
        } else {
            document.getElementById("error").innerHTML = "";
            document.getElementById('output').value = numChar;
        }
    }

    function print_error() {
        document.getElementById("error").innerHTML = "Must enter an integer between 1 and 1000.";
    }
}

let input = document.getElementById("numCharID");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btn").click();
    }
})

// fix empty input validation
// create random password function
// reduce getElementByID
// reduce if statements
