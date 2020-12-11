
let id_counter = 0;
add_record(null)

function add_record(record_id) {
    let main = document.getElementById("main");

    let record = document.createElement("div");
    record.id = (id_counter++).toString();
    record.className = "record";
    record.style.overflow = "hidden";

    let top_bar = document.createElement("div");
    // top_bar.style.border = "1px solid red";
    top_bar.style.overflow = "hidden";
    let center_body = document.createElement("div");
    // center_body.style.border = "1px solid green";
    center_body.style.overflow = "hidden";
    let bottom_bar = document.createElement("div");
    // bottom_bar.style.border = "1px solid blue";
    bottom_bar.style.overflow = "hidden";

    let id_tag = document.createElement("p");
    id_tag.innerHTML = "ID:" + record.id;
    id_tag.style.float = "left";

    let move_up_button = document.createElement("button");
    move_up_button.innerHTML = "▲";
    move_up_button.style.float = "right";
    move_up_button.onclick = function() { move_record(record.id, "up"); };

    let label = document.createElement("p");
    label.innerHTML = "something in it";

    let add_new_button = document.createElement("button");
    add_new_button.innerHTML = "+";
    add_new_button.onclick = function () { add_record(record.id); };
    add_new_button.style.float = "left";

    let move_down_button = document.createElement("button");
    move_down_button.innerHTML = "▼";
    move_down_button.style.float = "right";
    move_down_button.onclick = function() { move_record(record.id, "down"); };

    top_bar.appendChild(id_tag);
    top_bar.appendChild(move_up_button);
    center_body.appendChild(label);
    bottom_bar.appendChild(add_new_button);
    bottom_bar.appendChild(move_down_button);
    record.appendChild(top_bar);
    record.appendChild(document.createElement("br"))
    record.appendChild(center_body);
    record.appendChild(document.createElement("br"))
    record.appendChild(bottom_bar);
    let success = false;
    let next = false;
    for (let node of main.childNodes) {
        if (next) {
            main.insertBefore(record, node);
            success = true;
            break;
        }
        if (node.id === record_id) {
            next = true;
        }
    }
    if (!success) {
        main.appendChild(record);
    }
}

function move_record(record_id, direction) {
    let main = document.getElementById("main");
    let record = document.getElementById(record_id);
    let nodes = main.childNodes;
    let index = -1;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === record) {
            index = i;
            break;
        }
    }
    if (direction === "up") {
        if (index === 0) {
            return;
        }
        let neighbour = nodes[index-1]
        main.removeChild(record);
        main.insertBefore(record, neighbour);
    } else {
        if (index >= nodes.length - 2) {
            main.removeChild(record);
            main.appendChild(record);
            return;
        }
        let neighbour = nodes[index+2]
        main.removeChild(record);
        main.insertBefore(record, neighbour);
    }
}
