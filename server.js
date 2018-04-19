const express = require('express');
const handlebars = require('express3-handlebars');

const app = express();

app.use(express.static('static_files'));

//Routes for actual pages
app.get('/', /* Function for displaying homepage */);

app.listen(3000, () => {
    console.log('Server listening on port 3000'); 
});
