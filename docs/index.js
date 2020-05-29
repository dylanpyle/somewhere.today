"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var points = [
    {
        type: "PLACE",
        starting: new Date("2020-01-01"),
        location: "New York, NY",
    },
    {
        type: "PLACE",
        starting: new Date("2020-03-25T12:00-05:00"),
        location: "Detroit, MI",
    },
    {
        type: "TRAVEL",
        method: "driving",
        destination: "Brooklyn, NY",
        starting: new Date("2020-05-30T08:00-05:00"),
    },
    {
        type: "PLACE",
        location: "Brooklyn, NY",
        starting: new Date("2020-05-30T20:00-05:00"),
    },
    {
        type: "TRAVEL",
        method: "driving",
        destination: "Detroit, MI",
        starting: new Date("2020-06-09T08:00-05:00"),
    },
    {
        type: "PLACE",
        location: "Detroit, MI",
        starting: new Date("2020-06-09T20:00-05:00"),
    },
];
function getElement(selector) {
    var el = document.querySelector(selector);
    if (!el) {
        throw new Error("Could not find element " + selector);
    }
    return el;
}
function getCurrentPoint() {
    var point = __spreadArrays(points).reverse()
        .find(function (point) { return point.starting <= new Date(); });
    if (!point) {
        throw new Error("Could not find a current point");
    }
    return point;
}
function getPointDescription(point) {
    switch (point.type) {
        case "PLACE":
            return "in " + point.location;
        case "TRAVEL":
            return point.method + " to " + point.destination;
    }
}
function getPointDate(point) {
    return point.starting.toLocaleDateString();
}
function getUpcomingTravel() {
    return points.filter(function (point) { return point.starting > new Date(); });
}
function uppercase(str) {
    return str.toUpperCase();
}
function capitalize(str) {
    return str.replace(/[a-z]/, uppercase);
}
function render() {
    var currentLocationEl = getElement(".current-location");
    var arrivalDateEl = getElement(".arrival-date");
    var upcomingTravelEl = getElement(".upcoming-travel");
    var currentPoint = getCurrentPoint();
    var pointDescription = getPointDescription(currentPoint);
    currentLocationEl.innerHTML = pointDescription;
    arrivalDateEl.innerHTML = getPointDate(currentPoint);
    var upcomingTravel = getUpcomingTravel();
    for (var _i = 0, upcomingTravel_1 = upcomingTravel; _i < upcomingTravel_1.length; _i++) {
        var point = upcomingTravel_1[_i];
        var li = document.createElement("li");
        var emoji = point.type === "PLACE" ? "📍" : "🚙";
        var description = emoji + " " + capitalize(getPointDescription(point));
        li.innerHTML = description + " on " + getPointDate(point);
        upcomingTravelEl.appendChild(li);
    }
}
function onGoogleMapsLoaded() {
    var mapEl = getElement(".map");
    var maps = window.google.maps;
    var currentPoint = getCurrentPoint();
    var geocoder = new maps.Geocoder();
    var locationDescription = currentPoint.type === "PLACE"
        ? currentPoint.location
        : currentPoint.destination;
    geocoder.geocode({ address: locationDescription }, function (results, status) {
        if (status !== "OK") {
            alert(status);
        }
        new maps.Map(mapEl, {
            center: results[0].geometry.location,
            zoom: 6,
            disableDefaultUI: true,
        });
    });
}
render();
//# sourceMappingURL=index.js.map