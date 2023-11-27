// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(location){
    
    console.log(location);
    document.getElementById("latitude_IN").setAttribute("value",location.latitude);
    document.getElementById("longitude_IN").setAttribute("value",location.longitude);
    document.getElementById("latitude").setAttribute("value",location.latitude);
    document.getElementById("longitude").setAttribute("value",location.longitude);
    console.log((document.getElementById("mapView").getAttribute("data-tags")));
    document.getElementById("mapView").setAttribute("src",new MapManager("tBFb64lQDimgku1PUVfyJYyRdeejzfUo").getMapUrl(location.latitude,location.longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")),16));
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    LocationHelper.findLocation(updateLocation);
});