// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */



/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
const GeoTagExamples = require("./geotag-examples"); //importiere geotag-examples datei 

class InMemoryGeoTagStore{
    constructor(){ } // iterieren über geotag examples 
    
    //funktion um die geotags als JSON mit 4 elementen zurückzugeben
    static #geoTags = GeoTagExamples.tagList.map((tag)=>{
        return{"name":tag[0], "latitude":tag[1], "longitude":tag[2], "hashtag":tag[3]}
        });  

    static addGeoTag(geoTag) {
        this.#geoTags.push(geoTag); //einen neuen geotag in das array pushen
        console.log(this.#geoTags); 
    }
    static removeGeoTag(params) {
        this.#geoTags.splice(this.#geoTags.findIndex((geoTag)=>geoTag.name===name),1)
        //überschreibt den gefundenen geotag im array mit nichts und löscht dadurch den eintrag
    }
    static getNearbyGeoTags(latitude,longitude) {
        console.log("in getnearby: ", this.#geoTags.filter((geoTag)=>this.#isInProximity(geoTag, latitude, longitude)));
        return this.#geoTags.filter((geoTag)=>this.#isInProximity(geoTag, latitude, longitude));
        //gibt die geotags zurück welche innerhalb eines radius von "20" um die aktuelle position liegen
    }

    static #isInProximity(geoTag, latitude, longitude){
        var distance = Math.sqrt((Math.abs(geoTag.latitude-latitude)**2)+Math.abs(geoTag.longitude-longitude)**2);
        console.log("Distance: ", distance);
        return distance <=20; 
        //returnes true if the distance between the given geotag and the current position is smaller than "20"
    }    

     static searchNearbyGeoTags(keyword, longitude, latitude){
    //console.log(this.getNearbyGeoTags(longitude, latitude).filter((geoTag)=>this.#testKeyword(geoTag, keyword)));
    return this.getNearbyGeoTags(longitude, latitude).filter((geoTag)=>this.#testKeyword(geoTag, keyword));
    //gibt die Geotags zurück welche den gesuchten begriff in namen oder hashtag enthalten
}
  
  static #testKeyword(geoTag, keyword){
    if (geoTag.name.includes(keyword)){
        return true;
    }else if(geoTag.hashtag.includes(keyword)){
        return true;
    }
    return false;
    //überprüft ob im namen oder im Hashtag des Geotags der Gesuchte begriff enthalten ist 
  }
}


module.exports = InMemoryGeoTagStore
