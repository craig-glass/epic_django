
let haveYouBeenWarned = false;
let textOptions = "";
let idCounter = 0;
generateOptions();
if (pageId === 'null') { // No page id given, create new page
    pageId = null;
    addRecord(null, null);
} else { // Page id given, edit page
    setEditMode();
    getPageData(pageId);
}

/**
 * Alter html to show edit mode specific content
 */
function setEditMode() {
    document.getElementById("header").innerHTML = "Edit Page";
    let previewButton = document.getElementById("preview-button");
    previewButton.hidden = false;
    let deleteButton = document.getElementById("delete-page-button");
    deleteButton.hidden = false;
}

/**
 * Generate <option> tags to populate the type <selector> with in each record
 */
function generateOptions() {
    textOptions = "<option value='text'>text</option>";
}

/**
 * Add new record to the page in the position of recordInsertId, or at the end if null or not found.
 * @param {String|null} recordInsertId Id of an existing record to insert new record before
 * @param {Object.<String, any>|null} recordMeta Metadata describing the contents of the record
 */
function addRecord(recordInsertId, recordMeta) {
    let main = document.getElementById("main");

    // Record <div> to hold the data section
    let record = document.createElement("div");
    record.id = "R" + (idCounter++).toString();
    record.className = "record";
    record.style.overflow = "hidden";

    // Toolbar <div> shown at the top of the record
    let topBar = document.createElement("div");
    topBar.className = "top";
    // topBar.style.border = "1px solid red";
    topBar.style.overflow = "hidden";

    // <div> to hold the actual data
    let content = document.createElement("div");
    content.className = "content";
    content.style.border = "1px dashed lightblue";
    content.style.overflow = "hidden";

    // Toolbar <div> shown at the bottom of the record
    let bottomBar = document.createElement("div");
    bottomBar.className = "bottom";
    // bottomBar.style.border = "1px solid blue";
    bottomBar.style.overflow = "hidden";

    let idLabel = document.createElement("p");
    idLabel.innerHTML = "ID:" + record.id;
    idLabel.style.paddingRight = "20px";
    idLabel.style.float = "left";

    // <button> to shift record up
    let moveUpButton = document.createElement("button");
    moveUpButton.innerHTML = "▲";
    moveUpButton.style.float = "right";
    moveUpButton.onclick = function() { moveRecord(record.id, "up"); };

    let selectorLabel = document.createElement("p");
    selectorLabel.innerHTML = "Type:";
    selectorLabel.style.float = "left";

    // <select> to choose type of data to be held
    let typeSelector = document.createElement("select");
    typeSelector.className = "type";
    typeSelector.innerHTML = textOptions;
    typeSelector.style.float = "left";
    if (recordMeta !== null) {
        typeSelector.value = recordMeta["type"];
    } else {
        typeSelector.value = "text";
    }

    // <button> to add new record below this record
    let addNewButton = document.createElement("button");
    addNewButton.innerHTML = "+";
    addNewButton.onclick = function () { addRecord(record.id, null); };
    addNewButton.style.float = "left";

    // <button> to remove this record
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "-";
    removeButton.onclick = function () { main.removeChild(record) };
    removeButton.style.float = "left";

    // <button> to shift record down
    let moveDownButton = document.createElement("button");
    moveDownButton.innerHTML = "▼";
    moveDownButton.style.float = "right";
    moveDownButton.onclick = function() { moveRecord(record.id, "down"); };

    topBar.appendChild(idLabel);
    topBar.appendChild(selectorLabel);
    topBar.appendChild(typeSelector);
    topBar.appendChild(moveUpButton);

    bottomBar.appendChild(addNewButton);
    bottomBar.appendChild(removeButton);
    bottomBar.appendChild(moveDownButton);

    record.appendChild(topBar);
    record.appendChild(document.createElement("br"))
    record.appendChild(content);
    record.appendChild(document.createElement("br"))
    record.appendChild(bottomBar);

    let success = false;
    let next = false;
    // Find recordInsertId and insert new record before it
    for (let node of main.childNodes) {
        if (next) {
            main.insertBefore(record, node);
            success = true;
            break;
        }
        if (node.id === recordInsertId) {
            next = true;
        }
    }
    // Append new record if recordInsertId was not found
    if (!success) {
        main.appendChild(record);
    }
    // Update contents <div> to hold corresponding data type
    setRecord(record.id, recordMeta);
}

/**
 * Shift position of record by one.
 * @param {String} record_id Id of the record to be moved
 * @param {String} direction Shift one place up if set to "up", or one place down if set to "down", otherwise do nothing
 */
function moveRecord(record_id, direction) {
    let main = document.getElementById("main");
    let record = document.getElementById(record_id);
    let nodes = main.childNodes;
    let currentIndex = Array.prototype.slice.call(nodes).indexOf(record);
    if (direction === "up") {
        if (currentIndex === 0) { // Cannot move up more
            return;
        }
        // Shift up one space
        let neighbour = nodes[currentIndex-1]
        main.removeChild(record);
        main.insertBefore(record, neighbour);
    } else if (direction === "down") {
        if (currentIndex >= nodes.length - 2) { // Moving to end of array
            main.removeChild(record);
            main.appendChild(record);
            return;
        }
        // Shift up one space
        let neighbour = nodes[currentIndex+2]
        main.removeChild(record);
        main.insertBefore(record, neighbour);
    }
}

/**
 * Set the content <div> in the record to contain elements corresponding to its type
 * @param {String} record_id Id of the record to update
 * @param {Object.<String, any>|null} recordMeta Metadata describing the contents of the record
 */
function setRecord(record_id, recordMeta) {
    let record = document.getElementById(record_id);
    let type = record.querySelector("div[class='top']").querySelector("select[class='type']").value;
    record.querySelector("div[class='content']").innerHTML = "";
    // Call setup function corresponding to the set record type
    switch (type) {
        case "text":
            setRecordText(record, recordMeta);
            break;
    }
}

/**
 * Set record content <div> to contain text-area based elements
 * @param {HTMLElement} record Record to update
 * @param {Object.<String, any>|null} recordMeta Metadata describing the contents of the record
 */
function setRecordText(record, recordMeta) {
    let content = record.querySelector("div[class='content']");
    let textArea = document.createElement("textarea");
    textArea.style.width = "100%";
    textArea.oninput = function () {
        textArea.style.height = '';
        textArea.style.height = textArea.scrollHeight + 3 + "px"
    };
    if (recordMeta !== null) {
        if (recordMeta["type"] === "text") {
            textArea.value = recordMeta["data"]
        }
    }

    content.appendChild(textArea);
}

/**
 * Call ajax to store the page in the databse
 */
function save() {
    // Parse page data into json format
    let pageData = {
        "name": document.getElementById("page-name-input").value,
        "records": []
    };
    for (let record of document.getElementById("main").querySelectorAll("div[class='record']")) {
        let recordData = {};
        let contents = record.querySelector("div[class='content']");
        let type = record.querySelector("div[class='top']").querySelector("select[class='type']").value;
        recordData["type"] = type;
        switch (type) {
            case "text":
                recordData["data"] = contents.querySelector("textarea").value;
                break;
        }
        pageData["records"].push(recordData);
    }
    // Call save ajax
    $.ajax({
        url: "/pages/ajax/save_page/",
        type: "POST",
        data: {
            "page_id": pageId,
            "page_data": JSON.stringify(pageData)
        },
        dataType: "json",
        success: function (response) {
            let messageLabel = document.getElementById("save-response-p");
            if (response["overwrite"]) {
                messageLabel.innerHTML = "Page with id: " + response["page_id"] + " has been updated";
            } else {
                // On successful creation redirect to the edit page for the new page
                window.location.replace("/pages/edit/" + response["page_id"]);
            }

        },
        error: function (response) {
            document.getElementById("save-response-p").innerHTML = "Failed to save. Reason: " +
                response["responseText"];
        }
    });
}

/**
 * Load data for a page of given id from the database
 * @param {String} pageId Id of the page to load
 */
function getPageData(pageId) {
    $.ajax({
        url: "/pages/ajax/get_page_data/",
        type: "POST",
        data: {"page_id": pageId},
        dataType: "json",
        success: function (response) {
            document.getElementById("page-name-input").value = response["page_name"];
            document.getElementById("main").innerHTML = "";
            // Load received data into records
            for (let record of response["page_data"]) {
                addRecord(null, record);
            }
        },
        error: function (response) {
            document.getElementById("save-response-p").innerHTML = "Failed to load. Reason: " +
                response["responseText"];
        }
    });
}

function deletePage() {
    if (haveYouBeenWarned) {
        $.ajax({
            url: "/pages/ajax/delete_page/",
            type: "POST",
            data: {"page_id": pageId},
            dataType: "json",
            success: function (response) {
                window.location.replace("/pages/")
            },
            error: function (response) {
                document.getElementById("save-response-p").innerHTML = "Failed to delete. Reason: " +
                    response["responseText"];
            }
        });
    } else {
        window.alert("Warning! A page cannot be recovered after being deleted.\n" +
            "Press again if you are sure you want to delete this page.")
        haveYouBeenWarned = true;
    }
}
