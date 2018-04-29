const express = require('express'); //import express library
const path = require('path');

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
		pic: '<img src="redwood.jpeg" width="50%">'
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
		pic: '<img src="sequoia.jpeg" width="50%">'
	},
	'Joshua Tree': {
		intro: '',
		trails: '<option>Arch Rock</option>', 
		pic: [
		'<img src="jtree.jpeg" width="50%">',
		'<img src="joshua1.jpg" width="50%">'
		]
	},
	'Alcatraz Island': {
		intro: '',
		trails: '<option>Agave Trail</option>',
		pic: '<img src="alcatraz.jpg" width="50%">'
	},
	'Yosemite': {
		intro: '',
		trails: [
		'<option>Half Dome</option>',
		'<option>Panorama</option>'
		],
		pic: '<img src="yosemite.jpg" width="50%">'
	},
	'Death Valley': {
		intro: '',
		trails: [
		'<option>Badwater Basin</option>',
		'<option>Gower Gulch</option>',
		'<option>Golden Canyon</option>'
		],
		pic: '<img src="deathvalley.jpg" width="50%">'
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
	console.log('allParks is: ', allParks);
	res.send(allParks);
});

app.get('/parks/:parkid', (req, res) => {
	const parkToLookUp = req.params.parkid;
	const val = tempDatabase[parkToLookUp];

	console.log(parkToLookUp, '->', val);
	if (val) {
		res.send(val);
	}
	else {
		res.send({});
	}

});

app.listen(3000, () => {
	console.log('Listening on Port 3000');
});
