
let PAGE_LINK_COUNT = 5; // Number of links listed at a time

let pageIndex = 0;
let pageCount = -1;
init();

function init() {
    getPageCount().then(function () {
        getPages(0, PAGE_LINK_COUNT);
    });
}

function showPages2(pageArray) {
    let pageDiv = document.getElementById("page-list");
    pageDiv.innerHTML = "";
    let counter = 0;
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
    let generator = generateNavigator(pageIndex, PAGE_LINK_COUNT, 5, pageCount)
    let nextElement = generator.next().value;
    while (nextElement != null) {
        indexList.appendChild(nextElement);
        nextElement = generator.next().value;
    }
}

function* generateNavigator(currentIndex, step, maxSteps, finalIndex) {
    let finalStepIndex = finalIndex - (finalIndex % step);

    let backToBeginningLink = document.createElement("a");
    backToBeginningLink.innerHTML = "&lt&lt-";
    if (currentIndex !== 0) {
        applyLink(backToBeginningLink, 0, step, getPages);
    }
    yield backToBeginningLink;

    let backOneStepLink = document.createElement("a");
    backOneStepLink.innerHTML = "&lt-";
    if (currentIndex !== 0) {
        applyLink(backOneStepLink, currentIndex - step, currentIndex, getPages);
    }
    yield backOneStepLink;

    if (currentIndex > step * Math.floor(maxSteps / 2 - 1)) {
        let ellipse1 = document.createElement("a");
        ellipse1.innerHTML = "...,";
        yield ellipse1;
    }

    for (let i = -Math.floor(maxSteps / 2) + 1; i < maxSteps / 2 - 1; i++) {
        let startPos = currentIndex + step * i;
        if (startPos >= 0 && startPos <= finalStepIndex) {
            let stepToIndex = document.createElement("a");
            if (startPos === finalIndex) {
                stepToIndex.innerHTML = startPos + "-" + (startPos + step);
            } else {
                stepToIndex.innerHTML = startPos + "-" + (startPos + step) + ",";
            }
            applyLink(stepToIndex, startPos, startPos + step, getPages);
            yield stepToIndex;
        }
    }

    if (currentIndex < finalIndex - step * Math.floor(maxSteps / 2)) {
        let ellipse2 = document.createElement("a");
        ellipse2.innerHTML = "...";
        yield ellipse2;
    }

    let forwardOneStepLink = document.createElement("a");
    forwardOneStepLink.innerHTML = "-&gt";
    if (currentIndex !== finalStepIndex) {
        applyLink(forwardOneStepLink, currentIndex + step, currentIndex + step * 2, getPages);
    }
    yield forwardOneStepLink;

    let forwardToEndLink = document.createElement("a");
    forwardToEndLink.innerHTML = "-&gt&gt";
    if (currentIndex !== finalStepIndex) {
        applyLink(forwardToEndLink, finalStepIndex, finalIndex, getPages);
    }
    yield forwardToEndLink;

    yield null;
}

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

function getPages(start, stop) {
    pageIndex = Math.max(0, start);
    stop = Math.min(stop, pageCount);
    $.ajax({
        url: "/pages/ajax/get_pages/",
        type: "POST",
        data: {"start": pageIndex, "stop": stop},
        dataType: "json",
        success: function (response) {
            showPages2(response["pages"]);
        },
        error: function (response) {
            console.log("FAIL");
        }
    });
}

function dummyFunction() {
    return false;
}
