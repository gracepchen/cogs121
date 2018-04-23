const express = require('express'); //import express library
const path = require('path');

const app = express(); //instantiate express object

app.use(express.static(path.join(__dirname, 'static')));

const tempDatabase = {
  'Redwood': {
    trails: 'Damnation', 
    pic: 'redwood.jpeg'
  },
  'Sequoia': {
    trails: 'Hazelwood Nature Trail', 
    pic: 'sequoia.jpeg'
  },
  'Joshua Tree': {
    trails: 'Arch Rock', 
    pic: 'jtree.jpeg'
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
