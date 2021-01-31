document.getElementById('username').innerHTML = ''; // clear p in html
document.getElementById('data').innerHTML = '';

// append data to table
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
data_table = document.getElementById("data_table")
data_table.innerHTML += table

// blurrify password column
for (let i = 1; i < data_table.rows.length; i++) {
    row = data_table.getElementsByTagName("tr")[i]
    cell = row.getElementsByTagName("td")[1]
    cell.classList.add('blurry')
    //data_table.getElementsByTagName("tr")[row].getElementsByTagName("td")[1].classList.add("blurry")
}
