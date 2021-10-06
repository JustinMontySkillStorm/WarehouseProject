const express = require('express');
const { resolve } = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8088;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res) => {
    console.log('working');
    res.send('Hello');
})

// doesn't work how I thought it would maybe delete later. 
app.get('/child/:childName', require('./routes/getters/get-org.js'));

// getter to grab a specific parent organization
app.get('/parent/:pName', require('./routes/getters/get-org.js'));

// getter to grab the warehouses along with their owners.  
app.get('/warehouses', require('./routes/getters/get-warehouse.js'));

// post request to add warehouse to a child org
app.post('/api/save/storage', require('./routes/api/save-warehouses.js'));

// post request to add items to a warehouse 
app.post('/api/save/inventory', require('./routes/api/save-warehouses.js'));

// post request for adding a parent company to our companies collection.
app.post('/api/save/parent', require('./routes/api/save-companies.js'));

// post request for adding a child company to the parent company.childCompanies array
app.post('/api/save/child', require('./routes/api/save-companies.js'));


app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
})
 