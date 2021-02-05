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
let d = new Date()
document.getElementById('username_required').style.display = 'none'


// append data to table
let entries = data.split('|||||');
let table = "";
for (let i = 0; i < entries.length-1; i++) {
    entries[i] = entries[i].split('\t');
    table += "<tr>";
    for (let x = 0; x < entries[i].length; x++) {
        table += "<td>" + entries[i][x] + "</td>";
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
    if(e.target == document.body || e.target == document.getElementById('extender')) {
        unselect_rows();
    }
}

function edit_row(row) {
    ui.classList.add('not_clickable');
    editor_and_passgen.classList.remove('hide');
    document.getElementById('action').innerHTML = "Edit Entry";
    cells = row.getElementsByTagName("td");
    document.getElementById('extender').classList.remove('extender')
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
    document.getElementById('extender').classList.remove('extender')
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

function cancel() {
    if (form.elements['username_field'].value == '' && form.elements['change_type'].value == 'edit') {}
    else {
        form.reset()
        editor_and_passgen.classList.add('hide');
        ui.classList.remove('not_clickable');
        document.getElementById('username_required').style.display = 'none'
        document.getElementById('extender').classList.add('extender')
    }
}

function fill_password_field() {
    form.elements['password_field'].value = document.getElementById("output").value;
}

function save_data() {
    if (form.elements['username_field'].value != '') {
        form_elements = [form.elements[1].value, form.elements[2].value, form.elements[3].value, form.elements[5].value, form.elements[6].value]
        if (form.elements['change_type'].value == 'new') {
            new_row = "<tr>";
            for (let i = 0; i < form_elements.length; i++) {
                new_row += "<td>" + form_elements[i] + "</td>"
            }
            new_row += "<td>" + get_time() + '</td></tr>';
            data_table.innerHTML += new_row;
            post_data()
        }
        if (form.elements['change_type'].value == 'edit') {
            changed = false;
            for (let i = 0; i < form_elements.length; i++) {
                if (cells[i].innerHTML != form_elements[i]) {
                    changed = true;
                    break;
                }
            }
            if (changed == true) {
                for (let i = 0; i < form_elements.length; i++) {
                    cells[i].innerHTML = form_elements[i]
                }
                post_data()
            }
        }
    }
    else {
        document.getElementById('username_required').style.display = ''
    }
}

function get_time() {
    min = ''
    hour = ''
    if (d.getMinutes() < 10) {
        min = '0' + d.getMinutes()
    } else {
        min = d.getMinutes()
    }
    if (d.getHours() < 10) {
        hour = '0' + d.getHours()
    }
    else {
        hour = d.getHours()
    }
    return (d.getMonth() + 1) + '/' + d.getDay() + '/' + d.getFullYear() + ' ' + hour + ':' + min
}

function compile_table() {
    let data_string = ''
    rows = data_table.getElementsByTagName('tr')
    for (let r = 1; r < rows.length; r++) {
        cells = rows[r].getElementsByTagName("td")
        for (let c = 0; c < cells.length; c++) {
            cell = cells[c]
            data_string += cell.innerHTML
            if (c !== (cells.length - 1)) {
                data_string = data_string.concat('\t')
            }
        }
        data_string = data_string.concat('|||||')
    }
    return data_string
}

function post_data() {
    post_form = document.getElementById('post_form')
    post_form.elements['table_data'].value = compile_table()
    post_form.submit()
}
function open_delete() {
    document.getElementById('delete_prompt').style.display = '';
    document.getElementById('layer').classList.add('overlay');
}
function close_delete() {
    document.getElementById('delete_prompt').style.display = 'none';
    document.getElementById('layer').classList.remove('overlay');
}

function delete_rows() {
    to_delete = []
    rows = data_table.getElementsByTagName('tr')
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].classList.contains('selected')) {
            to_delete += i
        }
    }
    for (let i = to_delete.length-1; i >= 0; i--) {
        data_table.deleteRow(to_delete[i])
    }
    post_data()
}

function change_password() {

}

function search() {

}

function export_database() {

}