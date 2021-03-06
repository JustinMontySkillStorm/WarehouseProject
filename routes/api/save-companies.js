const router = require('express').Router();
const { resolve } = require('path');
const { addChildCompany, createParentCompany } = require('../../controllers/company/save-companies.js');

// adds a childCompany to the parentCompany that is passed in through req.body
router.post('/api/child', async (req, res) => {
    try {
        const dbFeedback = await addChildCompany(req.body);
        // console.log(dbFeedback);
        res.json(dbFeedback);
    } catch (err) {
        res.status(500).json(err);
    }
    
})

// adds a parentCompany to our database with the name passed in through req.body
router.post('/api/parent', async (req,res) => {
    try {
        console.log(req.body);
        const dbFeedback = await createParentCompany(req.body);
        console.log(dbFeedback);
        res.json(dbFeedback);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;