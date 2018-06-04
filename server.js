/*
 * This file creates the nodejs backend for our app. It configures the server information, and then
 * starts the server. It also handles get and post requests from the frontend and feeds information
 * back. Finally, the app is responsible for backend API calls, since one particular API cannot
 * be called from the frontend, due to security reasons.
 *
 */

const express = require('express'); //import express library
const path = require('path');
const unirest = require('unirest');
const bodyParser = require('body-parser');

const app = express(); //instantiate express object

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/static/index2.html');
});

app.get('/map-page', (req, res) => {
	res.sendFile(__dirname + '/static/index2.html');
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
        console.log(result.places[0].lat);
		for (let i = 0; i < result.places.length; i++) {
            
			// add trail names and descriptions to array
            trail_names[i] = [result.places[i].name,
                result.places[i].description, result.places[i].lat,
                result.places[i].lon]; 

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
