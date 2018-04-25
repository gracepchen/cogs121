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
    'Damnation<br>', 
    'Redwood Creek<br>',
    'Stout Grove<br>'
    ],
    pic: '<img src="redwood.jpeg" width="60%">'
  },
  'Sequoia': {
    trails: 'Hazelwood Nature Trail', 
    pic: '<img src="sequoia.jpeg" width="60%">'
  },
  'Joshua Tree': {
    trails: 'Arch Rock', 
    pic: [
    '<img src="jtree.jpeg" width="60%">',
    '<img src="joshua1.jpg" width="60%">'
    ]
  },
  'Alcatraz Island': {
    trails: 'Agave Trail',
    pic: '<img src="alcatraz.jpg" width="60%">'
  },
  'Yosemite': {
    trails: [
    'Half Dome<br>',
    'Panorama<br>'
    ],
    pic: '<img src="yosemite.jpg" width="60%">'
  },
  'Death Valley': {
    trails: [
    'Badwater Basin<br>',
    'Gower Gulch<br>',
    'Golden Canyon'
    ],
    pic: '<img src="deathvalley.jpg" width="60%">'
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
