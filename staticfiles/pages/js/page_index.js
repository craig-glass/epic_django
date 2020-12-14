
let PAGE_LINK_COUNT = 5; // Number of links listed at a time

let pageIndex = 0;
let pageCount = -1;
init();

function init() {
    getPageCount().then(function () {
        getPages(0, PAGE_LINK_COUNT);
    });
}

/**
 * Display a list of links to pages and update the navigation links
 * @param pageArray List of pages to link to
 */
function showPages(pageArray) {
    let pageDiv = document.getElementById("page-list");
    pageDiv.innerHTML = "";
    let counter = 0;
    // Create links leading to each page in pageArray
    for (let page of pageArray) {
        let link = document.createElement("a");
        link.href = "page/" + page[0];
        link.innerHTML = (pageIndex + counter++) + ":[ID=" + page[0] + "], " +
            (page[1] === "" ? "&ltNo Name&gt" : page[1]);
        pageDiv.appendChild(link);
        pageDiv.appendChild(document.createElement("br"));
    }

    let indexList = document.getElementById("index-list");
    indexList.innerHTML = "";
    let generator = generateNavigator(pageIndex, PAGE_LINK_COUNT, 7, pageCount, getPages)
    let nextElement = generator.next().value;
    // Generate and append navigation links around the current index
    while (nextElement != null) {
        indexList.appendChild(nextElement);
        nextElement = generator.next().value;
    }
}

/**
 * Create and yield navigation links for traversing long lists of data
 * @param currentIndex Index currently being displayed from
 * @param step Range each link should encompass
 * @param maxSteps Maximum number of navigation links to show
 * @param finalIndex Index of the final element in the data list
 * @param action Navigation function to be called upon clicking a link
 * @yield {HTMLElement|null} Navigation elements in order left to right
 */
function* generateNavigator(currentIndex, step, maxSteps, finalIndex, action) {
    // Largest possible start index (always ends with the finalIndex)
    let finalStepIndex = finalIndex - (finalIndex % step);

    // Link leading to the first step
    let backToBeginningLink = document.createElement("a");
    backToBeginningLink.innerHTML = "&lt&lt-";
    if (currentIndex !== 0) {
        applyLink(backToBeginningLink, 0, step, action);
    }
    yield backToBeginningLink;

    // Link leading one step before the current
    let backOneStepLink = document.createElement("a");
    backOneStepLink.innerHTML = "&lt-";
    if (currentIndex !== 0) {
        applyLink(backOneStepLink, currentIndex - step, currentIndex, action);
    }
    yield backOneStepLink;

    // Show ellipse if the first step is not shown
    if (currentIndex > step * Math.floor(maxSteps / 2 - 1)) {
        let ellipse1 = document.createElement("a");
        ellipse1.innerHTML = "...";
        yield ellipse1;
    }

    // Create all navigation links between the arrow links denoted by (start-stop)
    for (let i = -Math.floor(maxSteps / 2) + 1; i < maxSteps / 2 - 1; i++) {
        let startPos = currentIndex + step * i;
        let endPos = Math.min(startPos + step, finalIndex);
        if (startPos >= 0 && startPos <= finalStepIndex && startPos !== endPos) {
            let stepToIndex = document.createElement("a");
            if (startPos === 0) { // First index does not need a leading comma
                stepToIndex.innerHTML = startPos + "-" + endPos;
            } else {
                stepToIndex.innerHTML = "," + startPos + "-" + endPos;
            }
            // Don't highlight the link denoting the current index
            if (startPos !== currentIndex) {
                applyLink(stepToIndex, startPos, endPos, action);
            }
            yield stepToIndex;
        }
    }

    // Show ellipse if the final step is not shown
    if (currentIndex < finalIndex - step * Math.floor(maxSteps / 2)) {
        let ellipse2 = document.createElement("a");
        ellipse2.innerHTML = ",...";
        yield ellipse2;
    }

    // Link leading to the step after the current
    let forwardOneStepLink = document.createElement("a");
    forwardOneStepLink.innerHTML = "-&gt";
    if (currentIndex !== finalStepIndex) {
        applyLink(forwardOneStepLink, currentIndex + step, Math.min(currentIndex + step * 2, finalIndex), action);
    }
    yield forwardOneStepLink;

    // Link leading to the final step
    let forwardToEndLink = document.createElement("a");
    forwardToEndLink.innerHTML = "-&gt&gt";
    if (currentIndex !== finalStepIndex) {
        applyLink(forwardToEndLink, finalStepIndex, finalIndex, action);
    }
    yield forwardToEndLink;
}

/**
 * Highlight link and set navigation destination
 * @param link Element to assign to
 * @param from Start index
 * @param to End index
 * @param action Navigation function to be called when clicked
 */
function applyLink(link, from, to, action) {
    link.href = from + "-" + to;
    link.onclick = function() {
        action(from, to);
        return false;
    }
}

async function getPageCount() {
    await $.ajax({
        url: "/pages/ajax/get_page_count/",
        type: "POST",
        data: null,
        dataType: "json",
        success: function (response) {
            pageCount = response["count"];
        },
        error: function (response) {
            console.log("FAIL");
        }
    });
}

/**
 * Get subsection of the list of pages between the given parameters
 * @param start Inclusive start position to read from
 * @param stop Exclusive end position to read from
 */
function getPages(start, stop) {
    pageIndex = Math.max(0, start);
    stop = Math.min(stop, pageCount);
    $.ajax({
        url: "/pages/ajax/get_pages/",
        type: "POST",
        data: {"start": pageIndex, "stop": stop},
        dataType: "json",
        success: function (response) {
            showPages(response["pages"]);
        },
        error: function (response) {
            console.log("FAIL");
        }
    });
}
