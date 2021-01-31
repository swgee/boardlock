document.getElementById('username').innerHTML = ''; // clear p in html
document.getElementById('data').innerHTML = '';
let num_selected_rows = 0;
editButton = document.getElementById("edit");
deleteButton = document.getElementById('delete');
editButton.disabled = true
deleteButton.disabled = true;

// append data to table
let rows = data.split('\n');
rows.pop(rows.length - 1);
let table = "";
for (let i = 0; i < rows.length; i++) {
    rows[i] = rows[i].split('\t');
    table += "<tr>";
    for (let x = 0; x < rows[i].length; x++) {
        table += "<td>" + rows[i][x] + "</td>";
    }
    table += "</tr>";
}
data_table = document.getElementById("data_table");
data_table.innerHTML += table;

// blurrify password column, add background colors
for (let i = 1; i < data_table.rows.length; i++) {
    row = data_table.getElementsByTagName("tr")[i];
    row.classList.add('unselected');
    cell = row.getElementsByTagName("td")[1];
    cell.classList.add('blurry');
}

document.querySelectorAll('#data_table tr')
.forEach(row => row.addEventListener("click", function() {
    if (
        row.classList.contains('selected')) {row.classList.replace('selected', 'unselected');
        num_selected_rows -= 1;
    }
    else {
        row.classList.replace('unselected', 'selected');
        num_selected_rows += 1;
    }
    if (num_selected_rows != 1) {
        editButton.disabled = true;
    }
    else {
        editButton.disabled = false;
    }
    if (num_selected_rows == 0) {
        deleteButton.disabled = true;
    }
    else {
        deleteButton.disabled = false;
    }
}));
