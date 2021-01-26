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

function validation() { // client side only, server side also implemented in case of tampering
    let psw = document.getElementById('psw').value;
    let confirm_psw = document.getElementById('confirm-psw').value;
    let username = document.getElementById('username').value;
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
    if (psw === confirm_psw) {matchmsg.classList.replace('incomplete','complete')}
    else {matchmsg.classList.replace('complete','incomplete')}
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].classList.contains('complete') && username.length <= 64 && psw.length <= 128) {
            submitButton.disabled = false;
        } else {submitButton.disabled = true; break;}
    }
}

function fill_password_field() {
    document.getElementById("psw").value = document.getElementById("output").value;
    validation()
}