document.getElementById('username').innerHTML = ''; // clear p in html
document.getElementById('data').innerHTML = '';
let num_selected_rows = 0;
editButton = document.getElementById("edit");
deleteButton = document.getElementById('delete');
editButton.disabled = true
deleteButton.disabled = true;
editor_and_passgen = document.getElementById('editor_and_passgen')
ui = document.getElementById("ui");
form = document.getElementById('entry_form');
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
    cell = row.getElementsByTagName("td")[2];
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

function edit_row(row) {
    ui.classList.add('not_clickable');
    editor_and_passgen.classList.remove('hide');
    document.getElementById('action').innerHTML = "Edit Entry";
    cells = row.getElementsByTagName("td");
    form.elements['change_type'].value = 'edit'
    form.elements['title_field'].value = cells[0].innerHTML;
    form.elements['username_field'].value = cells[1].innerHTML;
    form.elements['password_field'].value = cells[2].innerHTML;
    form.elements['url_field'].value = cells[3].innerHTML;
    form.elements['category_field'].value = cells[4].innerHTML;
}

function create() {
    ui.classList.add('not_clickable');
    editor_and_passgen.classList.remove('hide');
    document.getElementById('action').innerHTML = "Create New Entry"
    form.elements['change_type'].value = 'new'
}

function edit() {
    for (let i = 0; i < data_table.rows.length; i++) {
        row = data_table.getElementsByTagName("tr")[i];
        if (row.classList.contains('selected')) {;
            edit_row(row)
            break
        }
    }
}

function close_editor() {
    form.reset()
    editor_and_passgen.classList.add('hide');
    ui.classList.remove('not_clickable');
}

function fill_password_field() {
    form.elements['password_field'].value = document.getElementById("output").value;
}

function save_data() {
    console.log('hi')
}