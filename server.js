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

// getter to hopefully return just the childOrg object. 
app.get('/:childName', require('./routes/getters/get-child-org.js'));

// post request for adding a parent company to our companies collection.
app.post('/api/save/parent', require('./routes/api/save-companies.js'));

// post request for adding a child company to the parent company.childCompanies array
app.post('/api/save/child', require('./routes/api/save-companies.js'));


app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
})
 