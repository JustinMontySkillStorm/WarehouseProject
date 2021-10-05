const router = require('express').Router();
const { resolve } = require('path');
const { addChildCompany, createParentCompany } = require('../../controllers/company/save-companies.js');

router.post('/api/save/child', async (req, res) => {
    try {
        const dbFeedback = await addChildCompany(req.body);
        console.log(dbFeedback);
        res.json(dbFeedback);
    } catch (err) {
        res.status(500).json(err);
    }
    
})

router.post('/api/save/parent', async (req,res) => {
    try {
        console.log(req.body);
        const dbFeedback = await createParentCompany(req.body);
        console.log(dbFeedback);
        res.json(dbFeedback);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.post('/api/save/storage', (req,res) => {
    // request needs to have which childCompany to add warehouse to.  
    // create warehouse 
    // save warehouse to its collection. keep _id 
    // find childCompany. 
    // add warehouse._id to childCompany storage
})

router.post('/api/save/inventory', (req, res) => {
    // find correct warehouse.  
    // build the item and push it into the warehouse's inventory array. 
})

module.exports = router;