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

app.post('/api/savechild', require('./routes/api/save-child.js'));

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
})
 