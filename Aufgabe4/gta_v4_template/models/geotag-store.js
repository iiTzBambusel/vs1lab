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
const GeoTag = require("./geotag");

class InMemoryGeoTagStore{
    #geoTags =[];
    constructor(){ 
        // iterieren über geotag examples 
        for (let i =0; i < (GeoTagExamples.tagList).length; i++){
            this.#geoTags.push(new GeoTag(GeoTagExamples.tagList[i][0],GeoTagExamples.tagList[i][1],GeoTagExamples.tagList[i][2],GeoTagExamples.tagList[i][3]));
        }

        }

        //App Zugriff\\

    //funktion um die geotags als JSON mit 4 elementen zurückzugeben
    getGeoTags(){
        return this.#geoTags;
    } 

     addGeoTag(GeoTag) {
         this.#geoTags.push(GeoTag);
    }
     removeGeoTag(name) {
        for(let i = 0; i < this.#geoTags.length; i++) {
            if(name === this.#geoTags[i].name) {
                this.#geoTags.splice(i);
                break;
            }
        }
        //überschreibt den gefundenen geotag im array mit nichts und löscht dadurch den eintrag
    }
    getNearbyGeoTags(latitude,longitude) {
        var result = [];
        for (let i = 0; i < this.#geoTags.length; i++) {
            if (this.#isInProximity(this.#geoTags[i],latitude,longitude)) {
                result.push(this.#geoTags[i]);
            }
        }
        return result;
        //gibt die geotags zurück welche innerhalb eines radius von "20" um die aktuelle position liegen
    }

    #isInProximity(geoTag, latitude, longitude){
        var distance = Math.sqrt((Math.abs(geoTag.latitude-latitude)**2)+Math.abs(geoTag.longitude-longitude)**2);
        console.log("Distance: ", distance);
        return distance <=20;
        //returnes true if the distance between the given geotag and the current position is smaller than "20"
    }    

    searchNearbyGeoTags(keyword, longitude, latitude){
    
    //gibt die Geotags zurück welche den gesuchten begriff in namen oder hashtag enthalten
        var results = [];
        for (let i = 0; i < this.#geoTags.length ; i++) {
            if (this.#testKeyword(this.#geoTags[i],keyword)&&this.#isInProximity(this.#geoTags[i],latitude,longitude)) {
                results.push(this.#geoTags[i]);
            }
        }
        return results;
}   
  
    #testKeyword(geoTag, keyword){
    if (geoTag.name.includes(keyword)){
        return true;
    }else if(geoTag.hashtag.includes(keyword)){
        return true;
    }
    return false;
    //überprüft ob im namen oder im Hashtag des Geotags der Gesuchte begriff enthalten ist 
  }
  
  //Api Zugriff\\
  searchGeoTags(keyword){
    
    //gibt die Geotags zurück welche den gesuchten begriff in namen oder hashtag enthalten
        var results = [];
               for (let i = 0; i < this.#geoTags.length ; i++) {
            var name = this.#geoTags[i].name; // get the name of the current geotag
            if (name.includes(keyword)) { //test if name includes the keyword
                results.push(this.#geoTags[i]);
            }
        }
        return results;
}
searchGeoTagsID(id){ //iterates over the array of geotags and returns the geotag with matching id

    for (let i = 0; i < this.#geoTags.length ; i++) {
        if (this.#geoTags[i].id == id) {
            return this.#geoTags[i];
        }
    }
}
addGeoTagID(geoTag){ //adds a new geotag using the geotag constructor to handle the Id attribute
    let name = geoTag.name;
    let latitude = geoTag.latitude;
    let longitude = geoTag.longitude;
    let hashtag = geoTag.hashtag;
    this.#geoTags.push(new GeoTag(name,latitude,longitude,hashtag))
}
#getIndex(id){ //searches for the index of a geotag with matching id and returns it
    let index = 0;
    while (index < this.#geoTags.length) {
        if (this.#geoTags[index].id === id) {
          return index;
        }
        index++;
      }
      
    
}
changeGeoTag(geoTag,name,latitude,longitude,hashtag){ //overrides the name,latitude,longitude and hashtag attribute of an geotag
var index = this.#getIndex(geoTag.id);
console.log(index);
this.#geoTags[index].name = name;
this.#geoTags[index].latitude = latitude;
this.#geoTags[index].longitude = longitude;
this.#geoTags[index].hashtag = hashtag;
}

}


module.exports = InMemoryGeoTagStore