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
				// console.log('GET response', res.body.places[0].description); // this is the full JSON object
				trailList = makeTrailList(null, res.body); // callback returns the JSON from unirest
				response.send(trailList);
			}
		});
});


function makeTrailList(error, result) {

	let trail_names = []; // array of all trail names in park 

	if (error === null) {
		//console.log(result);
		for (let i = 0; i < result.places.length; i++) {
            
			// add trail names and descriptions to array
            trail_names[i] = [result.places[i].name, result.places[i].description]; 

        }

        return trail_names; // send array of all trail names in park

    } else {
    	console.log("err - makeTrailList()");
    }
};

// start port
app.listen(process.env.PORT || 3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
