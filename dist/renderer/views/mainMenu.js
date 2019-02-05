"use strict";
document.addEventListener("keydown", function (event) {
    console.log(event.key);
    switch (event.key) {
        case "1":
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "main0.html";
            break;
        case "2":
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "main1.html";
            break;
    }
});
document.addEventListener("mouseup", function (event) {
    console.log(event.button);
    if (event.button === 1)
        event.preventDefault();
});
