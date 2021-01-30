document.getElementById('username').innerHTML = ''; // clear p in html
document.getElementById('data').innerHTML = '';

let rows = data.split('\n');
rows.pop(rows.length - 1);
let table = ""
for (let i = 0; i < rows.length; i++) {
    rows[i] = rows[i].split('\t');
    table += "<tr>"
    for (let x = 0; x < rows[i].length; x++) {
        table += "<td>" + rows[i][x] + "</td>"
    }
    table += "</tr>"
}
document.getElementById("data_table").innerHTML += table
