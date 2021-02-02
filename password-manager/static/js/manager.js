document.getElementById('username').innerHTML = ''; // clear p in html
document.getElementById('data').innerHTML = '';
let num_selected_rows = 0;
editButton = document.getElementById("edit");
deleteButton = document.getElementById('delete');
editButton.disabled = true
deleteButton.disabled = true;
editor_and_passgen = document.getElementById('editor_and_passgen')
ui = document.getElementById("ui");
form_data = document.getElementById('entry_form').elements;
// passwordGenerator = document.getElementById('password_generator')

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
        if (row.classList.contains('unselected')) {
            row.classList.replace('unselected', 'selected');
            num_selected_rows += 1;
        }
        deleteButton.disabled = false;
        if (num_selected_rows == 1) {
            editButton.disabled = false;
        }
        else {
            editButton.disabled = true;
        }
    }));

function unselect_rows() {
    for (let i = 1; i < data_table.rows.length; i++) {
        row = data_table.getElementsByTagName("tr")[i];
        if (row.classList.contains('selected') == true) {
            row.classList.replace('selected', 'unselected');
        }
    }
    editButton.disabled = true;
    deleteButton.disabled = true;
    num_selected_rows = 0;
}

document.onclick = function(e){
    if(e.target.tagName != "TD") {
        unselect_rows();
    }
}

function create(entry) {
    ui.classList.add('not_clickable');
    editor_and_passgen.classList.remove('hide');
}

function close_editor() {
    editor_and_passgen.classList.add('hide');
    ui.classList.remove('not_clickable');
}

function fill_password_field() {
    form_data['password_field'].value = document.getElementById("output").value;
}