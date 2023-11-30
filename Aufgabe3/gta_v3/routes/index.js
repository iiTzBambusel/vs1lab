// File origin: VS1LAB A3

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
  console.log("req.body.latitude_IN :", req.body["latitude_IN"]);
  console.log(req.body.name);
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

module.exports = router;
