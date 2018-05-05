const express = require('express'); //import express library
const path = require('path');
const unirest = require('unirest');

// var tinify = require("tinify"); // image compressor
// tinify.key = "-ZwwutwwYVLWKCZQnmDcMlSuDpWs5FFP";
// tinify.proxy = "http://user:pass@192.168.0.1:8080";

const app = express(); //instantiate express object

app.use(express.static(path.join(__dirname, 'static')));

const tempDatabase = {
	'Redwood': {
		intro: 'Redwood National and State Parks are a string of protected forests, ' +
		'beaches and grasslands along Northern California’s coast. Jedediah Smith ' +
		'Redwoods State Park has trails through dense old-growth woods. Prairie Creek' +
		' Redwoods State Park is home to Fern Canyon, with its high, plant-covered walls. ' +
		'Roosevelt elk frequent nearby Elk Prairie. Giant redwood clusters include ' + 
		'Redwood National Park’s Lady Bird Johnson Grove.',
		trails: [
		{
			name: 'Damnation',
			length: '0.5 miles',
			difficulty: 'Easy'
		},
		{
			name: 'Redwood Creek',
			length: '1.5 miles',
			difficulty: 'Medium'
		},
		{
			name: 'Stout Grove',
			length: '2.5 miles',
			difficulty: 'Hard'
		}
		// name: {
		// 	'<option>Damnation</option>', 
		// 	'<option>Redwood Creek</option>',
		// 	'<option>Stout Grove</option>'
		// },
		],
		pic: '<img src="images/redwood.jpeg" width="50%">'
	},
	'Sequoia': {
		intro: '',
		trails: [
		{
			name: 'Hazelwood Nature Trail',
			length: '2 miles',
			difficulty: 'Medium'
		}
		],
		pic: '<img src="images/sequoia.jpeg" width="50%">'
	},
	'Joshua Tree': {
		intro: '',
		trails: '<option>Arch Rock</option>', 
		pic: [
		'<img src="images/jtree.jpeg" width="50%">',
		'<img src="images/joshua1.jpg" width="50%">'
		]
	},
	'Alcatraz Island': {
		intro: '',
		trails: '<option>Agave Trail</option>',
		pic: '<img src="images/alcatraz.jpg" width="50%">'
	},
	'Yosemite': {
		intro: '',
		trails: [
		'<option>Half Dome</option>',
		'<option>Panorama</option>'
		],
		pic: '<img src="images/yosemite.jpg" width="50%">'
	},
	'Death Valley': {
		intro: '',
		trails: [
		'<option>Badwater Basin</option>',
		'<option>Gower Gulch</option>',
		'<option>Golden Canyon</option>'
		],
		pic: '<img src="images/deathvalley.jpg" width="50%">'
	}
};

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/static/home-page.html');
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


// get trails from API through some magic code
// this is trails in sequoia
function getTrails(callback) {
	unirest.get("https://trailapi-trailapi.p.mashape.com/?lat=36.4864&lon=-118.5658&q" + 
		"[activities_activity_type_name_eq]=hiking&radius=75")
	.header("X-Mashape-Key", "df9p8FHPrfmsh9SYeNClLGjG6bOap1kgwbijsn5hQ5dJ9NGLAJ")
	.header("Accept", "text/plain")
	.end(function(res) {
		if (res.error) {
			console.log('GET error', res.error);
			callback(res.error, null);
		} else {
			// console.log('GET response', res.body); // this is the full JSON object
			callback(null, res.body);
		}
	})
};

var request = getTrails(function(error, res) {
	console.log("test");
	if (error === null) { // console log whatever you need to here 
		for (let i = 0; i < res.places.length; i++) {
			console.log(res.places[i].name);
			console.log("Description: "  + res.places[i].description);
		}
	} else {
		console.log("err");
	}
});

// set this up somehow to grab the JSON data from request?
app.get('/trails', (req, res) => {
	const parkToLookUp = req.params.parkid;
	const val = tempDatabase[parkToLookUp];
});

// start port
app.listen(process.env.PORT || 3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
