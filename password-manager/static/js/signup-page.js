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
lengthmsg.classList.add('incomplete'); specialmsg.classList.add('incomplete'); numbermsg.classList.add('incomplete'); capitalmsg.classList.add('incomplete');
messages = [specialmsg,lengthmsg,capitalmsg,numbermsg]

function validation() {
    let psw = document.getElementById('psw').value;
    let confirm_psw = document.getElementById('confirm-psw').value;
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
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].classList.contains('complete') && confirm_psw.length == psw.length) {
            submitButton.disabled = false;
        } else {submitButton.disabled = true;}
    }
}

function fill_password_field() {
    document.getElementById("psw").value = document.getElementById("output").value;
    validation()
}