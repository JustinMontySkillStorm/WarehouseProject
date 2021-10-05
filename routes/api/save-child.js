const router = require('express').Router();
const { resolve } = require('path');
const { addChildCompany, addStorage, addItem } = require('../../controllers/save-child-company.js');

router.post('/api/savechild', (req, res) => {
    addChildCompany(req.body);
    res.sendStatus(200);
})

router.post('/api/addStorage', (req,res) => {
    // request needs to have which childCompany to add warehouse to.  
    // create warehouse 
    // save warehouse to its collection. keep _id 
    // find childCompany. 
    // add warehouse._id to childCompany storage
})

router.post('/api/addInventory', (req, res) => {
    // find correct warehouse.  
    // build the item and push it into the warehouse's inventory array. 
})

module.exports = router;