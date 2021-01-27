//const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//const numbers = "0123456789";
//const specials = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"; // from owasp.org/www-community/password-special-characters
let submitButton = document.getElementById('submitButton');
submitButton.disabled = true;
let form = document.getElementById('credentials');
let lengthmsg = document.getElementById('lengthCheck');
let specialmsg = document.getElementById('specialCheck');
let numbermsg = document.getElementById('numberCheck');
let capitalmsg = document.getElementById('capitalCheck');
let matchmsg = document.getElementById('match');
lengthmsg.classList.add('incomplete'); specialmsg.classList.add('incomplete'); numbermsg.classList.add('incomplete'); capitalmsg.classList.add('incomplete'); matchmsg.classList.add('incomplete');
messages = [specialmsg,lengthmsg,capitalmsg,numbermsg,matchmsg]
let pswfield = document.getElementById('psw');
let confirmpswfield = document.getElementById('confirm-psw');
let usernamefield = document.getElementById('username');
let formfields = [pswfield, confirmpswfield, usernamefield]

for (let i = 0; i < formfields.length; i++) {
    formfields[i].addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitButton.click();
        }
    })
}

function validation() { // client side only, server side also implemented in case of tampering
    let psw = pswfield.value;
    let confirm_psw = confirmpswfield.value;
    let username = usernamefield.value;
    if (psw.length >= 12) {lengthmsg.classList.replace("incomplete","complete");}
    else {lengthmsg.classList.replace('complete','incomplete');}
    for (let i = 0; i < uppercase.length; i++) {
        if (psw.includes(uppercase[i])) {capitalmsg.classList.replace("incomplete","complete"); break;}
        else {capitalmsg.classList.replace('complete','incomplete');}}
    for (let i = 0; i < numbers.length; i++) {
        if (psw.includes(numbers[i])) {numbermsg.classList.replace("incomplete","complete"); break;}
        else {numbermsg.classList.replace('complete','incomplete');}}
    for (let i = 0; i < special.length; i++) {
        if (psw.includes(special[i])) {specialmsg.classList.replace("incomplete","complete"); break;}
        else {specialmsg.classList.replace('complete','incomplete');}}
    if (psw === confirm_psw && psw.length > 0) {matchmsg.classList.replace('incomplete','complete')}
    else {matchmsg.classList.replace('complete','incomplete')}
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].classList.contains('complete') && username.length <= 64 && psw.length <= 128) {
            submitButton.disabled = false;
        } else {submitButton.disabled = true; break;}
    }
}

function fill_password_field() {
    pswfield.value = document.getElementById("output").value;
    validation()
}