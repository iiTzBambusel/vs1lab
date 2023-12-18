// File origin: VS1LAB A3 ,A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const InMemoryGeoTagStore = require('../models/geotag-store');
var taglist = new GeoTagStore();
/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => { //get request handeling für / als einstieg
  res.render('index', {taglist: taglist.getGeoTags() ,latitude: -1,longitude: -1,taglistJSON: JSON.stringify(taglist.getGeoTags())})
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post("/tagging", (req, res)=>{ //post request handeling for /tagging
  console.log("req.body :", req.body);
  taglist.addGeoTag({"name":req.body["name_IN"], "latitude":Number(req.body["latitude_IN"]), "longitude":Number(req.body["longitude_IN"]), "hashtag":req.body["hashtag_IN"]});
  res.render('index', { taglist: taglist.getGeoTags(), latitude:Number(req.body["latitude_IN"]), longitude:Number(req.body["longitude_IN"]), taglistJSON: JSON.stringify(taglist.getGeoTags())})
})

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post("/discovery", (req, res)=>{ //post request handeling for /discovery
  console.log("req.body :", req.body);

  res.render('index', { taglist: taglist.searchNearbyGeoTags(req.body.searchterm, Number(req.body.longitude), Number(req.body.latitude)),
                        latitude:Number(req.body.latitude), 
                        longitude:Number(req.body.longitude),
                        taglistJSON: JSON.stringify(taglist.searchNearbyGeoTags(req.body.searchterm, Number(req.body.longitude), Number(req.body.latitude)))})
})

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get("/api/geotags",(req,res)=>{
  //gets the latitude,longitude and searchterm from the request querry
  let seachtearm = req.query["searchterm"];
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  
  let searchedWithTerm ;
  if (seachtearm === undefined && latitude === undefined && longitude === undefined) {
    return res.json(taglist.getGeoTags()); //returns the respone of the whole taglist in json format
  }
  //searches for the searchterm if added in the query 
  searchedWithTerm = taglist.searchGeoTags(seachtearm); 
  if (searchedWithTerm.length === 0) {
    return res.json(taglist.getGeoTags());
  }
  let seachedWithTermAndPos;
  //if latitude and longitude are given the already filtered array will be filterd again for latitude and longitude
  if (latitude !== undefined && longitude !== undefined) {
      seachedWithTermAndPos = taglist.searchNearbyGeoTags(seachtearm,longitude,latitude);
  }else{
      seachedWithTermAndPos = searchedWithTerm; //if latitude and or longitude arent given the array only filtered by searchterm is returned
  }
   res.json(seachedWithTermAndPos); //returnes the searched array in json format
})


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post("/api/geotags",(req,res)=>{
  //gets the geotag from the request body
  let GeoTag = req.body; 
  let latitude = GeoTag.latitude;
  let longitude = GeoTag.longitude;
  let name = GeoTag.name;
  let hashtag = GeoTag.hashtag;
  
  //adds the geotag to "taglist"
  taglist.addGeoTagID({"name":name,"latitude":latitude,"longitude":longitude,"hashtag":hashtag}); //the id is handeled in geotag.js
  
  let tags = taglist.getGeoTags(); //gets the full array of tags
  let lastTag = tags[tags.length -1]; //gets the last geotag in the array wich is the newest geotag
  let responseHead = "http://localhost:3000/api/geotags/";
  responseHead += lastTag.id; //combines the address with the newest id to return in the head
  res.header("Location",responseHead); // returns the address to the new geotag
  res.json(lastTag); // returns the new geotag in json format
})



/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get("/api/geotags/:id",(req,res)=>{
  let id = req.params.id; //gets the id from the query parameters
  
  let searchedByID = taglist.searchGeoTagsID(id); // searches in taglist for the geotag with matching id
  res.send(JSON.stringify(searchedByID)) //returns the found geotag in json format
})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put("/api/geotags/:id",(req,res)=>{
  // gets the id from the query parameters
  let id = req.params.id; 
  
  //gets the name,latitude,longitude and hashtag from the request body
  let name = req.body["name"];  
  let latitude = req.body["latitude"];
  let longitude = req.body["longitude"];
  let hashtag = req.body["hashtag"]
  
  //searches for the geotag with matching id
  let searchedGeoTag = taglist.searchGeoTagsID(id);
  
  //changes the found geotag in "taglist"
  taglist.changeGeoTag(searchedGeoTag,name,latitude,longitude,hashtag);
  
  //gets the updated geotag from "taglist"
  searchedGeoTag = taglist.searchGeoTagsID(id);
  
  //returns the changed geotag in json format
  res.json(searchedGeoTag);

})


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete("/api/geotags/:id",(req,res)=>{
  let id = req.params.id; // get the id parameter from the request

  let geoTagToDelete = taglist.searchGeoTagsID(id); // searches the geotag to delete

  taglist.removeGeoTag(geoTagToDelete.name); //deletes the found geotag

  res.json(geoTagToDelete); //returns the deleted geotag in json format
})

module.exports = router;
