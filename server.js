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

/**
 * Get Requests
 */

// grab a specific child organization
app.get('/child/:childName', require('./routes/getters/get-org.js'));

// grab a specific parent organization
app.get('/parent/:pName', require('./routes/getters/get-org.js'));

// shows a specific child companies warehouse
app.get('/:childName/storage', require('./routes/getters/get-org.js'));

// shows all warehouses and the child company that owns them. 
app.get('/warehouses', require('./routes/getters/get-org.js'));


/**
 * Post Requests
 */

//  adding a parent company to our companies collection.
app.post('/api/parent', require('./routes/api/save-companies.js'));

// adding a child company to the parent company.childCompanies array
app.post('/api/child', require('./routes/api/save-companies.js'));

//  add warehouse to a child org
app.post('/api/storage', require('./routes/api/save-warehouses.js'));

//  add items to a warehouse 
app.post('/api/inventory', require('./routes/api/save-warehouses.js'));


/**
 * Put Requests
 */

// update the parentOrg name
app.put('/api/parent/:parentName', require('./routes/api/update/update-orgs.js'));

// update the childOrg name
app.put('/api/child/:childName', require('./routes/api/update/update-orgs.js'));

// update warehouse business sector

// update maxFloorSpace in warehouse

// update quantity of item in ware

// update item price


/**
 * Delete Requests
 */

// delete a warehouse

// delete single item from warehouse

// delete all items from warehouse





app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
})
 