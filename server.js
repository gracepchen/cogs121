const express = require('express'); //import express library
const path = require('path');
const unirest = require('unirest');
const bodyParser = require('body-parser');

// var tinify = require("tinify"); // image compressor
// tinify.key = "-ZwwutwwYVLWKCZQnmDcMlSuDpWs5FFP";
// tinify.proxy = "http://user:pass@192.168.0.1:8080";

const app = express(); //instantiate express object

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/static/index2.html');
});

app.get('/map-page', (req, res) => {
	res.sendFile(__dirname + '/static/index2.html');
});

app.get('/parks', (req, res) => {
	const allParks = Object.keys(tempDatabase);
	// console.log('allParks is: ', allParks);
	res.send(allParks);
});

app.get('/parks/:parkid', (req, res) => {
	const parkToLookUp = req.params.parkid;
	const val = tempDatabase[parkToLookUp];

	// console.log(parkToLookUp, '->', val);
	if (val) {
		res.send(val);
	}
	else {
		res.send({});
	}
});

app.get('/places', (req, res) => {
	const parkToLookUp = req.params.parkid;
	const val = tempDatabase[parkToLookUp];
});

app.post('/trails/:parkid', (request, response) => {
	console.log(request.body);
	const trailURL = request.body.parkLocation;
	let trailList = [];

	// get trail data
	unirest.get(trailURL)
		.header("X-Mashape-Key", "df9p8FHPrfmsh9SYeNClLGjG6bOap1kgwbijsn5hQ5dJ9NGLAJ")
		.header("Accept", "text/plain")
		.end(function(res) {
			if (res.error) {
				//console.log('GET error', res.error);
				makeTrailList(res.error, null);
			} else {
				//console.log('GET response', res.body); // this is the full JSON object
				trailList = makeTrailList(null, res.body); // callback returns the JSON from unirest
				response.send(trailList);
			}
		});
	});

// FIND A WAY TO GENERALIZE THIS URL USING LAT AND LONG coordinates from other API
// EXECUTE THIS LATER, WHEN THE BUTTON HAS BEEN CLICKED
/*
let trailURL = "https://trailapi-trailapi.p.mashape.com/?lat=36.4864&lon=-118.5658" +
"&q[activities_activity_type_name_eq]=hiking&radius=75";
*/

/*
// get trails from API through some magic code
// this is trails in sequoia only for now
function getTrails(callback) {
}*/

// use the function above to get the actual JSON and send it to frontend

function makeTrailList(error, result) {

	let trail_names = [[]]; // array of all trail names in park 

	if (error === null) {
		//console.log(result);

		for (let i = 0; i < result.places.length; i++) {
			//console.log(result.places[i].name);
			// console.log("Description: "  + result.places[i].description);
		}

		for (let i = 0; i < result.places.length; i++) {
            trail_names[i] = result.places[i].name; // add trail names to array

           	// add descriptions to array
            // trail_names[i[i]] = result.places[i].description;
            // console.log(trail_names[i[i]]); // descriptions

        }

        // useless line, but can be modified later to give better data
        const allTrails = Object.keys(result.places[0]);

        console.log(trail_names);
        console.log(trail_names[1[1]]); // descriptions
        return trail_names; // send array of all trail names in park

    } else {
    	console.log("err");
    }
};

/*
var request = getTrails(function(error, result) {
	let trail_names = []; // array of all trail names in park (sequoia only for now)

	if (error === null) {
		//console.log(result);

		for (let i = 0; i < result.places.length; i++) {
			//console.log(result.places[i].name);
			// console.log("Description: "  + result.places[i].description);
		}

		// set this up somehow to grab the JSON data from request?
		// Generalize this somehow with /:parkID to get trails per park?

		// The app.get() below returns a list of trail names to the frontend
		app.get('/trails', (req, res) => {

			//console.log("result: " + result.places.length); // number of trails

			for (let i = 0; i < result.places.length; i++) {
				trail_names[i] = result.places[i].name; // add trail names to array
			}

			// useless line, but can be modified later to give better data
			const allTrails = Object.keys(result.places[0]);
			res.send(trail_names); // send array of all trail names in park
		});
	} else {
		console.log("err");
	}
});*/

// start port
app.listen(process.env.PORT || 3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
