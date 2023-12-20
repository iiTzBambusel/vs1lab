// File origin: VS1LAB A2

//const { application } = require("express");
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
    document.getElementById("mapView").setAttribute("src",new MapManager("tBFb64lQDimgku1PUVfyJYyRdeejzfUo").getMapUrl(location.latitude,location.longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")),14));
}

function fetchGeoTags() {
    //Send an asynchronous GET request to the server
    fetch('http://localhost:3000/api/geotags/?' + new URLSearchParams({
        'searchterm': document.getElementById('searchterm').value,
        'longitude': document.getElementById('longitude').getAttribute('value'),
        'latitude': document.getElementById('latitude').getAttribute('value'),
    }), {
        method: 'GET',
    })
    .then(res => res.json()) //if the response is in json format res.json will convert the response to an js object
    .then(geoTags =>{
        let list = document.getElementById("discoveryResults"); 
        list.innerHTML = ""; //Clear discovery results list
        
        //create new discovery results list 
        for (let geoTag of geoTags) { //iterate over the geoTags objects 
            var entry = document.createElement("li"); //for every geotag create a new li element
            entry.appendChild(document.createTextNode(
                geoTag.name +"("
                + geoTag.latitude + ","
                + geoTag.longitude +")"
                + geoTag.hashtag));
            //add li elements to the discovery results list
            list.appendChild(entry);
        }
        //update the map with geoTags from the fetch response 
        document.getElementById("mapView").setAttribute("src",new MapManager("tBFb64lQDimgku1PUVfyJYyRdeejzfUo")
        .getMapUrl(document.getElementById("latitude_IN").getAttribute("value"),
                   document.getElementById("longitude_IN").getAttribute("value"), geoTags,14));
    })
    //clear the input fields values
    document.getElementById("name_IN").value = "";
    document.getElementById("hashtag_IN").value = "";
    document.getElementById("searchterm").value = "";
}

document.getElementById("taggingButton").addEventListener("click",(e)=>{
    //prevention of submitting the from
    e.preventDefault();
    //Check for empty or false inputs for name and hashtag (form validation)
    if (document.getElementById("name_IN").value === "") {
        alert("Please enter a name for the geoTag.");
        return;
      }
    if (document.getElementById("hashtag_IN").value !== "") {
     
        let pattern = new RegExp(/^#[a-zA-Z]{1,10}$/);
        if (!pattern.test(document.getElementById("hashtag_IN").value)) {
          alert("Please enter a valid hashtag for the geoTag.");
          return;
        }   
    }
    //create a geoTag object using the information given in the form elements
    let geoTag = {
        name: document.getElementById("name_IN").value,
        latitude: document.getElementById("latitude_IN").getAttribute("value"),
        longitude: document.getElementById("longitude_IN").getAttribute("value"),
        hashtag: document.getElementById("hashtag_IN").value
    };
    //// Send an asynchronous POST request to the server
   fetch("http://localhost:3000/api/geotags",{
        method: "POST",
        body: JSON.stringify(geoTag),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(_ =>{
        // After the request is completed, update the geotags list
        fetchGeoTags();
    })
});

    document.getElementById("discoveryButton").addEventListener("click",(e) =>{
        //prevention of submitting the from
        e.preventDefault(); 
        //update the geotag list
        fetchGeoTags();
        
    });

    

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    LocationHelper.findLocation(updateLocation);
});