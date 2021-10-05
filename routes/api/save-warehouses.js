const router = require('express').Router();
const {resolve} = require('path');
const { addWarehouse } = require('../../controllers/warehouse/save-warehouses.js');


router.post('/api/save/storage', async (req,res) => {
    try {
        const dbFeedback = await addWarehouse(req.body);
        console.log(dbFeedback);
        res.status(201).json(dbFeedback);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
    
})

router.post('/api/save/inventory', (req, res) => {
    // find correct warehouse.  
    // build the item and push it into the warehouse's inventory array. 
})


module.exports = router;