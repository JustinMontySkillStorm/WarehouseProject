const router = require('express').Router();
const { resolve } = require('path');
const { addChildCompany, createParentCompany } = require('../../controllers/company/save-companies.js');

router.post('/api/child', async (req, res) => {
    try {
        const dbFeedback = await addChildCompany(req.body);
        // console.log(dbFeedback);
        res.json(dbFeedback);
    } catch (err) {
        res.status(500).json(err);
    }
    
})

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