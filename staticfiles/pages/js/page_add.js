
let text_options = "";
let id_counter = 0;

generate_options();
add_record(null)

/**
 * Generate <option> tags to populate the type <selector> with in each record
 */
function generate_options() {
    text_options = "<option value='text'>text</option>";
}

/**
 * Add new record to the page in the position of record_insert_id, or at the end if null or not found.
 * @param {String|null} record_insert_id Id of an existing record to insert new record before
 */
function add_record(record_insert_id) {
    let main = document.getElementById("main");

    // Record <div> to hold the data section
    let record = document.createElement("div");
    record.id = "R" + (id_counter++).toString();
    record.className = "record";
    record.style.overflow = "hidden";

    // Toolbar <div> shown at the top of the record
    let top_bar = document.createElement("div");
    top_bar.className = "top";
    // top_bar.style.border = "1px solid red";
    top_bar.style.overflow = "hidden";

    // <div> to hold the actual data
    let content = document.createElement("div");
    content.className = "content";
    content.style.border = "1px dashed lightblue";
    content.style.overflow = "hidden";

    // Toolbar <div> shown at the bottom of the record
    let bottom_bar = document.createElement("div");
    bottom_bar.className = "bottom";
    // bottom_bar.style.border = "1px solid blue";
    bottom_bar.style.overflow = "hidden";

    let id_label = document.createElement("p");
    id_label.innerHTML = "ID:" + record.id;
    id_label.style.paddingRight = "20px";
    id_label.style.float = "left";

    // <button> to shift record up
    let move_up_button = document.createElement("button");
    move_up_button.innerHTML = "▲";
    move_up_button.style.float = "right";
    move_up_button.onclick = function() { move_record(record.id, "up"); };

    let selector_label = document.createElement("p");
    selector_label.innerHTML = "Type:";
    selector_label.style.float = "left";

    // <select> to choose type of data to be held
    let type_selector = document.createElement("select");
    type_selector.className = "type";
    type_selector.innerHTML = text_options;
    type_selector.style.float = "left";

    // <button> to add new record below this record
    let add_new_button = document.createElement("button");
    add_new_button.innerHTML = "+";
    add_new_button.onclick = function () { add_record(record.id); };
    add_new_button.style.float = "left";

    // <button> to remove this record
    let remove_button = document.createElement("button");
    remove_button.innerHTML = "-";
    remove_button.onclick = function () { main.removeChild(record) };
    remove_button.style.float = "left";

    // <button> to shift record down
    let move_down_button = document.createElement("button");
    move_down_button.innerHTML = "▼";
    move_down_button.style.float = "right";
    move_down_button.onclick = function() { move_record(record.id, "down"); };

    top_bar.appendChild(id_label);
    top_bar.appendChild(selector_label);
    top_bar.appendChild(type_selector);
    top_bar.appendChild(move_up_button);

    bottom_bar.appendChild(add_new_button);
    bottom_bar.appendChild(remove_button);
    bottom_bar.appendChild(move_down_button);

    record.appendChild(top_bar);
    record.appendChild(document.createElement("br"))
    record.appendChild(content);
    record.appendChild(document.createElement("br"))
    record.appendChild(bottom_bar);

    let success = false;
    let next = false;
    // Find record_insert_id and insert new record before it
    for (let node of main.childNodes) {
        if (next) {
            main.insertBefore(record, node);
            success = true;
            break;
        }
        if (node.id === record_insert_id) {
            next = true;
        }
    }
    // Append new record if record_insert_id was not found
    if (!success) {
        main.appendChild(record);
    }
    // Update contents <div> to hold corresponding data type
    set_record(record.id);
}

/**
 * Shift position of record by one.
 * @param {String} record_id Id of the record to be moved
 * @param {String} direction Shift one place up if set to "up", or one place down if set to "down", otherwise do nothing
 */
function move_record(record_id, direction) {
    let main = document.getElementById("main");
    let record = document.getElementById(record_id);
    let nodes = main.childNodes;
    let current_index = Array.prototype.slice.call(nodes).indexOf(record);
    if (direction === "up") {
        if (current_index === 0) { // Cannot move up more
            return;
        }
        // Shift up one space
        let neighbour = nodes[current_index-1]
        main.removeChild(record);
        main.insertBefore(record, neighbour);
    } else if (direction === "down") {
        if (current_index >= nodes.length - 2) { // Moving to end of array
            main.removeChild(record);
            main.appendChild(record);
            return;
        }
        // Shift up one space
        let neighbour = nodes[current_index+2]
        main.removeChild(record);
        main.insertBefore(record, neighbour);
    }
}

/**
 * Set the content <div> in the record to contain elements corresponding to its type
 * @param {String} record_id Id of the record to update
 */
function set_record(record_id) {
    let record = document.getElementById(record_id);
    let type = record.querySelector("div[class='top']").querySelector("select[class='type']").value;
    record.querySelector("div[class='content']").innerHTML = "";
    // Call setup function corresponding to the set record type
    switch (type) {
        case "text":
            set_record_text(record);
            break;
    }
}

/**
 * Set record content <div> to contain text-area based elements
 * @param {HTMLElement} record Record to update
 */
function set_record_text(record) {
    let content = record.querySelector("div[class='content']");
    let textArea = document.createElement("textarea");
    textArea.style.width = "100%";
    textArea.oninput = function () {
        textArea.style.height = '';
        textArea.style.height = textArea.scrollHeight + 3 + "px"
    };

    content.appendChild(textArea);
}
